import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Trophy, Medal, Star, Target, Zap, Award, Crown, Flame } from 'lucide-react'
import { useSupabase } from '@/hooks/useSupabase'
import { useAuth } from '@/contexts/AuthContext'

export function Achievements() {
  const { supabase } = useSupabase()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [userAchievements, setUserAchievements] = useState([])
  const [allAchievements, setAllAchievements] = useState([])
  const [userPoints, setUserPoints] = useState({})
  const [leaderboard, setLeaderboard] = useState([])
  const [userRank, setUserRank] = useState(0)

  useEffect(() => {
    if (user) {
      loadAchievements()
      loadUserPoints()
      loadLeaderboard()
    }
  }, [user])

  const loadAchievements = async () => {
    try {
      // Carregar todas as conquistas
      const { data: achievements, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .order('points_required')

      if (achievementsError) throw achievementsError

      // Carregar conquistas do usuário
      const { data: userAchievements, error: userError } = await supabase
        .from('user_achievements')
        .select('achievement_id, unlocked_at')
        .eq('user_id', user.id)

      if (userError) throw userError

      setAllAchievements(achievements || [])
      setUserAchievements(userAchievements || [])
    } catch (error) {
      console.error('Erro ao carregar conquistas:', error)
    }
  }

  const loadUserPoints = async () => {
    try {
      const { data, error } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', user.id)

      if (error) throw error

      const pointsMap = {}
      data?.forEach(point => {
        pointsMap[point.discipline_id] = point
      })
      setUserPoints(pointsMap)
    } catch (error) {
      console.error('Erro ao carregar pontos:', error)
    }
  }

  const loadLeaderboard = async () => {
    try {
      // Dados de exemplo - em produção viria do Supabase
      const mockLeaderboard = [
        { id: 1, name: 'Dr. Ana Silva', avatar: null, total_points: 15420, level: 12, streak: 45 },
        { id: 2, name: 'Dr. Carlos Santos', avatar: null, total_points: 14890, level: 11, streak: 32 },
        { id: 3, name: 'Dra. Maria Costa', avatar: null, total_points: 13750, level: 11, streak: 28 },
        { id: 4, name: 'Dr. João Oliveira', avatar: null, total_points: 12980, level: 10, streak: 21 },
        { id: 5, name: 'Dra. Paula Lima', avatar: null, total_points: 11650, level: 9, streak: 19 }
      ]

      setLeaderboard(mockLeaderboard)
      setUserRank(3) // Posição do usuário atual
    } catch (error) {
      console.error('Erro ao carregar ranking:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAchievementIcon = (iconName) => {
    const icons = {
      Trophy: Trophy,
      Medal: Medal,
      Star: Star,
      Target: Target,
      Zap: Zap,
      Award: Award,
      Crown: Crown,
      Flame: Flame
    }
    const IconComponent = icons[iconName] || Trophy
    return <IconComponent className="h-8 w-8" />
  }

  const isAchievementUnlocked = (achievementId) => {
    return userAchievements.some(ua => ua.achievement_id === achievementId)
  }

  const getAchievementProgress = (achievement) => {
    // Lógica para calcular progresso baseado no tipo de conquista
    // Em produção, isso viria do banco de dados
    if (isAchievementUnlocked(achievement.id)) return 100
    
    // Simular progresso baseado no tipo
    switch (achievement.condition_type) {
      case 'questions_answered':
        return Math.min(85, Math.random() * 100)
      case 'accuracy_rate':
        return Math.min(75, Math.random() * 100)
      case 'study_streak':
        return Math.min(60, Math.random() * 100)
      default:
        return Math.random() * 80
    }
  }

  const getTotalPoints = () => {
    return Object.values(userPoints).reduce((total, point) => total + (point.total_points || 0), 0)
  }

  const getCurrentLevel = () => {
    const total = getTotalPoints()
    return Math.floor(total / 1000) + 1
  }

  const getPointsToNextLevel = () => {
    const currentLevel = getCurrentLevel()
    const pointsForNextLevel = currentLevel * 1000
    const currentPoints = getTotalPoints()
    return pointsForNextLevel - currentPoints
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Conquistas</h1>
          <p className="text-muted-foreground">Acompanhe seu progresso e desbloqueie conquistas</p>
        </div>
      </div>

      {/* Status do Usuário */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="text-lg font-bold">
                    {user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Badge className="absolute -bottom-1 -right-1 bg-blue-600">
                  Nv. {getCurrentLevel()}
                </Badge>
              </div>
              <div>
                <h3 className="font-semibold">{user?.email}</h3>
                <p className="text-sm text-muted-foreground">
                  {getTotalPoints().toLocaleString()} pontos totais
                </p>
                <p className="text-xs text-muted-foreground">
                  {getPointsToNextLevel()} pontos para o próximo nível
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ranking Global</p>
                <p className="text-2xl font-bold">#{userRank}</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conquistas</p>
                <p className="text-2xl font-bold">
                  {userAchievements.length}/{allAchievements.length}
                </p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="achievements" className="space-y-6">
        <TabsList>
          <TabsTrigger value="achievements">Conquistas</TabsTrigger>
          <TabsTrigger value="leaderboard">Ranking</TabsTrigger>
          <TabsTrigger value="progress">Progresso</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allAchievements.map((achievement) => {
              const isUnlocked = isAchievementUnlocked(achievement.id)
              const progress = getAchievementProgress(achievement)
              
              return (
                <Card key={achievement.id} className={`relative overflow-hidden ${
                  isUnlocked ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' : ''
                }`}>
                  {isUnlocked && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-yellow-600">
                        <Trophy className="h-3 w-3 mr-1" />
                        Desbloqueada
                      </Badge>
                    </div>
                  )}
                  
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-full ${
                        isUnlocked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {getAchievementIcon(achievement.icon)}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{achievement.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {achievement.description}
                        </p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progresso</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <Badge 
                            variant="secondary"
                            style={{ backgroundColor: achievement.color + '20', color: achievement.color }}
                          >
                            {achievement.category}
                          </Badge>
                          <span className="text-sm font-medium text-blue-600">
                            +{achievement.points_reward} pts
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ranking Global</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard.map((user, index) => (
                  <div key={user.id} className={`flex items-center justify-between p-4 rounded-lg border ${
                    index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' : ''
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-orange-600 text-white' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      
                      <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Nível {user.level}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Flame className="h-3 w-3 text-orange-500" />
                            {user.streak} dias
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-lg">{user.total_points.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">pontos</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Progresso por Disciplina</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(userPoints).map(([disciplineId, points]) => (
                    <div key={disciplineId} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Disciplina {disciplineId}</span>
                        <span className="text-sm">{points.total_points || 0} pts</span>
                      </div>
                      <Progress value={(points.total_points || 0) / 10} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estatísticas Gerais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Nível Atual</span>
                    <span className="font-bold">{getCurrentLevel()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pontos Totais</span>
                    <span className="font-bold">{getTotalPoints().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Conquistas Desbloqueadas</span>
                    <span className="font-bold">{userAchievements.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Posição no Ranking</span>
                    <span className="font-bold">#{userRank}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

