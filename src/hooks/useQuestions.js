import { useState, useEffect } from 'react';

// Hook para gerenciar banco de questões usando localStorage
export const useQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carregar questões do localStorage na inicialização
  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = () => {
    try {
      const stored = localStorage.getItem('promd_questions');
      if (stored) {
        setQuestions(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Erro ao carregar questões:', err);
      setError('Erro ao carregar questões');
    }
  };

  const saveQuestions = (newQuestions) => {
    try {
      localStorage.setItem('promd_questions', JSON.stringify(newQuestions));
      setQuestions(newQuestions);
    } catch (err) {
      console.error('Erro ao salvar questões:', err);
      setError('Erro ao salvar questões');
    }
  };

  const createQuestion = async (questionData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newQuestion = {
        id: Date.now().toString(),
        ...questionData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: 'local_user',
        attempts: 0,
        correct_attempts: 0,
        last_attempt: null,
        difficulty_rating: questionData.difficulty || 'Intermediário'
      };

      const updatedQuestions = [...questions, newQuestion];
      saveQuestions(updatedQuestions);
      
      setLoading(false);
      return { data: newQuestion, error: null };
    } catch (err) {
      setLoading(false);
      setError('Erro ao criar questão');
      return { data: null, error: err.message };
    }
  };

  const updateQuestion = async (id, updates) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedQuestions = questions.map(question => 
        question.id === id 
          ? { ...question, ...updates, updated_at: new Date().toISOString() }
          : question
      );
      
      saveQuestions(updatedQuestions);
      setLoading(false);
      return { data: updatedQuestions.find(question => question.id === id), error: null };
    } catch (err) {
      setLoading(false);
      setError('Erro ao atualizar questão');
      return { data: null, error: err.message };
    }
  };

  const deleteQuestion = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedQuestions = questions.filter(question => question.id !== id);
      saveQuestions(updatedQuestions);
      
      setLoading(false);
      return { error: null };
    } catch (err) {
      setLoading(false);
      setError('Erro ao deletar questão');
      return { error: err.message };
    }
  };

  const recordAttempt = async (questionId, isCorrect) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return { error: 'Questão não encontrada' };

    const updates = {
      attempts: question.attempts + 1,
      correct_attempts: question.correct_attempts + (isCorrect ? 1 : 0),
      last_attempt: new Date().toISOString(),
      last_attempt_correct: isCorrect
    };

    return await updateQuestion(questionId, updates);
  };

  const getQuestionsByDiscipline = (disciplineId) => {
    return questions.filter(question => question.discipline_id === disciplineId);
  };

  const getQuestionsByContent = (contentId) => {
    return questions.filter(question => question.content_id === contentId);
  };

  const getQuestionsByDifficulty = (difficulty) => {
    return questions.filter(question => question.difficulty === difficulty);
  };

  const getQuestionsByType = (type) => {
    return questions.filter(question => question.type === type);
  };

  const searchQuestions = (query) => {
    const lowercaseQuery = query.toLowerCase();
    return questions.filter(question => 
      question.title?.toLowerCase().includes(lowercaseQuery) ||
      question.statement?.toLowerCase().includes(lowercaseQuery) ||
      question.explanation?.toLowerCase().includes(lowercaseQuery) ||
      question.alternatives?.some(alt => alt.text?.toLowerCase().includes(lowercaseQuery))
    );
  };

  const getRandomQuestions = (count, filters = {}) => {
    let filteredQuestions = [...questions];

    // Aplicar filtros
    if (filters.discipline_id) {
      filteredQuestions = filteredQuestions.filter(q => q.discipline_id === filters.discipline_id);
    }
    if (filters.difficulty) {
      filteredQuestions = filteredQuestions.filter(q => q.difficulty === filters.difficulty);
    }
    if (filters.type) {
      filteredQuestions = filteredQuestions.filter(q => q.type === filters.type);
    }

    // Embaralhar e retornar quantidade solicitada
    const shuffled = filteredQuestions.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const getQuestionStats = () => {
    const total = questions.length;
    const byDifficulty = questions.reduce((acc, question) => {
      acc[question.difficulty] = (acc[question.difficulty] || 0) + 1;
      return acc;
    }, {});
    
    const byDiscipline = questions.reduce((acc, question) => {
      acc[question.discipline_id] = (acc[question.discipline_id] || 0) + 1;
      return acc;
    }, {});

    const byType = questions.reduce((acc, question) => {
      acc[question.type] = (acc[question.type] || 0) + 1;
      return acc;
    }, {});

    const attempted = questions.filter(question => question.attempts > 0).length;
    const totalAttempts = questions.reduce((sum, question) => sum + question.attempts, 0);
    const totalCorrect = questions.reduce((sum, question) => sum + question.correct_attempts, 0);
    const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

    return {
      total,
      attempted,
      accuracy,
      totalAttempts,
      totalCorrect,
      byDifficulty,
      byDiscipline,
      byType
    };
  };

  const clearAllQuestions = () => {
    localStorage.removeItem('promd_questions');
    setQuestions([]);
  };

  const exportQuestions = () => {
    const dataStr = JSON.stringify(questions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `promd_questions_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importQuestions = (jsonData) => {
    try {
      const importedQuestions = JSON.parse(jsonData);
      if (Array.isArray(importedQuestions)) {
        const mergedQuestions = [...questions, ...importedQuestions];
        saveQuestions(mergedQuestions);
        return { success: true, count: importedQuestions.length };
      }
      return { success: false, error: 'Formato inválido' };
    } catch (err) {
      return { success: false, error: 'Erro ao importar dados' };
    }
  };

  return {
    questions,
    loading,
    error,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    recordAttempt,
    getQuestionsByDiscipline,
    getQuestionsByContent,
    getQuestionsByDifficulty,
    getQuestionsByType,
    searchQuestions,
    getRandomQuestions,
    getQuestionStats,
    clearAllQuestions,
    exportQuestions,
    importQuestions,
    refreshQuestions: loadQuestions
  };
};

export default useQuestions;

