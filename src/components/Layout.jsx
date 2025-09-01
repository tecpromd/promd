import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from './ThemeProvider'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Badge } from './ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from './ui/sidebar'
import {
  Home,
  BookOpen,
  GraduationCap,
  Settings,
  Search,
  Bell,
  Sun,
  Moon,
  LogOut,
  User,
  Shield,
  Database,
  BarChart3,
  Trophy,
  FileText,
  Globe
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Flashcards', href: '/flashcards', icon: BookOpen },
  { name: 'Modo Estudo', href: '/study-mode', icon: GraduationCap },
  { name: 'Estudar', href: '/study', icon: GraduationCap },
  { name: 'Banco de Questões', href: '/questions', icon: Database },
  { name: 'Modo Prova', href: '/exam', icon: FileText },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Conquistas', href: '/achievements', icon: Trophy },
]

const adminNavigation = [
  { name: 'Administração', href: '/admin', icon: Shield },
]

export const Layout = ({ children }) => {
  const { user, profile, signOut, isAdmin } = useAuth()
  const { theme, setTheme } = useTheme()
  const { currentLanguage, changeLanguage, availableLanguages, t } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const getUserInitials = () => {
    if (profile?.name) {
      return profile.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return user?.email?.[0]?.toUpperCase() || 'U'
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        {/* Sidebar */}
        <Sidebar className="border-r bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-3">
              <img 
                src="/logo-promd-official.png" 
                alt="ProMD Logo" 
                className="h-12 w-auto object-contain"
              />
              <div>
                <p className="text-xs text-muted-foreground">
                  Plataforma de Validação Médica
                </p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-4">
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.href}
                  >
                    <Link to={item.href} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {isAdmin && (
                <>
                  <div className="my-4 border-t" />
                  {adminNavigation.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === item.href}
                      >
                        <Link to={item.href} className="flex items-center gap-3">
                          <item.icon className="h-5 w-5" />
                          <span>{item.name}</span>
                          <Badge variant="secondary" className="ml-auto">
                            Admin
                          </Badge>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </>
              )}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t p-4">
            <div className="space-y-3">
              {/* Estatísticas rápidas */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-lg p-3">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-600">12</div>
                    <div className="text-xs text-muted-foreground">Estudados</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-cyan-600">89%</div>
                    <div className="text-xs text-muted-foreground">Progresso</div>
                  </div>
                </div>
              </div>

              {/* Perfil do usuário */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start gap-3 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">
                        {profile?.name || 'Usuário'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {profile?.role === 'admin' ? 'Administrador' : 'Estudante'}
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={toggleTheme}>
                    {theme === 'light' ? (
                      <Moon className="mr-2 h-4 w-4" />
                    ) : (
                      <Sun className="mr-2 h-4 w-4" />
                    )}
                    {theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                
                {/* Busca */}
                <div className="relative w-96">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar flashcards..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/50 dark:bg-slate-800/50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Seletor de Idiomas */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Globe className="h-4 w-4" />
                      {availableLanguages.find(lang => lang.code === currentLanguage)?.flag} {availableLanguages.find(lang => lang.code === currentLanguage)?.name.slice(0, 2).toUpperCase()}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {availableLanguages.map((language) => (
                      <DropdownMenuItem 
                        key={language.code}
                        onClick={() => changeLanguage(language.code)}
                        className={currentLanguage === language.code ? 'bg-accent' : ''}
                      >
                        {language.flag} {language.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Notificações */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                    3
                  </Badge>
                </Button>

                {/* Avatar do usuário */}
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          {/* Conteúdo da página */}
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

