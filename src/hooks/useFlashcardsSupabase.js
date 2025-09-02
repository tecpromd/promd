import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useFlashcardsSupabase = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar flashcards do Supabase
  const loadFlashcards = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('flashcards')
        .select(`
          *,
          discipline:disciplines(*)
        `)
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;

      setFlashcards(data || []);
    } catch (err) {
      console.error('Erro ao carregar flashcards:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Criar novo flashcard
  const createFlashcard = async (flashcardData) => {
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .insert({
          ...flashcardData,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select(`
          *,
          discipline:disciplines(*)
        `)
        .single();

      if (error) throw error;

      setFlashcards(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Erro ao criar flashcard:', err);
      throw err;
    }
  };

  // Atualizar flashcard
  const updateFlashcard = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          discipline:disciplines(*)
        `)
        .single();

      if (error) throw error;

      setFlashcards(prev => 
        prev.map(flashcard => 
          flashcard.id === id ? data : flashcard
        )
      );

      return data;
    } catch (err) {
      console.error('Erro ao atualizar flashcard:', err);
      throw err;
    }
  };

  // Deletar flashcard
  const deleteFlashcard = async (id) => {
    try {
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFlashcards(prev => prev.filter(flashcard => flashcard.id !== id));
    } catch (err) {
      console.error('Erro ao deletar flashcard:', err);
      throw err;
    }
  };

  // Importar flashcards em lote
  const importFlashcards = async (flashcardsData) => {
    try {
      const flashcardsToInsert = flashcardsData.map(flashcard => ({
        ...flashcard,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const { data, error } = await supabase
        .from('flashcards')
        .insert(flashcardsToInsert)
        .select(`
          *,
          discipline:disciplines(*)
        `);

      if (error) throw error;

      setFlashcards(prev => [...data, ...prev]);
      return data;
    } catch (err) {
      console.error('Erro ao importar flashcards:', err);
      throw err;
    }
  };

  // Filtrar flashcards
  const getFlashcardsByDiscipline = (disciplineId) => {
    return flashcards.filter(flashcard => flashcard.discipline_id === disciplineId);
  };

  const getFlashcardsByContentType = (contentType) => {
    return flashcards.filter(flashcard => flashcard.content_type === contentType);
  };

  const getFlashcardsByDifficulty = (difficulty) => {
    return flashcards.filter(flashcard => flashcard.difficulty === difficulty);
  };

  // Buscar flashcards
  const searchFlashcards = (query) => {
    if (!query) return flashcards;
    
    const lowercaseQuery = query.toLowerCase();
    return flashcards.filter(flashcard => 
      flashcard.title?.toLowerCase().includes(lowercaseQuery) ||
      flashcard.question?.toLowerCase().includes(lowercaseQuery) ||
      flashcard.answer?.toLowerCase().includes(lowercaseQuery) ||
      flashcard.explanation?.toLowerCase().includes(lowercaseQuery)
    );
  };

  // Estatísticas
  const getStats = () => {
    const total = flashcards.length;
    const byDifficulty = {
      easy: flashcards.filter(f => f.difficulty === 'easy').length,
      medium: flashcards.filter(f => f.difficulty === 'medium').length,
      hard: flashcards.filter(f => f.difficulty === 'hard').length,
      veryHard: flashcards.filter(f => f.difficulty === 'very_hard').length
    };
    const byContentType = {
      qf: flashcards.filter(f => f.content_type === 'qf').length,
      highYield: flashcards.filter(f => f.content_type === 'high_yield').length,
      review: flashcards.filter(f => f.content_type === 'review').length
    };

    return {
      total,
      byDifficulty,
      byContentType
    };
  };

  useEffect(() => {
    loadFlashcards();
  }, []);

  return {
    flashcards,
    loading,
    error,
    loadFlashcards,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    importFlashcards,
    getFlashcardsByDiscipline,
    getFlashcardsByContentType,
    getFlashcardsByDifficulty,
    searchFlashcards,
    getStats
  };
};

