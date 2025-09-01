import { useState, useEffect } from 'react';
import { spacedRepetition } from '../data/spacedRepetition';

const STORAGE_KEY = 'promd_user_progress';

export const useSpacedRepetition = () => {
  const [userProgress, setUserProgress] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Carregar progresso do localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setUserProgress(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Erro ao carregar progresso:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Salvar progresso no localStorage
  const saveProgress = (newProgress) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
      setUserProgress(newProgress);
    } catch (error) {
      console.error('Erro ao salvar progresso:', error);
    }
  };

  // Registrar resposta de uma questão
  const recordAnswer = (questionId, isCorrect, difficulty = 'normal') => {
    const performance = isCorrect ? 
      (difficulty === 'very_easy' ? 4 : difficulty === 'easy' ? 3 : 2) : 0;
    
    const newProgress = spacedRepetition.updateUserProgress(
      questionId, 
      performance, 
      userProgress
    );
    
    saveProgress(newProgress);
    
    return newProgress[questionId];
  };

  // Obter questões para revisão hoje
  const getReviewQuestions = () => {
    return spacedRepetition.getQuestionsForReview(userProgress);
  };

  // Obter estatísticas de progresso
  const getStats = () => {
    return spacedRepetition.getProgressStats(userProgress);
  };

  // Obter progresso de uma questão específica
  const getQuestionProgress = (questionId) => {
    return userProgress[questionId] || null;
  };

  // Verificar se uma questão está devido para revisão
  const isQuestionDue = (questionId) => {
    const progress = userProgress[questionId];
    if (!progress || !progress.nextReviewDate) return true;
    
    const today = new Date();
    const reviewDate = new Date(progress.nextReviewDate);
    return reviewDate <= today;
  };

  // Obter próximas questões por prioridade
  const getNextQuestions = (limit = 10) => {
    const reviewQuestions = getReviewQuestions();
    return reviewQuestions.slice(0, limit);
  };

  // Resetar progresso de uma questão
  const resetQuestionProgress = (questionId) => {
    const newProgress = { ...userProgress };
    delete newProgress[questionId];
    saveProgress(newProgress);
  };

  // Resetar todo o progresso
  const resetAllProgress = () => {
    saveProgress({});
  };

  // Exportar dados de progresso
  const exportProgress = () => {
    return {
      data: userProgress,
      exportDate: new Date().toISOString(),
      stats: getStats()
    };
  };

  // Importar dados de progresso
  const importProgress = (progressData) => {
    try {
      if (progressData && typeof progressData === 'object') {
        saveProgress(progressData.data || progressData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao importar progresso:', error);
      return false;
    }
  };

  return {
    // Estado
    userProgress,
    isLoading,
    
    // Ações principais
    recordAnswer,
    getReviewQuestions,
    getStats,
    getQuestionProgress,
    isQuestionDue,
    getNextQuestions,
    
    // Gerenciamento
    resetQuestionProgress,
    resetAllProgress,
    exportProgress,
    importProgress,
    
    // Utilitários
    saveProgress
  };
};

