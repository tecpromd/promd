import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useDisciplines } from '../hooks/useDisciplines'
import { useFlashcards } from '../hooks/useFlashcards'
import { useAnalytics } from '../hooks/useAnalytics'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { FlashcardCard } from '../components/flashcards/FlashcardCard'
import {
  BookOpen,
  GraduationCap,
  TrendingUp,
  Clock,
  Star,
  Plus,
  ArrowRight,
  Target,
  Award,
  Calendar
} from 'lucide-react'

// Material-UI imports
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  LinearProgress,
  Chip,
  Avatar,
  IconButton,
  Divider
} from '@mui/material'

export const Dashboard = () => {
  const { profile } = useAuth()
  const { t } = useLanguage()
  const { disciplines } = useDisciplines()
  const { flashcards } = useFlashcards()
  const { analytics, loading: analyticsLoading } = useAnalytics()

  const recentFlashcards = flashcards.slice(0, 3)

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  const quickStats = [
    {
      title: 'Questões Estudadas',
      value: analytics?.questionsStudied || 0,
      icon: BookOpen,
      color: 'primary',
      change: '+12%'
    },
    {
      title: 'Taxa de Acerto',
      value: `${analytics?.correctRate || 0}%`,
      icon: Target,
      color: 'success',
      change: '+5%'
    },
    {
      title: 'Sequência Atual',
      value: analytics?.currentStreak || 0,
      icon: Award,
      color: 'warning',
      change: 'dias'
    },
    {
      title: 'Tempo de Estudo',
      value: `${analytics?.studyTime || 0}h`,
      icon: Clock,
      color: 'info',
      change: 'hoje'
    }
  ]

  const recentActivities = [
    { type: 'flashcard', title: 'Cardiologia - Arritmias', time: '2 min atrás', score: 85 },
    { type: 'test', title: 'Simulado NBME - Medicina Interna', time: '1 hora atrás', score: 78 },
    { type: 'study', title: 'Neurologia - AVC', time: '3 horas atrás', score: 92 }
  ]

  return (
    <Container maxWidth="xl" className="py-4">
      {/* Header de boas-vindas */}
      <Box className="mb-6">
        <Typography 
          variant="h3" 
          className="font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2"
        >
          {getGreeting()}, {profile?.name?.split(' ')[0] || t('student')}!
        </Typography>
        <Typography variant="body1" className="text-slate-600 dark:text-slate-400">
          Continue seus estudos e acompanhe seu progresso
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Estatísticas Rápidas */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {quickStats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper className="p-4 hover:shadow-md transition-shadow">
                  <Box className="flex items-center justify-between">
                    <Box>
                      <Typography variant="body2" className="text-slate-600 mb-1">
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" className="font-bold">
                        {stat.value}
                      </Typography>
                      <Chip 
                        label={stat.change} 
                        size="small" 
                        color={stat.color}
                        variant="outlined"
                        className="mt-1"
                      />
                    </Box>
                    <Avatar className={`bg-${stat.color}-100 text-${stat.color}-600`}>
                      <stat.icon className="h-5 w-5" />
                    </Avatar>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Progresso Geral */}
        <Grid item xs={12} md={8}>
          <Paper className="p-4">
            <Typography variant="h6" className="mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progresso Geral
            </Typography>
            
            <Box className="space-y-4">
              <Box>
                <Box className="flex justify-between items-center mb-2">
                  <Typography variant="body2">Progresso Total</Typography>
                  <Typography variant="body2" className="font-medium">75%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={75} className="h-2 rounded" />
              </Box>

              <Box>
                <Box className="flex justify-between items-center mb-2">
                  <Typography variant="body2">Meta Semanal</Typography>
                  <Typography variant="body2" className="font-medium">60%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={60} color="secondary" className="h-2 rounded" />
              </Box>

              <Box>
                <Box className="flex justify-between items-center mb-2">
                  <Typography variant="body2">Disciplinas Concluídas</Typography>
                  <Typography variant="body2" className="font-medium">12/19</Typography>
                </Box>
                <LinearProgress variant="determinate" value={63} color="success" className="h-2 rounded" />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Atividades Recentes */}
        <Grid item xs={12} md={4}>
          <Paper className="p-4">
            <Typography variant="h6" className="mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Atividades Recentes
            </Typography>
            
            <Box className="space-y-3">
              {recentActivities.map((activity, index) => (
                <Box key={index}>
                  <Box className="flex items-start gap-3">
                    <Avatar className="w-8 h-8 bg-blue-100 text-blue-600">
                      {activity.type === 'flashcard' && <BookOpen className="h-4 w-4" />}
                      {activity.type === 'test' && <Target className="h-4 w-4" />}
                      {activity.type === 'study' && <GraduationCap className="h-4 w-4" />}
                    </Avatar>
                    <Box className="flex-1">
                      <Typography variant="body2" className="font-medium">
                        {activity.title}
                      </Typography>
                      <Typography variant="caption" className="text-slate-600">
                        {activity.time}
                      </Typography>
                      <Chip 
                        label={`${activity.score}%`} 
                        size="small" 
                        color={activity.score >= 80 ? 'success' : 'warning'}
                        className="ml-2"
                      />
                    </Box>
                  </Box>
                  {index < recentActivities.length - 1 && <Divider className="mt-3" />}
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Ações Rápidas */}
        <Grid item xs={12}>
          <Paper className="p-4">
            <Typography variant="h6" className="mb-3">
              Ações Rápidas
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  component={Link}
                  to="/study-mode"
                  variant="outlined"
                  fullWidth
                  className="h-20 flex-col gap-2"
                  startIcon={<BookOpen className="h-5 w-5" />}
                >
                  <Typography variant="body2" className="font-medium">
                    Estudar Flashcards
                  </Typography>
                  <Typography variant="caption">
                    Continue de onde parou
                  </Typography>
                </Button>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Button
                  component={Link}
                  to="/test-configuration"
                  variant="outlined"
                  fullWidth
                  className="h-20 flex-col gap-2"
                  startIcon={<Target className="h-5 w-5" />}
                >
                  <Typography variant="body2" className="font-medium">
                    Fazer Simulado
                  </Typography>
                  <Typography variant="caption">
                    Teste seus conhecimentos
                  </Typography>
                </Button>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Button
                  component={Link}
                  to="/questions"
                  variant="outlined"
                  fullWidth
                  className="h-20 flex-col gap-2"
                  startIcon={<GraduationCap className="h-5 w-5" />}
                >
                  <Typography variant="body2" className="font-medium">
                    Banco de Questões
                  </Typography>
                  <Typography variant="caption">
                    Explore questões
                  </Typography>
                </Button>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Button
                  component={Link}
                  to="/analytics"
                  variant="outlined"
                  fullWidth
                  className="h-20 flex-col gap-2"
                  startIcon={<TrendingUp className="h-5 w-5" />}
                >
                  <Typography variant="body2" className="font-medium">
                    Ver Analytics
                  </Typography>
                  <Typography variant="caption">
                    Acompanhe progresso
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Flashcards Recentes */}
        {recentFlashcards.length > 0 && (
          <Grid item xs={12}>
            <Paper className="p-4">
              <Box className="flex justify-between items-center mb-4">
                <Typography variant="h6" className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Flashcards Recentes
                </Typography>
                <Button
                  component={Link}
                  to="/study-mode"
                  variant="text"
                  size="small"
                  endIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Ver todos
                </Button>
              </Box>
              
              <Grid container spacing={2}>
                {recentFlashcards.map((flashcard) => (
                  <Grid item xs={12} md={4} key={flashcard.id}>
                    <FlashcardCard flashcard={flashcard} compact />
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  )
}

