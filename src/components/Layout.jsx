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

// Material-UI imports para ícones modernos
import {
  Dashboard as DashboardIcon,
  Style as FlashcardsIcon,
  School as StudyIcon,
  Quiz as QuestionsIcon,
  Assignment as ExamIcon,
  MenuBook as NotebookIcon,
  Notes as NotesIcon,
  Analytics as AnalyticsIcon,
  EmojiEvents as TrophyIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  LightMode as SunIcon,
  DarkMode as MoonIcon,
  Logout as LogoutIcon,
  Person as UserIcon,
  Language as LanguageIcon,
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material'

// Material-UI components
import {
  Chip,
  IconButton,
  Tooltip,
  Typography,
  Card,
  CardContent,
  Divider,
  Box,
  Fade,
  Zoom
} from '@mui/material'

export const Layout = ({ children }) => {
  const { user, profile, signOut, isAdmin } = useAuth()
  const { theme, setTheme } = useTheme()
  const { currentLanguage, changeLanguage, availableLanguages, t } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/', 
      icon: DashboardIcon, 
      color: 'bg-gradient-to-r from-green-400 to-green-600',
      hoverColor: 'hover:from-green-500 hover:to-green-700',
      badge: null
    },
    { 
      name: 'Flashcards', 
      href: '/study-mode', 
      icon: FlashcardsIcon, 
      color: 'bg-gradient-to-r from-blue-400 to-blue-600',
      hoverColor: 'hover:from-blue-500 hover:to-blue-700',
      badge: '2'
    },
    { 
      name: 'Estudar', 
      href: '/study', 
      icon: StudyIcon, 
      color: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
      hoverColor: 'hover:from-yellow-500 hover:to-yellow-700',
      badge: null
    },
    { 
      name: 'Banco de Questões', 
      href: '/questions', 
      icon: QuestionsIcon, 
      color: 'bg-gradient-to-r from-purple-400 to-purple-600',
      hoverColor: 'hover:from-purple-500 hover:to-purple-700',
      badge: '4'
    },
    { 
      name: 'Modo Prova', 
      href: '/exam', 
      icon: ExamIcon, 
      color: 'bg-gradient-to-r from-teal-400 to-teal-600',
      hoverColor: 'hover:from-teal-500 hover:to-teal-700',
      badge: '5'
    },
    { 
      name: 'Notebook', 
      href: '/notebook', 
      icon: NotebookIcon, 
      color: 'bg-gradient-to-r from-pink-400 to-pink-600',
      hoverColor: 'hover:from-pink-500 hover:to-pink-700',
      badge: null
    },
    { 
      name: 'Notes', 
      href: '/notes', 
      icon: NotesIcon, 
      color: 'bg-gradient-to-r from-indigo-400 to-indigo-600',
      hoverColor: 'hover:from-indigo-500 hover:to-indigo-700',
      badge: '7'
    },
    { 
      name: 'Analytics', 
      href: '/analytics', 
      icon: AnalyticsIcon, 
      color: 'bg-gradient-to-r from-orange-400 to-orange-600',
      hoverColor: 'hover:from-orange-500 hover:to-orange-700',
      badge: '8'
    },
    { 
      name: 'Conquistas', 
      href: '/achievements', 
      icon: TrophyIcon, 
      color: 'bg-gradient-to-r from-emerald-400 to-emerald-600',
      hoverColor: 'hover:from-emerald-500 hover:to-emerald-700',
      badge: '6'
    }
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Sidebar Moderna */}
        <Sidebar className="border-r border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80">
          <SidebarHeader className="p-4">
            <Zoom in={true} timeout={800}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Typography variant="h6" className="text-white font-bold">
                    P
                  </Typography>
                </div>
                <div>
                  <Typography variant="h6" className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ProMD
                  </Typography>
                  <Typography variant="caption" className="text-slate-500 dark:text-slate-400">
                    Plataforma de Validação Médica
                  </Typography>
                </div>
              </div>
            </Zoom>
          </SidebarHeader>

          <SidebarContent className="px-3">
            <SidebarMenu>
              {navigation.map((item, index) => {
                const isActive = location.pathname === item.href
                const Icon = item.icon
                
                return (
                  <Fade in={true} timeout={600 + index * 100} key={item.name}>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild 
                        className={`
                          group relative overflow-hidden rounded-xl transition-all duration-300 mb-1
                          ${isActive 
                            ? `${item.color} text-white shadow-lg transform scale-105` 
                            : `hover:bg-gradient-to-r ${item.hoverColor} hover:text-white hover:shadow-md hover:transform hover:scale-102`
                          }
                        `}
                      >
                        <Link to={item.href} className="flex items-center space-x-3 p-3">
                          <div className="relative">
                            <Icon className={`h-5 w-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                            {item.badge && (
                              <Chip 
                                label={item.badge} 
                                size="small" 
                                className="absolute -top-2 -right-2 h-5 w-5 min-w-0 text-xs bg-red-500 text-white"
                              />
                            )}
                          </div>
                          <span className="font-medium">{item.name}</span>
                          {isActive && (
                            <div className="absolute right-2 w-1 h-6 bg-white/30 rounded-full" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </Fade>
                )
              })}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-4">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0 shadow-sm">
              <CardContent className="p-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600">
                    <AvatarFallback className="text-white text-sm font-bold">
                      {profile?.full_name?.[0] || user?.email?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <Typography variant="body2" className="font-medium truncate">
                      {profile?.full_name || 'Usuário'}
                    </Typography>
                    <Typography variant="caption" className="text-slate-500 dark:text-slate-400">
                      Estudante
                    </Typography>
                  </div>
                  <Chip label="10" size="small" className="bg-red-500 text-white" />
                </div>
              </CardContent>
            </Card>
          </SidebarFooter>
        </Sidebar>

        {/* Conteúdo Principal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header Moderno */}
          <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="lg:hidden">
                  <IconButton size="small">
                    <MenuIcon />
                  </IconButton>
                </SidebarTrigger>

                {/* Busca Moderna */}
                <form onSubmit={handleSearch} className="relative">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="search"
                      placeholder="Buscar flashcards..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 w-64 bg-slate-100/50 dark:bg-slate-800/50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-slate-800"
                    />
                  </div>
                </form>
              </div>

              <div className="flex items-center space-x-3">
                {/* Seletor de Idioma */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="rounded-xl">
                      <LanguageIcon className="h-4 w-4 mr-2" />
                      🇧🇷 PO
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {availableLanguages.map((lang) => (
                      <DropdownMenuItem
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={currentLanguage === lang.code ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                      >
                        <span className="mr-2">{lang.flag}</span>
                        {lang.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Notificações */}
                <Tooltip title="Notificações">
                  <IconButton className="relative">
                    <NotificationsIcon className="h-5 w-5" />
                    <Chip 
                      label="3" 
                      size="small" 
                      className="absolute -top-1 -right-1 h-5 w-5 min-w-0 text-xs bg-red-500 text-white"
                    />
                  </IconButton>
                </Tooltip>

                {/* Toggle Tema */}
                <Tooltip title={theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}>
                  <IconButton onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                    {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                  </IconButton>
                </Tooltip>

                {/* Menu do Usuário */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-xl">
                      <Avatar className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600">
                        <AvatarFallback className="text-white font-bold">
                          {profile?.full_name?.[0] || user?.email?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {profile?.full_name || 'Usuário'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <AnalyticsIcon className="mr-2 h-4 w-4" />
                      <span>Configurações</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogoutIcon className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Conteúdo */}
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto px-6 py-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default Layout

