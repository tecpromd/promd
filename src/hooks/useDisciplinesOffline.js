import { useState, useEffect } from 'react'
import { getDisciplines } from '../data/mockData'

export const useDisciplinesOffline = () => {
  const [disciplines, setDisciplines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDisciplines = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await getDisciplines()
      setDisciplines(data)
    } catch (err) {
      setError(err.message)
      console.error('Erro ao buscar disciplinas:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDisciplines()
  }, [])

  return {
    disciplines,
    loading,
    error,
    fetchDisciplines
  }
}

