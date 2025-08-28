import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const useContents = (disciplineId = null) => {
  const [contents, setContents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchContents = async (filterDisciplineId = disciplineId) => {
    try {
      setLoading(true)
      let query = supabase
        .from('contents')
        .select(`
          *,
          discipline:disciplines(*)
        `)
        .order('order_index', { ascending: true })

      if (filterDisciplineId) {
        query = query.eq('discipline_id', filterDisciplineId)
      }

      const { data, error } = await query

      if (error) throw error

      setContents(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Erro ao buscar conteúdos:', err)
    } finally {
      setLoading(false)
    }
  }

  const createContent = async (contentData) => {
    try {
      const { data, error } = await supabase
        .from('contents')
        .insert([contentData])
        .select(`
          *,
          discipline:disciplines(*)
        `)
        .single()

      if (error) throw error

      setContents(prev => [...prev, data])
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  const updateContent = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('contents')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          discipline:disciplines(*)
        `)
        .single()

      if (error) throw error

      setContents(prev => 
        prev.map(content => 
          content.id === id ? data : content
        )
      )
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  const deleteContent = async (id) => {
    try {
      const { error } = await supabase
        .from('contents')
        .update({ is_active: false })
        .eq('id', id)

      if (error) throw error

      setContents(prev => 
        prev.filter(content => content.id !== id)
      )
      return { error: null }
    } catch (err) {
      return { error: err }
    }
  }

  const reorderContents = async (contentIds) => {
    try {
      const updates = contentIds.map((id, index) => ({
        id,
        order_index: index
      }))

      for (const update of updates) {
        await supabase
          .from('contents')
          .update({ order_index: update.order_index })
          .eq('id', update.id)
      }

      await fetchContents()
      return { error: null }
    } catch (err) {
      return { error: err }
    }
  }

  const getContentsByDiscipline = async (disciplineId) => {
    try {
      const { data, error } = await supabase
        .from('contents')
        .select('*')
        .eq('discipline_id', disciplineId)
        .order('order_index', { ascending: true })

      if (error) throw error

      return { data: data || [], error: null }
    } catch (err) {
      console.error('Erro ao buscar conteúdos por disciplina:', err)
      return { data: [], error: err }
    }
  }

  useEffect(() => {
    fetchContents()
  }, [disciplineId])

  return {
    contents,
    loading,
    error,
    fetchContents,
    createContent,
    updateContent,
    deleteContent,
    reorderContents,
    getContentsByDiscipline
  }
}

