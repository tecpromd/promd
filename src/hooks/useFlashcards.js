import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export const useFlashcards = (contentId = null) => {
  const [flashcards, setFlashcards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  const fetchFlashcards = async (filterContentId = contentId) => {
    try {
      setLoading(true)
      let query = supabase
        .from('flashcards')
        .select(`
          *,
          content:contents(*),
          files:flashcard_files(*),
          user_progress:user_progress(*)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (filterContentId) {
        query = query.eq('content_id', filterContentId)
      }

      // Se não for admin, mostrar apenas flashcards públicos ou próprios
      if (user) {
        query = query.or(`is_public.eq.true,user_id.eq.${user.id}`)
      } else {
        query = query.eq('is_public', true)
      }

      const { data, error } = await query

      if (error) throw error

      setFlashcards(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createFlashcard = async (flashcardData) => {
    try {
      if (!user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('flashcards')
        .insert([{
          ...flashcardData,
          user_id: user.id
        }])
        .select(`
          *,
          content:contents(*),
          files:flashcard_files(*),
          user_progress:user_progress(*)
        `)
        .single()

      if (error) throw error

      setFlashcards(prev => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  const updateFlashcard = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          content:contents(*),
          files:flashcard_files(*),
          user_progress:user_progress(*)
        `)
        .single()

      if (error) throw error

      setFlashcards(prev => 
        prev.map(flashcard => 
          flashcard.id === id ? data : flashcard
        )
      )
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  const deleteFlashcard = async (id) => {
    try {
      const { error } = await supabase
        .from('flashcards')
        .update({ is_active: false })
        .eq('id', id)

      if (error) throw error

      setFlashcards(prev => 
        prev.filter(flashcard => flashcard.id !== id)
      )
      return { error: null }
    } catch (err) {
      return { error: err }
    }
  }

  const addFileToFlashcard = async (flashcardId, fileData) => {
    try {
      const { data, error } = await supabase
        .from('flashcard_files')
        .insert([{
          flashcard_id: flashcardId,
          ...fileData
        }])
        .select()
        .single()

      if (error) throw error

      // Atualizar flashcard na lista
      setFlashcards(prev => 
        prev.map(flashcard => 
          flashcard.id === flashcardId 
            ? { ...flashcard, files: [...(flashcard.files || []), data] }
            : flashcard
        )
      )

      return { data, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  const removeFileFromFlashcard = async (fileId) => {
    try {
      const { error } = await supabase
        .from('flashcard_files')
        .delete()
        .eq('id', fileId)

      if (error) throw error

      // Atualizar flashcards na lista
      setFlashcards(prev => 
        prev.map(flashcard => ({
          ...flashcard,
          files: flashcard.files?.filter(file => file.id !== fileId) || []
        }))
      )

      return { error: null }
    } catch (err) {
      return { error: err }
    }
  }

  const toggleFavorite = async (flashcardId) => {
    try {
      if (!user) throw new Error('Usuário não autenticado')

      // Verificar se já está nos favoritos
      const { data: existing } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('flashcard_id', flashcardId)
        .single()

      if (existing) {
        // Remover dos favoritos
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('id', existing.id)

        if (error) throw error
      } else {
        // Adicionar aos favoritos
        const { error } = await supabase
          .from('favorites')
          .insert([{
            user_id: user.id,
            flashcard_id: flashcardId
          }])

        if (error) throw error
      }

      return { error: null }
    } catch (err) {
      return { error: err }
    }
  }

  const updateProgress = async (flashcardId, progressData) => {
    try {
      if (!user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('user_progress')
        .upsert([{
          user_id: user.id,
          flashcard_id: flashcardId,
          ...progressData,
          last_studied: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error

      // Atualizar flashcard na lista
      setFlashcards(prev => 
        prev.map(flashcard => 
          flashcard.id === flashcardId 
            ? { ...flashcard, user_progress: [data] }
            : flashcard
        )
      )

      return { data, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  const incrementViews = async (flashcardId) => {
    try {
      const { error } = await supabase
        .from('flashcards')
        .update({ 
          views_count: supabase.raw('views_count + 1')
        })
        .eq('id', flashcardId)

      if (error) throw error

      // Atualizar na lista local
      setFlashcards(prev => 
        prev.map(flashcard => 
          flashcard.id === flashcardId 
            ? { ...flashcard, views_count: (flashcard.views_count || 0) + 1 }
            : flashcard
        )
      )

      return { error: null }
    } catch (err) {
      return { error: err }
    }
  }

  const getFlashcardsByContent = async (contentId) => {
    try {
      let query = supabase
        .from('flashcards')
        .select(`
          *,
          content:contents(*),
          files:flashcard_files(*),
          user_progress:user_progress(*)
        `)
        .eq('content_id', contentId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (user) {
        query = query.or(`is_public.eq.true,user_id.eq.${user.id}`)
      } else {
        query = query.eq('is_public', true)
      }

      const { data, error } = await query

      if (error) throw error

      return { data: data || [], error: null }
    } catch (err) {
      return { data: [], error: err }
    }
  }

  useEffect(() => {
    fetchFlashcards()
  }, [contentId, user])

  return {
    flashcards,
    loading,
    error,
    fetchFlashcards,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    addFileToFlashcard,
    removeFileFromFlashcard,
    toggleFavorite,
    updateProgress,
    incrementViews,
    getFlashcardsByContent
  }
}

