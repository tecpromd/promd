import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const useSupabaseQuestions = () => {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Carregar questões do Supabase
  const loadQuestions = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setQuestions([])
        return []
      }

      const { data, error: supabaseError } = await supabase
        .from('questions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (supabaseError) throw supabaseError

      setQuestions(data || [])
      return data || []
    } catch (err) {
      console.error('Erro ao carregar questões:', err)
      setError('Erro ao carregar questões')
      setQuestions([])
      return []
    } finally {
      setLoading(false)
    }
  }

  // Criar questão
  const createQuestion = async (questionData) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Usuário não está logado')
      }

      const { data, error: supabaseError } = await supabase
        .from('questions')
        .insert([{
          ...questionData,
          user_id: user.id,
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (supabaseError) throw supabaseError

      // Atualizar lista local
      setQuestions(prev => [data, ...prev])
      
      return { data, error: null }
    } catch (err) {
      console.error('Erro ao criar questão:', err)
      setError('Erro ao criar questão')
      return { data: null, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Atualizar questão
  const updateQuestion = async (id, questionData) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Usuário não está logado')
      }

      const { data, error: supabaseError } = await supabase
        .from('questions')
        .update(questionData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (supabaseError) throw supabaseError

      // Atualizar lista local
      setQuestions(prev => prev.map(q => q.id === id ? data : q))
      
      return { data, error: null }
    } catch (err) {
      console.error('Erro ao atualizar questão:', err)
      setError('Erro ao atualizar questão')
      return { data: null, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Deletar questão
  const deleteQuestion = async (id) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Usuário não está logado')
      }

      const { error: supabaseError } = await supabase
        .from('questions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (supabaseError) throw supabaseError

      // Atualizar lista local
      setQuestions(prev => prev.filter(q => q.id !== id))
      
      return { error: null }
    } catch (err) {
      console.error('Erro ao deletar questão:', err)
      setError('Erro ao deletar questão')
      return { error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Importar questões em lote
  const importQuestions = async (questionsArray) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Usuário não está logado')
      }

      // Adicionar user_id e timestamp a todas as questões
      const questionsWithUser = questionsArray.map(q => ({
        ...q,
        user_id: user.id,
        created_at: new Date().toISOString()
      }))

      const { data, error: supabaseError } = await supabase
        .from('questions')
        .insert(questionsWithUser)
        .select()

      if (supabaseError) throw supabaseError

      // Atualizar lista local
      setQuestions(prev => [...data, ...prev])
      
      return { data, error: null }
    } catch (err) {
      console.error('Erro ao importar questões:', err)
      setError('Erro ao importar questões')
      return { data: null, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Carregar questões ao inicializar
  useEffect(() => {
    loadQuestions()
  }, [])

  return {
    questions,
    loading,
    error,
    loadQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    importQuestions
  }
}

export default useSupabaseQuestions

