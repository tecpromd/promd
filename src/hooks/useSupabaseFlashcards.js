import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import flashcardsMedicos from '../data/flashcards-medicos.js'

export const useSupabaseFlashcards = () => {
  const [flashcards, setFlashcards] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Carregar flashcards (Supabase + pré-carregados)
  const loadFlashcards = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Verificar se usuário está logado
      const { data: { user } } = await supabase.auth.getUser()
      
      let supabaseFlashcards = []
      
      if (user) {
        // Carregar flashcards do usuário do Supabase
        const { data, error: supabaseError } = await supabase
          .from('flashcards')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        
        if (supabaseError) {
          console.error('Erro ao carregar flashcards do Supabase:', supabaseError)
        } else {
          supabaseFlashcards = data || []
        }
      }
      
      // Combinar flashcards pré-carregados + Supabase
      const allFlashcards = [...flashcardsMedicos, ...supabaseFlashcards]
      setFlashcards(allFlashcards)
      
      return allFlashcards
    } catch (err) {
      console.error('Erro ao carregar flashcards:', err)
      setError('Erro ao carregar flashcards')
      // Em caso de erro, retornar apenas os pré-carregados
      setFlashcards(flashcardsMedicos)
      return flashcardsMedicos
    } finally {
      setLoading(false)
    }
  }

  // Criar flashcard
  const createFlashcard = async (flashcardData) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Usuário não está logado')
      }

      const { data, error: supabaseError } = await supabase
        .from('flashcards')
        .insert([{
          ...flashcardData,
          user_id: user.id,
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (supabaseError) throw supabaseError

      // Atualizar lista local
      setFlashcards(prev => [data, ...prev])
      
      return { data, error: null }
    } catch (err) {
      console.error('Erro ao criar flashcard:', err)
      setError('Erro ao criar flashcard')
      return { data: null, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Atualizar flashcard
  const updateFlashcard = async (id, flashcardData) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Usuário não está logado')
      }

      const { data, error: supabaseError } = await supabase
        .from('flashcards')
        .update(flashcardData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (supabaseError) throw supabaseError

      // Atualizar lista local
      setFlashcards(prev => prev.map(f => f.id === id ? data : f))
      
      return { data, error: null }
    } catch (err) {
      console.error('Erro ao atualizar flashcard:', err)
      setError('Erro ao atualizar flashcard')
      return { data: null, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Deletar flashcard
  const deleteFlashcard = async (id) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Usuário não está logado')
      }

      const { error: supabaseError } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (supabaseError) throw supabaseError

      // Atualizar lista local
      setFlashcards(prev => prev.filter(f => f.id !== id))
      
      return { error: null }
    } catch (err) {
      console.error('Erro ao deletar flashcard:', err)
      setError('Erro ao deletar flashcard')
      return { error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Carregar flashcards ao inicializar
  useEffect(() => {
    loadFlashcards()
  }, [])

  return {
    flashcards,
    loading,
    error,
    loadFlashcards,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard
  }
}

export default useSupabaseFlashcards

