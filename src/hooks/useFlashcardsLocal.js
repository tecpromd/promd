import { useState, useEffect } from 'react';
import flashcardsMedicos from '../data/flashcards-medicos.js';

export const useFlashcardsLocal = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carregar flashcards (locais + pré-carregados)
  const loadFlashcards = () => {
    try {
      // Carregar flashcards salvos localmente
      const savedFlashcards = JSON.parse(localStorage.getItem('promd-flashcards') || '[]');
      
      // Combinar com flashcards pré-carregados
      const allFlashcards = [...flashcardsMedicos, ...savedFlashcards];
      
      setFlashcards(allFlashcards);
      return allFlashcards;
    } catch (err) {
      console.error('Erro ao carregar flashcards:', err);
      setError('Erro ao carregar flashcards');
      return [];
    }
  };

  // Carregar flashcards ao inicializar
  useEffect(() => {
    loadFlashcards();
  }, []);

  // Salvar flashcards no localStorage
  const saveFlashcards = (flashcardsToSave) => {
    try {
      localStorage.setItem('promd-flashcards', JSON.stringify(flashcardsToSave));
    } catch (err) {
      console.error('Erro ao salvar flashcards:', err);
      setError('Erro ao salvar flashcards');
    }
  };

  // Criar novo flashcard
  const createFlashcard = (flashcardData) => {
    try {
      const newFlashcard = {
        id: Date.now().toString(),
        ...flashcardData,
        createdAt: new Date().toISOString(),
        attempts: 0,
        correctAttempts: 0,
        lastStudied: null,
        difficulty: flashcardData.difficulty || 3
      };

      const updatedFlashcards = [...flashcards, newFlashcard];
      setFlashcards(updatedFlashcards);
      saveFlashcards(updatedFlashcards);
      
      return { success: true, flashcard: newFlashcard };
    } catch (err) {
      console.error('Erro ao criar flashcard:', err);
      setError('Erro ao criar flashcard');
      return { success: false, error: err.message };
    }
  };

  // Atualizar flashcard
  const updateFlashcard = (id, updates) => {
    try {
      const updatedFlashcards = flashcards.map(flashcard =>
        flashcard.id === id ? { ...flashcard, ...updates } : flashcard
      );
      setFlashcards(updatedFlashcards);
      saveFlashcards(updatedFlashcards);
      return { success: true };
    } catch (err) {
      console.error('Erro ao atualizar flashcard:', err);
      setError('Erro ao atualizar flashcard');
      return { success: false, error: err.message };
    }
  };

  // Deletar flashcard
  const deleteFlashcard = (id) => {
    try {
      const updatedFlashcards = flashcards.filter(flashcard => flashcard.id !== id);
      setFlashcards(updatedFlashcards);
      saveFlashcards(updatedFlashcards);
      return { success: true };
    } catch (err) {
      console.error('Erro ao deletar flashcard:', err);
      setError('Erro ao deletar flashcard');
      return { success: false, error: err.message };
    }
  };

  // Registrar tentativa de estudo
  const recordAttempt = (id, isCorrect, difficulty = null) => {
    try {
      const updatedFlashcards = flashcards.map(flashcard => {
        if (flashcard.id === id) {
          const updates = {
            attempts: (flashcard.attempts || 0) + 1,
            correctAttempts: (flashcard.correctAttempts || 0) + (isCorrect ? 1 : 0),
            lastStudied: new Date().toISOString()
          };
          
          if (difficulty !== null) {
            updates.difficulty = difficulty;
          }
          
          return { ...flashcard, ...updates };
        }
        return flashcard;
      });
      
      setFlashcards(updatedFlashcards);
      saveFlashcards(updatedFlashcards);
      return { success: true };
    } catch (err) {
      console.error('Erro ao registrar tentativa:', err);
      setError('Erro ao registrar tentativa');
      return { success: false, error: err.message };
    }
  };

  // Buscar flashcards
  const searchFlashcards = (query) => {
    if (!query) return flashcards;
    
    const lowerQuery = query.toLowerCase();
    return flashcards.filter(flashcard =>
      flashcard.title?.toLowerCase().includes(lowerQuery) ||
      flashcard.question?.toLowerCase().includes(lowerQuery) ||
      flashcard.answer?.toLowerCase().includes(lowerQuery) ||
      flashcard.justification?.toLowerCase().includes(lowerQuery)
    );
  };

  // Filtrar por disciplina
  const getFlashcardsByDiscipline = (discipline) => {
    if (!discipline) return flashcards;
    return flashcards.filter(flashcard => flashcard.discipline === discipline);
  };

  // Filtrar por dificuldade
  const getFlashcardsByDifficulty = (difficulty) => {
    if (!difficulty) return flashcards;
    return flashcards.filter(flashcard => flashcard.difficulty === difficulty);
  };

  // Obter flashcards aleatórios
  const getRandomFlashcards = (count = 10) => {
    const shuffled = [...flashcards].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Obter estatísticas
  const getFlashcardStats = () => {
    const total = flashcards.length;
    const studied = flashcards.filter(f => f.attempts > 0).length;
    const totalAttempts = flashcards.reduce((sum, f) => sum + (f.attempts || 0), 0);
    const totalCorrect = flashcards.reduce((sum, f) => sum + (f.correctAttempts || 0), 0);
    const accuracy = totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0;

    return {
      total,
      studied,
      accuracy: Math.round(accuracy),
      totalAttempts,
      totalCorrect
    };
  };

  // Limpar todos os dados
  const clearAllFlashcards = () => {
    localStorage.removeItem('promd-flashcards');
    setFlashcards([]);
  };

  // Recarregar flashcards
  const reloadFlashcards = () => {
    loadFlashcards();
  };

  return {
    flashcards,
    loading,
    error,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    recordAttempt,
    searchFlashcards,
    getFlashcardsByDiscipline,
    getFlashcardsByDifficulty,
    getRandomFlashcards,
    getFlashcardStats,
    clearAllFlashcards,
    reloadFlashcards
  };
};

export default useFlashcardsLocal;

