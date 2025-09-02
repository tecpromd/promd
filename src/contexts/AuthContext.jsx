import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Buscar perfil do usuário
  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar perfil:', error)
        return
      }

      if (data) {
        setProfile(data)
      } else {
        // Criar perfil se não existir
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            {
              id: userId,
              name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário',
              role: 'student',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])
          .select()
          .single()

        if (createError) {
          console.error('Erro ao criar perfil:', createError)
        } else {
          setProfile(newProfile)
        }
      }
    } catch (err) {
      console.error('Erro ao buscar/criar perfil:', err)
    }
  }

  // Inicializar pontos do usuário
  const initializeUserPoints = async (userId) => {
    try {
      // Buscar todas as disciplinas
      const { data: disciplines } = await supabase
        .from('disciplines')
        .select('id')

      if (disciplines && disciplines.length > 0) {
        // Criar pontos para cada disciplina
        const pointsData = disciplines.map(discipline => ({
          user_id: userId,
          discipline_id: discipline.id,
          total_points: 0,
          level: 1,
          experience_points: 0,
          questions_answered: 0,
          correct_answers: 0,
          study_streak: 0,
          longest_streak: 0,
          total_study_time: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }))

        await supabase
          .from('user_points')
          .upsert(pointsData, { onConflict: 'user_id,discipline_id' })
      }
    } catch (err) {
      console.error('Erro ao inicializar pontos:', err)
    }
  }

  useEffect(() => {
    // Verificar sessão atual
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          setError(error.message)
          setLoading(false)
          return
        }

        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchProfile(session.user.id)
          await initializeUserPoints(session.user.id)
        }
        
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    getSession()

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setError(null)
        
        if (session?.user) {
          await fetchProfile(session.user.id)
          await initializeUserPoints(session.user.id)
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Função de login
  const signIn = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        return { error }
      }

      return { data }
    } catch (err) {
      setError(err.message)
      return { error: err }
    } finally {
      setLoading(false)
    }
  }

  // Função de registro
  const signUp = async (email, password, name) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      })

      if (error) {
        setError(error.message)
        return { error }
      }

      return { data }
    } catch (err) {
      setError(err.message)
      return { error: err }
    } finally {
      setLoading(false)
    }
  }

  // Função de logout
  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        setError(error.message)
        return { error }
      }

      setUser(null)
      setProfile(null)
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { error: err }
    } finally {
      setLoading(false)
    }
  }

  // Função para atualizar perfil
  const updateProfile = async (updates) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        setError(error.message)
        return { error }
      }

      setProfile(data)
      return { data }
    } catch (err) {
      setError(err.message)
      return { error: err }
    } finally {
      setLoading(false)
    }
  }

  // Função para resetar senha
  const resetPassword = async (email) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        setError(error.message)
        return { error }
      }

      return { data }
    } catch (err) {
      setError(err.message)
      return { error: err }
    } finally {
      setLoading(false)
    }
  }

  // Verificar se é admin
  const isAdmin = () => {
    return profile?.role === 'admin'
  }

  const value = {
    user,
    profile,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
    isAdmin,
    fetchProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

