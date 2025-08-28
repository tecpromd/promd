import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useQuestionsSupabase = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar questões do Supabase
  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('questions')
        .select(`
          *,
          discipline:disciplines(*),
          alternatives:question_alternatives(*)
        `)
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;

      setQuestions(data || []);
    } catch (err) {
      console.error('Erro ao carregar questões:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Criar nova questão
  const createQuestion = async (questionData) => {
    try {
      const questionId = crypto.randomUUID();
      
      // Inserir questão
      const { data: questionInserted, error: questionError } = await supabase
        .from('questions')
        .insert({
          ...questionData,
          id: questionId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (questionError) throw questionError;

      // Inserir alternativas se existirem
      if (questionData.alternatives && questionData.alternatives.length > 0) {
        const alternativesToInsert = questionData.alternatives.map((alt, index) => ({
          id: crypto.randomUUID(),
          question_id: questionId,
          letter: alt.letter || String.fromCharCode(65 + index), // A, B, C, D, E...
          text: alt.text,
          is_correct: alt.is_correct || false,
          explanation: alt.explanation || '',
          created_at: new Date().toISOString()
        }));

        const { error: alternativesError } = await supabase
          .from('question_alternatives')
          .insert(alternativesToInsert);

        if (alternativesError) throw alternativesError;
      }

      // Recarregar questão com relacionamentos
      const { data: fullQuestion, error: fullQuestionError } = await supabase
        .from('questions')
        .select(`
          *,
          discipline:disciplines(*),
          alternatives:question_alternatives(*)
        `)
        .eq('id', questionId)
        .single();

      if (fullQuestionError) throw fullQuestionError;

      setQuestions(prev => [fullQuestion, ...prev]);
      return fullQuestion;
    } catch (err) {
      console.error('Erro ao criar questão:', err);
      throw err;
    }
  };

  // Atualizar questão
  const updateQuestion = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          discipline:disciplines(*),
          alternatives:question_alternatives(*)
        `)
        .single();

      if (error) throw error;

      setQuestions(prev => 
        prev.map(question => 
          question.id === id ? data : question
        )
      );

      return data;
    } catch (err) {
      console.error('Erro ao atualizar questão:', err);
      throw err;
    }
  };

  // Deletar questão
  const deleteQuestion = async (id) => {
    try {
      // Deletar alternativas primeiro (cascade)
      await supabase
        .from('question_alternatives')
        .delete()
        .eq('question_id', id);

      // Deletar questão
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setQuestions(prev => prev.filter(question => question.id !== id));
    } catch (err) {
      console.error('Erro ao deletar questão:', err);
      throw err;
    }
  };

  // Importar questões em lote
  const importQuestions = async (questionsData) => {
    try {
      const questionsToInsert = [];
      const alternativesToInsert = [];

      questionsData.forEach(questionData => {
        const questionId = crypto.randomUUID();
        
        // Preparar questão
        questionsToInsert.push({
          id: questionId,
          title: questionData.title,
          description: questionData.description,
          question_text: questionData.question || questionData.question_text,
          correct_answer: questionData.correct_answer || questionData.answer,
          explanation: questionData.explanation || questionData.justification,
          discipline_id: questionData.discipline_id || questionData.discipline,
          content_type: questionData.content_type || 'qf',
          difficulty: questionData.difficulty || 'medium',
          tags: questionData.tags || [],
          metadata: questionData.metadata || {},
          image_url: questionData.image_url,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

        // Preparar alternativas se existirem
        if (questionData.alternatives && questionData.alternatives.length > 0) {
          questionData.alternatives.forEach((alt, index) => {
            alternativesToInsert.push({
              id: crypto.randomUUID(),
              question_id: questionId,
              letter: alt.letter || String.fromCharCode(65 + index),
              text: alt.text,
              is_correct: alt.is_correct || false,
              explanation: alt.explanation || '',
              created_at: new Date().toISOString()
            });
          });
        }
      });

      // Inserir questões
      const { data: insertedQuestions, error: questionsError } = await supabase
        .from('questions')
        .insert(questionsToInsert)
        .select();

      if (questionsError) throw questionsError;

      // Inserir alternativas se existirem
      if (alternativesToInsert.length > 0) {
        const { error: alternativesError } = await supabase
          .from('question_alternatives')
          .insert(alternativesToInsert);

        if (alternativesError) throw alternativesError;
      }

      // Recarregar questões com relacionamentos
      const questionIds = insertedQuestions.map(q => q.id);
      const { data: fullQuestions, error: fullQuestionsError } = await supabase
        .from('questions')
        .select(`
          *,
          discipline:disciplines(*),
          alternatives:question_alternatives(*)
        `)
        .in('id', questionIds);

      if (fullQuestionsError) throw fullQuestionsError;

      setQuestions(prev => [...fullQuestions, ...prev]);
      return fullQuestions;
    } catch (err) {
      console.error('Erro ao importar questões:', err);
      throw err;
    }
  };

  // Filtrar questões
  const getQuestionsByDiscipline = (disciplineId) => {
    return questions.filter(question => question.discipline_id === disciplineId);
  };

  const getQuestionsByContentType = (contentType) => {
    return questions.filter(question => question.content_type === contentType);
  };

  const getQuestionsByDifficulty = (difficulty) => {
    return questions.filter(question => question.difficulty === difficulty);
  };

  // Buscar questões
  const searchQuestions = (query) => {
    if (!query) return questions;
    
    const lowercaseQuery = query.toLowerCase();
    return questions.filter(question => 
      question.title?.toLowerCase().includes(lowercaseQuery) ||
      question.question_text?.toLowerCase().includes(lowercaseQuery) ||
      question.explanation?.toLowerCase().includes(lowercaseQuery) ||
      question.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  // Estatísticas
  const getStats = () => {
    const total = questions.length;
    const byDifficulty = {
      easy: questions.filter(q => q.difficulty === 'easy').length,
      medium: questions.filter(q => q.difficulty === 'medium').length,
      hard: questions.filter(q => q.difficulty === 'hard').length,
      veryHard: questions.filter(q => q.difficulty === 'very_hard').length
    };
    const byContentType = {
      qf: questions.filter(q => q.content_type === 'qf').length,
      highYield: questions.filter(q => q.content_type === 'high_yield').length,
      review: questions.filter(q => q.content_type === 'review').length
    };

    return {
      total,
      byDifficulty,
      byContentType
    };
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  return {
    questions,
    loading,
    error,
    loadQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    importQuestions,
    getQuestionsByDiscipline,
    getQuestionsByContentType,
    getQuestionsByDifficulty,
    searchQuestions,
    getStats
  };
};

