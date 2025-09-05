import React, { useState } from 'react'
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
  Globe,
  StickyNote
} from 'lucide-react'

// Material-UI imports
import {
  Chip,
  IconButton,
  Tooltip,
  Box,
  Typography,
  Card,
  CardContent,
  Divider
} from '@mui/material'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Flashcards', href: '/study-mode', icon: BookOpen },
  { name: 'Estudar', href: '/study', icon: GraduationCap },
  { name: 'Banco de Questões', href: '/questions', icon: Database },
  { name: 'Modo Prova', href: '/exam', icon: FileText },
  { name: 'Notebook', href: '/notebook', icon: BookOpen },
  { name: 'Notes', href: '/notes', icon: StickyNote },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Conquistas', href: '/achievements', icon: Trophy },
]

const adminNavigation = [
  { name: 'Administração', href: '/admin', icon: Shield },
  { name: 'CMS - Gerenciar Conteúdo', href: '/admin/cms', icon: Settings, description: 'Adicionar questões, flashcards e conteúdo' },
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
        {/* Sidebar Modernizada */}
        <Sidebar className="border-r bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-lg">
          <SidebarHeader className="border-b p-3">
            <div className="flex items-center gap-2">
              <img 
                src="/logo-promd-official.png" 
                alt="ProMD Logo" 
                className="h-8 w-auto object-contain"
              />
              <div>
                <Typography variant="caption" className="text-muted-foreground text-xs">
                  Plataforma de Validação Médica
                </Typography>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-2">
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.href}
                    className="h-9 px-3 py-2 text-sm"
                  >
                    <Link to={item.href} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {isAdmin && (
                <>
                  <Divider className="my-2" />
                  {adminNavigation.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === item.href}
                        className="h-9 px-3 py-2 text-sm"
                      >
                        <Link to={item.href} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span className="text-sm">{item.name}</span>
                          <Chip 
                            label="Admin" 
                            size="small" 
                            variant="outlined"
                            className="ml-auto h-5 text-xs"
                          />
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </>
              )}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t p-3">
            <div className="space-y-2">
              {/* Estatísticas compactas */}
              <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
                <CardContent className="p-2">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div>
                      <Typography variant="h6" className="text-blue-600 text-sm font-bold">12</Typography>
                      <Typography variant="caption" className="text-muted-foreground text-xs">Estudados</Typography>
                    </div>
                    <div>
                      <Typography variant="h6" className="text-cyan-600 text-sm font-bold">89%</Typography>
                      <Typography variant="caption" className="text-muted-foreground text-xs">Progresso</Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Perfil compacto */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start gap-2 p-2 h-10">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <div className="text-xs font-medium">
                        {profile?.name || 'Usuário'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {profile?.role === 'admin' ? 'Administrador' : 'Estudante'}
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="text-sm">Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="text-sm">
                    <User className="mr-2 h-3 w-3" />
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')} className="text-sm">
                    <Settings className="mr-2 h-3 w-3" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={toggleTheme} className="text-sm">
                    {theme === 'light' ? (
                      <Moon className="mr-2 h-3 w-3" />
                    ) : (
                      <Sun className="mr-2 h-3 w-3" />
                    )}
                    {theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-sm">
                    <LogOut className="mr-2 h-3 w-3" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col">
          {/* Header compacto */}
          <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b px-4 py-2 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="h-8 w-8" />
                
                {/* Busca compacta */}
                <div className="relative w-80">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  <Input
                    placeholder="Buscar flashcards..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 h-8 text-sm bg-white/50 dark:bg-slate-800/50 border-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Seletor de Idiomas compacto */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1 h-8 px-2 text-xs">
                      <Globe className="h-3 w-3" />
                      {availableLanguages.find(lang => lang.code === currentLanguage)?.flag} {availableLanguages.find(lang => lang.code === currentLanguage)?.name.slice(0, 2).toUpperCase()}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {availableLanguages.map((language) => (
                      <DropdownMenuItem 
                        key={language.code}
                        onClick={() => changeLanguage(language.code)}
                        className={`text-sm ${currentLanguage === language.code ? 'bg-accent' : ''}`}
                      >
                        {language.flag} {language.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Notificações compactas */}
                <Tooltip title="Notificações">
                  <IconButton size="small" className="relative">
                    <Bell className="h-4 w-4" />
                    <Chip 
                      label="3" 
                      size="small"
                      className="absolute -top-1 -right-1 h-4 w-4 min-w-4 text-xs bg-red-500 text-white"
                    />
                  </IconButton>
                </Tooltip>

                {/* Avatar compacto */}
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          {/* Conteúdo da página */}
          <main className="flex-1 p-4 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

