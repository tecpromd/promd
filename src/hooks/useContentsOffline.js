import { useState, useEffect } from 'react'
import { getContentsByDiscipline } from '../data/mockData'

export const useContentsOffline = () => {
  const [contents, setContents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchContentsByDiscipline = async (disciplineId) => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await getContentsByDiscipline(disciplineId)
      setContents(data)
      
      return { data, error: null }
    } catch (err) {
      setError(err.message)
      console.error('Erro ao buscar conteúdos:', err)
      return { data: [], error: err }
    } finally {
      setLoading(false)
    }
  }

  return {
    contents,
    loading,
    error,
    getContentsByDiscipline: fetchContentsByDiscipline
  }
}

