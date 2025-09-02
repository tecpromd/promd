import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useAnalytics = (timeRange = '30d') => {
  const [analytics, setAnalytics] = useState({
    overview: {
      totalFlashcards: 0,
      totalQuestions: 0,
      studiedToday: 0,
      weeklyProgress: 0,
      streak: 0,
      totalStudyTime: 0,
      avgAccuracy: 0
    },
    performance: [],
    disciplines: [],
    recentActivity: [],
    studyStats: {
      flashcardsStudied: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      studyTimeMinutes: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Carregar estatísticas gerais
      const [flashcardsResult, questionsResult, progressResult] = await Promise.all([
        supabase.from('flashcards').select('id, created_at, difficulty_level, discipline'),
        supabase.from('questions').select('id, created_at, category, difficulty'),
        supabase.from('user_progress').select('*')
      ]);

      if (flashcardsResult.error) throw flashcardsResult.error;
      if (questionsResult.error) throw questionsResult.error;
      if (progressResult.error) throw progressResult.error;

      const flashcards = flashcardsResult.data || [];
      const questions = questionsResult.data || [];
      const progress = progressResult.data || [];

      // 2. Calcular estatísticas de overview
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      const studiedToday = progress.filter(p => 
        new Date(p.last_studied) >= todayStart
      ).length;

      const studiedThisWeek = progress.filter(p => 
        new Date(p.last_studied) >= weekAgo
      ).length;

      const totalStudyTime = progress.reduce((total, p) => 
        total + (p.study_time_minutes || 0), 0
      );

      const correctAnswers = progress.filter(p => p.difficulty_rating === 'easy').length;
      const totalAnswers = progress.length;
      const avgAccuracy = totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0;

      // 3. Calcular streak (dias consecutivos de estudo)
      let streak = 0;
      let currentDate = new Date(today);
      
      while (streak < 365) { // Máximo 365 dias
        const dayStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
        
        const studiedThisDay = progress.some(p => {
          const studyDate = new Date(p.last_studied);
          return studyDate >= dayStart && studyDate < dayEnd;
        });

        if (studiedThisDay) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }

      // 4. Agrupar por disciplinas
      const disciplineStats = {};
      
      flashcards.forEach(flashcard => {
        const discipline = flashcard.discipline || 'Geral';
        if (!disciplineStats[discipline]) {
          disciplineStats[discipline] = {
            name: discipline,
            flashcards: 0,
            studied: 0,
            accuracy: 0,
            totalRatings: 0,
            correctRatings: 0
          };
        }
        disciplineStats[discipline].flashcards++;
      });

      progress.forEach(p => {
        const flashcard = flashcards.find(f => f.id === p.flashcard_id);
        const discipline = flashcard?.discipline || 'Geral';
        
        if (disciplineStats[discipline]) {
          disciplineStats[discipline].studied++;
          disciplineStats[discipline].totalRatings++;
          if (p.difficulty_rating === 'easy') {
            disciplineStats[discipline].correctRatings++;
          }
        }
      });

      // Calcular accuracy por disciplina
      Object.values(disciplineStats).forEach(discipline => {
        discipline.accuracy = discipline.totalRatings > 0 
          ? (discipline.correctRatings / discipline.totalRatings) * 100 
          : 0;
      });

      // 5. Performance ao longo do tempo (últimos 6 meses)
      const performanceData = [];
      for (let i = 5; i >= 0; i--) {
        const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const nextMonth = new Date(today.getFullYear(), today.getMonth() - i + 1, 1);
        
        const monthProgress = progress.filter(p => {
          const studyDate = new Date(p.last_studied);
          return studyDate >= monthDate && studyDate < nextMonth;
        });

        const monthCorrect = monthProgress.filter(p => p.difficulty_rating === 'easy').length;
        const monthAccuracy = monthProgress.length > 0 
          ? (monthCorrect / monthProgress.length) * 100 
          : 0;

        performanceData.push({
          month: monthDate.toLocaleDateString('pt-BR', { month: 'short' }),
          accuracy: Math.round(monthAccuracy),
          questions: monthProgress.length
        });
      }

      // 6. Atividade recente
      const recentActivity = progress
        .sort((a, b) => new Date(b.last_studied) - new Date(a.last_studied))
        .slice(0, 10)
        .map(p => {
          const flashcard = flashcards.find(f => f.id === p.flashcard_id);
          return {
            id: p.id,
            type: 'flashcard',
            title: flashcard?.title || 'Flashcard',
            discipline: flashcard?.discipline || 'Geral',
            difficulty: p.difficulty_rating,
            date: p.last_studied,
            studyTime: p.study_time_minutes || 0
          };
        });

      // 7. Estatísticas de estudo
      const studyStats = {
        flashcardsStudied: progress.length,
        questionsAnswered: progress.length, // Assumindo 1 questão por flashcard
        correctAnswers: correctAnswers,
        studyTimeMinutes: totalStudyTime
      };

      setAnalytics({
        overview: {
          totalFlashcards: flashcards.length,
          totalQuestions: questions.length,
          studiedToday,
          weeklyProgress: Math.min((studiedThisWeek / 7) * 100, 100),
          streak,
          totalStudyTime,
          avgAccuracy: Math.round(avgAccuracy)
        },
        performance: performanceData,
        disciplines: Object.values(disciplineStats),
        recentActivity,
        studyStats
      });

    } catch (err) {
      console.error('Erro ao carregar analytics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  return {
    analytics,
    loading,
    error,
    refreshAnalytics: loadAnalytics
  };
};

