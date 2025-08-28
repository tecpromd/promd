import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Dashboard } from './pages/Dashboard'
import { FlashcardsLocal } from './pages/FlashcardsLocal'
import Study from './pages/Study'
import { Admin } from './pages/Admin'
import { Profile } from './pages/Profile'
import { ExamMode } from './pages/ExamMode'
import Questions from './pages/Questions'
import { Analytics } from './pages/Analytics'
import { Achievements } from './pages/Achievements'
import { Layout } from './components/Layout'
import { ThemeProvider } from './components/ThemeProvider'
import { LanguageProvider } from './contexts/LanguageContext'
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
            
            {/* Estudo Livre */}
            <Route path="/study" element={
              <Layout>
                <Study />
              </Layout>
            } />

            {/* Modo Prova Profissional */}
            <Route path="/exam" element={<ExamMode />} />

            {/* Banco de Questões */}
            <Route path="/questions" element={
              <Layout>
                <Questions />
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

