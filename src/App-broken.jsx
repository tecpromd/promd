import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Estilos essenciais
import './styles/promd-theme.css'
import './App.css'

// Componentes principais
import { Dashboard } from './pages/Dashboard'
import { FlashcardsLocal } from './pages/FlashcardsLocal'
import Questions from './pages/Questions'
import SimuladoAvancado from './pages/SimuladoAvancado'
import Reviews from './pages/Reviews'
import { Layout } from './components/Layout'
import { ThemeProvider } from './components/ThemeProvider'
import { LanguageProvider } from './contexts/LanguageContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ThemeProvider>
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

              {/* Banco de Questões */}
              <Route path="/questions" element={
                <Layout>
                  <Questions />
                </Layout>
              } />

              {/* Simulado Avançado */}
              <Route path="/simulado" element={<SimuladoAvancado />} />

              {/* Sistema de Revisões */}
              <Route path="/reviews" element={
                <Layout>
                  <Reviews />
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

