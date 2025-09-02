import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { 
  Users, 
  BookOpen, 
  FileText, 
  BarChart3, 
  Settings, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
  Upload,
  Award,
  Target,
  Clock,
  TrendingUp
} from 'lucide-react'

export function Admin() {
  const { profile } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuestions: 0,
    totalSessions: 0,
    avgAccuracy: 0
  })

  // Dados para as diferentes seções
  const [users, setUsers] = useState([])
  const [questions, setQuestions] = useState([])
  const [disciplines, setDisciplines] = useState([])
  const [achievements, setAchievements] = useState([])

  useEffect(() => {
    if (profile?.role === 'admin') {
      loadAdminData()
    }
  }, [profile])

  const loadAdminData = async () => {
    setLoading(true)
    try {
      // Carregar estatísticas gerais
      await loadStats()
      
      // Carregar dados baseado na aba ativa
      switch (activeTab) {
        case 'users':
          await loadUsers()
          break
        case 'questions':
          await loadQuestions()
          break
        case 'disciplines':
          await loadDisciplines()
          break
        case 'achievements':
          await loadAchievements()
          break
      }
    } catch (error) {
      console.error('Erro ao carregar dados admin:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      // Total de usuários
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      // Total de questões
      const { count: questionsCount } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })

      // Total de sessões
      const { count: sessionsCount } = await supabase
        .from('exam_sessions')
        .select('*', { count: 'exact', head: true })

      // Precisão média
      const { data: avgData } = await supabase
        .from('exam_sessions')
        .select('score_percentage')
        .not('score_percentage', 'is', null)

      const avgAccuracy = avgData?.length > 0 
        ? avgData.reduce((sum, session) => sum + (session.score_percentage || 0), 0) / avgData.length
        : 0

      setStats({
        totalUsers: usersCount || 0,
        totalQuestions: questionsCount || 0,
        totalSessions: sessionsCount || 0,
        avgAccuracy: Math.round(avgAccuracy)
      })
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    }
  }

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_points(total_points, questions_answered, correct_answers)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    }
  }

  const loadQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          contents(title, disciplines(name)),
          question_options(*)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setQuestions(data || [])
    } catch (error) {
      console.error('Erro ao carregar questões:', error)
    }
  }

  const loadDisciplines = async () => {
    try {
      const { data, error } = await supabase
        .from('disciplines')
        .select(`
          *,
          contents(count),
          questions(count)
        `)
        .order('order_index', { ascending: true })

      if (error) throw error
      setDisciplines(data || [])
    } catch (error) {
      console.error('Erro ao carregar disciplinas:', error)
    }
  }

  const loadAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select(`
          *,
          user_achievements(count)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setAchievements(data || [])
    } catch (error) {
      console.error('Erro ao carregar conquistas:', error)
    }
  }

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'questions', label: 'Questões', icon: FileText },
    { id: 'disciplines', label: 'Disciplinas', icon: BookOpen },
    { id: 'achievements', label: 'Conquistas', icon: Award },
    { id: 'settings', label: 'Configurações', icon: Settings }
  ]

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    loadAdminData()
  }

  if (profile?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Acesso Negado
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Você não tem permissão para acessar esta área.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Painel Administrativo
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie usuários, conteúdo e configurações da plataforma
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Exportar Dados</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        {activeTab === 'overview' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Estatísticas Gerais
            </h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total de Usuários</p>
                    <p className="text-3xl font-bold">{stats.totalUsers}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Total de Questões</p>
                    <p className="text-3xl font-bold">{stats.totalQuestions}</p>
                  </div>
                  <FileText className="w-8 h-8 text-green-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Sessões de Prova</p>
                    <p className="text-3xl font-bold">{stats.totalSessions}</p>
                  </div>
                  <Target className="w-8 h-8 text-purple-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Precisão Média</p>
                    <p className="text-3xl font-bold">{stats.avgAccuracy}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-200" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button 
                onClick={() => handleTabChange('users')}
                className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
              >
                <Users className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Gerenciar Usuários
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Visualizar, editar e gerenciar contas de usuários
                </p>
              </button>

              <button 
                onClick={() => handleTabChange('questions')}
                className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
              >
                <FileText className="w-8 h-8 text-green-600 mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Banco de Questões
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Adicionar, editar e organizar questões
                </p>
              </button>

              <button 
                onClick={() => handleTabChange('achievements')}
                className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
              >
                <Award className="w-8 h-8 text-purple-600 mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Sistema de Conquistas
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Configurar gamificação e recompensas
                </p>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Gerenciar Usuários
              </h2>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar usuários..."
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Novo Usuário</span>
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Nome</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Questões</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Pontos</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Cadastro</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                              {user.name?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{user.name || 'Sem nome'}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.bio || 'Sem bio'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {user.role === 'admin' ? 'Administrador' : 'Estudante'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        {user.user_points?.[0]?.questions_answered || 0}
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        {user.user_points?.[0]?.total_points || 0}
                      </td>
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                        {new Date(user.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Outras abas serão implementadas nas próximas fases */}
        {activeTab !== 'overview' && activeTab !== 'users' && (
          <div className="p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {tabs.find(tab => tab.id === activeTab)?.label}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Esta seção será implementada em breve.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

