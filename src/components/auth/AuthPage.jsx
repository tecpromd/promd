import { useState } from 'react'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { ForgotPasswordForm } from './ForgotPasswordForm'

export const AuthPage = () => {
  const [mode, setMode] = useState('login') // 'login', 'register', 'forgot'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {mode === 'login' && <LoginForm onToggleMode={setMode} />}
        {mode === 'register' && <RegisterForm onToggleMode={setMode} />}
        {mode === 'forgot' && <ForgotPasswordForm onToggleMode={setMode} />}
      </div>
    </div>
  )
}

