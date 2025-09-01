import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
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

export const Dashboard = () => {
  const { profile } = useAuth()
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

  return (
    <div className="space-y-8">
      {/* Header de boas-vindas */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            {getGreeting()}, {profile?.name?.split(' ')[0] || 'Estudante'}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Continue sua jornada de preparação para validação médica
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button asChild>
            <Link to="/flashcards">
              <Plus className="mr-2 h-4 w-4" />
              Novo Flashcard
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/study">
              <GraduationCap className="mr-2 h-4 w-4" />
              Estudar Agora
            </Link>
          </Button>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Flashcards</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {analytics.overview.totalFlashcards}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              +{flashcards.filter(f => {
                const created = new Date(f.created_at);
                const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                return created >= weekAgo;
              }).length} novos esta semana
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estudados Hoje</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
              {analytics.overview.studiedToday}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              Meta: 20 flashcards
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso Semanal</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
              {Math.round(analytics.overview.weeklyProgress)}%
            </div>
            <Progress value={analytics.overview.weeklyProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sequência</CardTitle>
            <Award className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {analytics.overview.streak} dias
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              Continue assim! 🔥
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Progresso por disciplina */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Progresso por Disciplina
              </CardTitle>
              <CardDescription>
                Seu desempenho em cada área médica
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analyticsLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Carregando progresso...</p>
                </div>
              ) : analytics.disciplines.length > 0 ? (
                analytics.disciplines.slice(0, 6).map((discipline, index) => (
                  <div key={discipline.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ 
                            backgroundColor: [
                              '#EF4444', '#F97316', '#EAB308', '#22C55E', 
                              '#3B82F6', '#8B5CF6', '#EC4899', '#06B6D4'
                            ][index % 8] 
                          }}
                        />
                        <span className="font-medium">{discipline.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{discipline.studied} estudados</span>
                        <span>•</span>
                        <span>{Math.round(discipline.accuracy)}%</span>
                      </div>
                    </div>
                    <Progress value={discipline.accuracy} className="h-2" />
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhum progresso ainda</p>
                  <p className="text-xs">Comece estudando para ver seu progresso</p>
                </div>
              )}
              
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link to="/study">
                  Ver Todas as Disciplinas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Atividade recente */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Atividade Recente
              </CardTitle>
              <CardDescription>
                Seus últimos estudos
              </CardDescription>
            </CardHeader>            <CardContent className="space-y-4">
              <div className="space-y-3">
                {analyticsLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p className="text-xs text-gray-600">Carregando atividades...</p>
                  </div>
                ) : analytics.recentActivity.length > 0 ? (
                  analytics.recentActivity.slice(0, 4).map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <div>
                          <p className="text-sm font-medium">
                            Estudou {activity.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.discipline} • {new Date(activity.date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      {activity.difficulty && (
                        <Badge 
                          variant={
                            activity.difficulty === 'easy' ? 'default' : 
                            activity.difficulty === 'medium' ? 'secondary' : 'destructive'
                          }
                          className="text-xs"
                        >
                          {activity.difficulty === 'easy' ? 'Fácil' : 
                           activity.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                        </Badge>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhuma atividade ainda</p>
                    <p className="text-xs">Comece estudando para ver seu histórico</p>
                  </div>
                )}
              </div>
              
              <Button variant="outline" className="w-full" asChild>
                <Link to="/analytics">
                  Ver Histórico Completo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Flashcards Recentes */}
      {recentFlashcards.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Flashcards Recentes</h2>
              <p className="text-muted-foreground">
                Continue estudando onde parou
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/flashcards">
                Ver Todos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentFlashcards.map((flashcard) => (
              <FlashcardCard
                key={flashcard.id}
                flashcard={flashcard}
                onStudy={() => {/* Implementar navegação para estudo */}}
                showActions={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Call to action se não há flashcards */}
      {flashcards.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Comece sua jornada de estudos
            </h3>
            <p className="text-muted-foreground mb-6">
              Crie seu primeiro flashcard e comece a se preparar para a validação médica
            </p>
            <Button asChild>
              <Link to="/flashcards">
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Flashcard
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

