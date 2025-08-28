import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'

export function SupabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState('testing')
  const [disciplines, setDisciplines] = useState([])
  const [error, setError] = useState(null)

  const testConnection = async () => {
    try {
      setConnectionStatus('testing')
      setError(null)
      
      // Testar conexão básica
      const { data, error } = await supabase
        .from('disciplines')
        .select('*')
        .limit(5)

      if (error) {
        throw error
      }

      setDisciplines(data || [])
      setConnectionStatus('success')
    } catch (err) {
      console.error('Erro na conexão:', err)
      setError(err.message)
      setConnectionStatus('error')
    }
  }

  const testAuth = async () => {
    try {
      setError(null)
      
      // Testar criação de usuário
      const { data, error } = await supabase.auth.signUp({
        email: 'test@promd.com',
        password: 'test123456',
        options: {
          data: {
            full_name: 'Usuário Teste'
          }
        }
      })

      if (error) {
        throw error
      }

      console.log('Teste de auth:', data)
      alert('Teste de autenticação executado - verifique o console')
    } catch (err) {
      console.error('Erro na autenticação:', err)
      setError(err.message)
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Teste de Conexão Supabase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Status da Conexão:</h3>
            <div className={`p-2 rounded ${
              connectionStatus === 'success' ? 'bg-green-100 text-green-800' :
              connectionStatus === 'error' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {connectionStatus === 'success' && '✅ Conectado com sucesso'}
              {connectionStatus === 'error' && '❌ Erro na conexão'}
              {connectionStatus === 'testing' && '⏳ Testando conexão...'}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-100 border border-red-300 rounded text-red-800">
              <strong>Erro:</strong> {error}
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-2">Disciplinas encontradas:</h3>
            <div className="text-sm">
              {disciplines.length > 0 ? (
                <ul className="list-disc list-inside">
                  {disciplines.map(discipline => (
                    <li key={discipline.id}>{discipline.name}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Nenhuma disciplina encontrada</p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={testConnection}>
              Testar Conexão
            </Button>
            <Button onClick={testAuth} variant="outline">
              Testar Autenticação
            </Button>
          </div>

          <div className="text-xs text-gray-500">
            <p><strong>URL:</strong> {import.meta.env.VITE_SUPABASE_URL}</p>
            <p><strong>Key:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20)}...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

