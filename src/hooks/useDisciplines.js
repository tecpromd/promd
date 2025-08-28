import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const useDisciplines = () => {
  const [disciplines, setDisciplines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDisciplines = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('disciplines')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error

      setDisciplines(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Erro ao buscar disciplinas:', err)
    } finally {
      setLoading(false)
    }
  }

  const createDiscipline = async (disciplineData) => {
    try {
      const { data, error } = await supabase
        .from('disciplines')
        .insert([disciplineData])
        .select()
        .single()

      if (error) throw error

      setDisciplines(prev => [...prev, data])
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  const updateDiscipline = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('disciplines')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setDisciplines(prev => 
        prev.map(discipline => 
          discipline.id === id ? data : discipline
        )
      )
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  const deleteDiscipline = async (id) => {
    try {
      const { error } = await supabase
        .from('disciplines')
        .update({ is_active: false })
        .eq('id', id)

      if (error) throw error

      setDisciplines(prev => 
        prev.filter(discipline => discipline.id !== id)
      )
      return { error: null }
    } catch (err) {
      return { error: err }
    }
  }

  const reorderDisciplines = async (disciplineIds) => {
    try {
      const updates = disciplineIds.map((id, index) => ({
        id,
        order_index: index
      }))

      for (const update of updates) {
        await supabase
          .from('disciplines')
          .update({ order_index: update.order_index })
          .eq('id', update.id)
      }

      await fetchDisciplines()
      return { error: null }
    } catch (err) {
      return { error: err }
    }
  }

  useEffect(() => {
    fetchDisciplines()
  }, [])

  return {
    disciplines,
    loading,
    error,
    fetchDisciplines,
    createDiscipline,
    updateDiscipline,
    deleteDiscipline,
    reorderDisciplines
  }
}

