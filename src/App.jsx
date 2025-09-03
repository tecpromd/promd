import { useState } from 'react'
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Dashboard } from './pages/Dashboard'
import { FlashcardsLocal } from './pages/FlashcardsLocal'
import { StudyMode } from './pages/StudyMode'
import Study from './pages/Study'
import { Admin } from './pages/Admin'
import { Profile } from './pages/Profile'
import { ExamMode } from './pages/ExamMode'
import Questions from './pages/Questions'
import TestConfiguration from './pages/TestConfiguration'
import TestExecution from './pages/TestExecution'
import Notebook from './pages/Notebook'
import Notes from './pages/Notes'
import { Analytics } from './pages/Analytics'
import { Achievements } from './pages/Achievements'
import { Layout } from './components/Layout'
import { ThemeProvider } from './components/ThemeProvider'
import { LanguageProvider } from './contexts/LanguageContext'

// Admin CMS Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import QuestionManager from './pages/admin/QuestionManager'
import FlashcardManager from './pages/admin/FlashcardManager'
import DisciplineManager from './pages/admin/DisciplineManager'
import TopicManager from './pages/admin/TopicManager'

import './App.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ThemeProvider defaultTheme="light" storageKey="promd-theme">
          <Router>
          <Routes>
            {/* CMS Admin Routes - Sem Layout principal */}
            <Route path="/admin/cms" element={<AdminDashboard />} />
            <Route path="/admin/cms/questions" element={<QuestionManager />} />
            <Route path="/admin/cms/flashcards" element={<FlashcardManager />} />
            <Route path="/admin/disciplines" element={<DisciplineManager />} />
            <Route path="/admin/topics" element={<TopicManager />} />

            {/* Dashboard Principal */}
            <Route path="/" element={
              <Layout>
                <Dashboard />
              </Layout>
            } />
            
            {/* Flashcards */}
            <Route path="/flashcards" element={
              <Layout>
                <FlashcardsLocal />
              </Layout>
            } />
            
            {/* Modo Estudo Focado */}
            <Route path="/study-mode" element={
              <Layout>
                <StudyMode />
              </Layout>
            } />
            
            {/* Estudo Livre */}
            <Route path="/study" element={
              <Layout>
                <Study />
              </Layout>
            } />

            {/* Modo Prova Profissional */}
            <Route path="/exam" element={<ExamMode />} />

            {/* Banco de Questões - Redireciona para Configuração */}
            <Route path="/questions" element={
              <Layout>
                <TestConfiguration />
              </Layout>
            } />

            {/* Configuração de Teste */}
            <Route path="/test-configuration" element={
              <Layout>
                <TestConfiguration />
              </Layout>
            } />

            {/* Execução de Teste */}
            <Route path="/test-execution" element={<TestExecution />} />

            {/* Visualização de Questões (antiga) */}
            <Route path="/questions-view" element={
              <Layout>
                <Questions />
              </Layout>
            } />

            {/* Notebook - Anotações Gerais */}
            <Route path="/notebook" element={
              <Layout>
                <Notebook />
              </Layout>
            } />

            {/* Notes - Anotações Contextuais */}
            <Route path="/notes" element={
              <Layout>
                <Notes />
              </Layout>
            } />

            {/* Analytics e Performance */}
            <Route path="/analytics" element={
              <Layout>
                <Analytics />
              </Layout>
            } />

            {/* Conquistas e Gamificação */}
            <Route path="/achievements" element={
              <Layout>
                <Achievements />
              </Layout>
            } />
            
            {/* Painel Administrativo */}
            <Route path="/admin" element={
              <Layout>
                <Admin />
              </Layout>
            } />

            {/* Perfil do Usuário */}
            <Route path="/profile" element={
              <Layout>
                <Profile />
              </Layout>
            } />

            {/* Redirecionamento padrão */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  )
}

export default App

