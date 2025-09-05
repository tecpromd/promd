import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useFlashcards } from '../hooks/useFlashcards'
import { useDisciplines } from '../hooks/useDisciplines'

// Material-UI imports para ícones modernos
import {
  TrendingUp as TrendingUpIcon,
  School as StudyIcon,
  Quiz as QuizIcon,
  Analytics as AnalyticsIcon,
  EmojiEvents as TrophyIcon,
  LocalFireDepartment as FireIcon,
  Speed as SpeedIcon,
  Timeline as TimelineIcon,
  AutoGraph as GraphIcon,
  Insights as InsightsIcon,
  Star as StarIcon,
  Bolt as BoltIcon,
  Celebration as CelebrationIcon,
  Psychology as BrainIcon,
  Science as ScienceIcon,
  Add as AddIcon,
  PlayArrow as PlayIcon,
  Visibility as ViewIcon,
  History as HistoryIcon
} from '@mui/icons-material'

// Material-UI components
import {
  Box,
  Container,
  Grid2 as Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  Fade,
  Zoom,
  Grow,
  IconButton,
  Tooltip,
  Paper
} from '@mui/material'

export const Dashboard = () => {
  const { profile } = useAuth()
  const { flashcards, loading: flashcardsLoading } = useFlashcards()
  const { disciplines, loading: disciplinesLoading } = useDisciplines()
  const [animationDelay, setAnimationDelay] = useState(0)

  // Dados mockados para demonstração visual
  const stats = {
    totalFlashcards: flashcards?.length || 0,
    studiedToday: 0,
    weeklyProgress: 0,
    currentStreak: 0
  }

  const recentActivities = [
    {
      id: 1,
      type: 'flashcard',
      title: 'Cardiologia - Arritmias',
      time: '2 min atrás',
      score: 85,
      icon: ScienceIcon,
      color: 'from-red-400 to-red-600'
    },
    {
      id: 2,
      type: 'exam',
      title: 'Simulado NBME - Medicina Interna',
      time: '1 hora atrás',
      score: 78,
      icon: QuizIcon,
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: 3,
      type: 'study',
      title: 'Neurologia - AVC',
      time: '3 horas atrás',
      score: 92,
      icon: BrainIcon,
      color: 'from-purple-400 to-purple-600'
    }
  ]

  const quickActions = [
    {
      title: 'Novo Flashcard',
      description: 'Criar novo flashcard',
      icon: AddIcon,
      color: 'from-green-400 to-green-600',
      href: '/flashcards/new',
      badge: '+'
    },
    {
      title: 'Estudar Agora',
      description: 'Continue de onde parou',
      icon: PlayIcon,
      color: 'from-blue-400 to-blue-600',
      href: '/study-mode',
      badge: '16'
    },
    {
      title: 'Banco de Questões',
      description: 'Explore questões',
      icon: ViewIcon,
      color: 'from-purple-400 to-purple-600',
      href: '/questions',
      badge: '17'
    },
    {
      title: 'Ver Analytics',
      description: 'Acompanhe progresso',
      icon: AnalyticsIcon,
      color: 'from-orange-400 to-orange-600',
      href: '/analytics',
      badge: '18'
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationDelay(prev => prev + 100)
    }, 100)
    return () => clearInterval(timer)
  }, [])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  return (
    <Container maxWidth="xl" className="py-6">
      {/* Header com Saudação */}
      <Fade in={true} timeout={800}>
        <Box className="mb-8">
          <Typography 
            variant="h3" 
            className="font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-2"
          >
            {getGreeting()}, {profile?.full_name?.split(' ')[0] || 'Estudante'}!
          </Typography>
          <Typography variant="h6" className="text-slate-600 dark:text-slate-400">
            Continue sua jornada de preparação para validação médica
          </Typography>
        </Box>
      </Fade>

      {/* Ações Rápidas */}
      <Zoom in={true} timeout={1000}>
        <Box className="mb-8">
          <Grid container spacing={3}>
            {quickActions.map((action, index) => (
              <Grid xs={12} sm={6} md={3} key={action.title}>
                <Grow in={true} timeout={800 + index * 200}>
                  <Card 
                    className="group relative overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    component={Link}
                    to={action.href}
                    sx={{ textDecoration: 'none' }}
                  >
                    <Box className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                    <CardContent className="relative p-6">
                      <Box className="flex items-center justify-between mb-4">
                        <Box className={`p-3 rounded-xl bg-gradient-to-br ${action.color} shadow-lg`}>
                          <action.icon className="h-6 w-6 text-white" />
                        </Box>
                        <Chip 
                          label={action.badge} 
                          size="small" 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold"
                        />
                      </Box>
                      <Typography variant="h6" className="font-bold mb-1">
                        {action.title}
                      </Typography>
                      <Typography variant="body2" className="text-slate-600 dark:text-slate-400">
                        {action.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Zoom>

      {/* Estatísticas Principais */}
      <Fade in={true} timeout={1200}>
        <Box className="mb-8">
          <Grid container spacing={4}>
            {/* Total de Flashcards */}
            <Grid xs={12} sm={6} md={3}>
              <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-0 shadow-lg">
                <Box className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full -mr-10 -mt-10" />
                <CardContent className="relative p-6">
                  <Box className="flex items-center justify-between mb-4">
                    <Box className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                      <StudyIcon className="h-6 w-6 text-white" />
                    </Box>
                    <Chip label="+12%" size="small" className="bg-green-100 text-green-700 font-bold" />
                  </Box>
                  <Typography variant="h4" className="font-bold text-blue-700 dark:text-blue-300 mb-1">
                    {stats.totalFlashcards}
                  </Typography>
                  <Typography variant="body2" className="text-slate-600 dark:text-slate-400 mb-2">
                    Total de Flashcards
                  </Typography>
                  <Typography variant="caption" className="text-green-600 font-medium">
                    +77 novos esta semana
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Estudados Hoje */}
            <Grid xs={12} sm={6} md={3}>
              <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-0 shadow-lg">
                <Box className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-full -mr-10 -mt-10" />
                <CardContent className="relative p-6">
                  <Box className="flex items-center justify-between mb-4">
                    <Box className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                      <SpeedIcon className="h-6 w-6 text-white" />
                    </Box>
                    <Chip label="+5%" size="small" className="bg-green-100 text-green-700 font-bold" />
                  </Box>
                  <Typography variant="h4" className="font-bold text-green-700 dark:text-green-300 mb-1">
                    {stats.studiedToday}
                  </Typography>
                  <Typography variant="body2" className="text-slate-600 dark:text-slate-400 mb-2">
                    Estudados Hoje
                  </Typography>
                  <Typography variant="caption" className="text-blue-600 font-medium">
                    Meta: 20 flashcards
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Progresso Semanal */}
            <Grid xs={12} sm={6} md={3}>
              <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-0 shadow-lg">
                <Box className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-full -mr-10 -mt-10" />
                <CardContent className="relative p-6">
                  <Box className="flex items-center justify-between mb-4">
                    <Box className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                      <TimelineIcon className="h-6 w-6 text-white" />
                    </Box>
                    <Chip label="↗" size="small" className="bg-purple-100 text-purple-700 font-bold" />
                  </Box>
                  <Typography variant="h4" className="font-bold text-purple-700 dark:text-purple-300 mb-1">
                    {stats.weeklyProgress}%
                  </Typography>
                  <Typography variant="body2" className="text-slate-600 dark:text-slate-400 mb-2">
                    Progresso Semanal
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={stats.weeklyProgress} 
                    className="h-2 rounded-full bg-purple-200"
                    sx={{
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(90deg, #8b5cf6, #a855f7)'
                      }
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Sequência */}
            <Grid xs={12} sm={6} md={3}>
              <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-0 shadow-lg">
                <Box className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-orange-600/20 rounded-full -mr-10 -mt-10" />
                <CardContent className="relative p-6">
                  <Box className="flex items-center justify-between mb-4">
                    <Box className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
                      <FireIcon className="h-6 w-6 text-white" />
                    </Box>
                    <Chip label="🔥" size="small" className="bg-orange-100 text-orange-700 font-bold" />
                  </Box>
                  <Typography variant="h4" className="font-bold text-orange-700 dark:text-orange-300 mb-1">
                    {stats.currentStreak} dias
                  </Typography>
                  <Typography variant="body2" className="text-slate-600 dark:text-slate-400 mb-2">
                    Sequência
                  </Typography>
                  <Typography variant="caption" className="text-orange-600 font-medium">
                    Continue assim! 🔥
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Fade>

      <Grid container spacing={6}>
        {/* Progresso por Disciplina */}
        <Grid xs={12} lg={8}>
          <Fade in={true} timeout={1400}>
            <Card className="h-full shadow-lg border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
              <CardContent className="p-6">
                <Box className="flex items-center justify-between mb-6">
                  <Box className="flex items-center space-x-3">
                    <Box className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                      <GraphIcon className="h-5 w-5 text-white" />
                    </Box>
                    <Typography variant="h6" className="font-bold">
                      Progresso por Disciplina
                    </Typography>
                  </Box>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    endIcon={<ViewIcon />}
                    className="rounded-xl"
                    component={Link}
                    to="/disciplines"
                  >
                    Ver Todas as Disciplinas
                  </Button>
                </Box>

                <Typography variant="body2" className="text-slate-600 dark:text-slate-400 mb-6">
                  Seu desempenho em cada área médica
                </Typography>

                <Box className="text-center py-12">
                  <Box className="relative mb-6">
                    <Box className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mb-4">
                      <InsightsIcon className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                    </Box>
                    <Box className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <StarIcon className="h-3 w-3 text-white" />
                    </Box>
                  </Box>
                  <Typography variant="h6" className="font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Comece Sua Jornada
                  </Typography>
                  <Typography variant="body2" className="text-slate-500 dark:text-slate-400 mb-6">
                    Inicie seus estudos para acompanhar seu progresso em tempo real
                  </Typography>
                  <Button 
                    variant="contained" 
                    size="large"
                    startIcon={<PlayIcon />}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl px-8 py-3 shadow-lg transform transition-all duration-300 hover:scale-105"
                    component={Link}
                    to="/study-mode"
                  >
                    Começar a Estudar
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        {/* Atividade Recente */}
        <Grid xs={12} lg={4}>
          <Fade in={true} timeout={1600}>
            <Card className="h-full shadow-lg border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
              <CardContent className="p-6">
                <Box className="flex items-center justify-between mb-6">
                  <Box className="flex items-center space-x-3">
                    <Box className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-teal-600">
                      <HistoryIcon className="h-5 w-5 text-white" />
                    </Box>
                    <Typography variant="h6" className="font-bold">
                      Atividade Recente
                    </Typography>
                  </Box>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    endIcon={<ViewIcon />}
                    className="rounded-xl"
                    component={Link}
                    to="/history"
                  >
                    Ver Histórico Completo
                  </Button>
                </Box>

                <Typography variant="body2" className="text-slate-600 dark:text-slate-400 mb-6">
                  Seus últimos estudos
                </Typography>

                <Box className="text-center py-8">
                  <Box className="relative mb-6">
                    <Box className="w-16 h-16 mx-auto bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 rounded-2xl flex items-center justify-center mb-4">
                      <TimelineIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </Box>
                    <Box className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                      <BoltIcon className="h-2.5 w-2.5 text-white" />
                    </Box>
                  </Box>
                  <Typography variant="h6" className="font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Histórico Vazio
                  </Typography>
                  <Typography variant="body2" className="text-slate-500 dark:text-slate-400 mb-4">
                    Suas atividades de estudo aparecerão aqui
                  </Typography>
                  <Button 
                    variant="contained" 
                    size="small"
                    startIcon={<PlayIcon />}
                    className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 rounded-xl px-6 py-2 shadow-md transform transition-all duration-300 hover:scale-105"
                    component={Link}
                    to="/study-mode"
                  >
                    Começar Agora
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      </Grid>

      {/* Flashcards Recentes */}
      <Fade in={true} timeout={1800}>
        <Box className="mt-8">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
            <CardContent className="p-6">
              <Box className="flex items-center justify-between mb-6">
                <Box className="flex items-center space-x-3">
                  <Box className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600">
                    <StarIcon className="h-5 w-5 text-white" />
                  </Box>
                  <Typography variant="h6" className="font-bold">
                    Flashcards Recentes
                  </Typography>
                </Box>
                <Button 
                  variant="outlined" 
                  size="small" 
                  endIcon={<ViewIcon />}
                  className="rounded-xl"
                  component={Link}
                  to="/flashcards"
                >
                  Ver Todos
                </Button>
              </Box>

              <Typography variant="body2" className="text-slate-600 dark:text-slate-400 mb-6">
                Continue estudando onde parou
              </Typography>

              {flashcards && flashcards.length > 0 ? (
                <Grid container spacing={3}>
                  {flashcards.slice(0, 3).map((flashcard, index) => (
                    <Grid xs={12} md={4} key={flashcard.id}>
                      <Grow in={true} timeout={1000 + index * 200}>
                        <Card className="group relative overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-lg">
                          <Box className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300" />
                          <CardContent className="relative p-6">
                            <Box className="flex items-center justify-between mb-4">
                              <Chip 
                                label="Intermediário" 
                                size="small" 
                                className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 font-medium border-0"
                              />
                              <Box className="flex items-center space-x-1">
                                <BoltIcon className="h-4 w-4 text-yellow-500" />
                                <StarIcon className="h-4 w-4 text-yellow-400" />
                              </Box>
                            </Box>
                            <Typography variant="h6" className="font-bold text-slate-800 dark:text-slate-200 mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {flashcard.question || 'Lymphadenopathy - Chronic Stimulation'}
                            </Typography>
                            <Typography variant="body2" className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                              {flashcard.category || 'Chronic stimulation histology'}
                            </Typography>
                            <Box className="flex items-center justify-between">
                              <Chip 
                                label={flashcard.category || 'Medicina Geral'} 
                                size="small" 
                                className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 font-medium border-0"
                              />
                              <Button 
                                size="small" 
                                variant="contained"
                                startIcon={<StudyIcon />}
                                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg shadow-md transform transition-all duration-200 hover:scale-105"
                              >
                                Estudar
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grow>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box className="text-center py-12">
                  <Box className="relative mb-8">
                    <Box className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-3xl flex items-center justify-center mb-4 shadow-lg">
                      <CelebrationIcon className="h-12 w-12 text-purple-600 dark:text-purple-400" />
                    </Box>
                    <Box className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                      <StarIcon className="h-4 w-4 text-white" />
                    </Box>
                    <Box className="absolute -bottom-1 -left-1 w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                      <BoltIcon className="h-3 w-3 text-white" />
                    </Box>
                  </Box>
                  <Typography variant="h5" className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                    Comece sua jornada de estudos
                  </Typography>
                  <Typography variant="body1" className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                    Crie seu primeiro flashcard e comece a se preparar para a validação médica com nossa plataforma moderna
                  </Typography>
                  <Button 
                    variant="contained" 
                    size="large"
                    startIcon={<AddIcon />}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-2xl px-10 py-4 text-lg font-semibold shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    component={Link}
                    to="/flashcards/new"
                  >
                    Criar Primeiro Flashcard
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Fade>
    </Container>
  )
}

export default Dashboard

