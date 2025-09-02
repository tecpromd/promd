import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Alert, AlertDescription } from '../ui/alert'
import { Mail, ArrowLeft, Send } from 'lucide-react'

export const ForgotPasswordForm = ({ onToggleMode }) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { resetPassword } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const { error } = await resetPassword(email)

    if (error) {
      setError(error.message)
    } else {
      setSuccess('Email de recuperação enviado! Verifique sua caixa de entrada.')
    }

    setLoading(false)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">P</span>
          </div>
        </div>
        <CardTitle className="text-2xl text-center bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          Recuperar Senha
        </CardTitle>
        <CardDescription className="text-center">
          Digite seu email para receber as instruções
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Enviando...
              </div>
            ) : (
              <div className="flex items-center">
                <Send className="mr-2 h-4 w-4" />
                Enviar instruções
              </div>
            )}
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="link"
              className="text-sm text-muted-foreground"
              onClick={() => onToggleMode('login')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao login
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

