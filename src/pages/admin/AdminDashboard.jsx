import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  CreditCard, 
  Users, 
  FileText, 
  Upload, 
  BarChart3,
  Settings,
  Database,
  Plus,
  Eye,
  Edit,
  Trash2,
  ArrowLeft,
  Zap,
  Tag,
  Activity,
  TrendingUp
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    questions: 0,
    flashcards: 0,
    disciplines: 0,
    users: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Buscar estatísticas do banco
      const [questionsRes, flashcardsRes] = await Promise.all([
        supabase.from('questions').select('id', { count: 'exact' }),
        supabase.from('flashcards').select('id', { count: 'exact' })
      ]);

      setStats({
        questions: questionsRes.count || 0,
        flashcards: flashcardsRes.count || 0,
        disciplines: 26, // Disciplinas fixas conforme PDF
        users: 1 // Placeholder
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto mb-4"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent rounded-full animate-ping border-t-blue-400 mx-auto"></div>
          </div>
          <p className="text-slate-600 font-medium text-lg">Carregando CMS ProMD...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Moderno */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  CMS ProMD
                </h1>
                <p className="text-slate-600 text-lg font-medium">
                  Sistema de Gerenciamento de Conteúdo
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-slate-700 font-medium">Sistema Online</span>
                  </div>
                </div>
                
                <Link to="/">
                  <button className="bg-white/70 backdrop-blur-sm hover:bg-white/90 text-slate-700 px-6 py-3 rounded-2xl font-medium shadow-lg border border-white/20 transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Voltar ao Site
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Estatísticas Modernas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-slate-800">{stats.questions}</div>
                  <div className="text-sm text-slate-500 font-medium">Questões</div>
                </div>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full w-3/4"></div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg">
                  <CreditCard className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-slate-800">{stats.flashcards}</div>
                  <div className="text-sm text-slate-500 font-medium">Flashcards</div>
                </div>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full w-4/5"></div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg">
                  <Database className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-slate-800">{stats.disciplines}</div>
                  <div className="text-sm text-slate-500 font-medium">Disciplinas</div>
                </div>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full w-full"></div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-slate-800">{stats.users}</div>
                  <div className="text-sm text-slate-500 font-medium">Usuários</div>
                </div>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full w-1/4"></div>
              </div>
            </div>
          </div>

          {/* Ações Principais Modernas */}
          <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/30 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-3">
                🚀 Gerenciamento de Conteúdo
              </h2>
              <p className="text-slate-600 text-lg">
                Adicione e organize conteúdo diretamente no banco de dados
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link
                to="/admin/cms/questions"
                className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 text-center text-white">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Questões</h3>
                  <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                    Criar e gerenciar questões de múltipla escolha
                  </p>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl py-3 px-4 font-semibold text-sm">
                    + Nova Questão
                  </div>
                </div>
              </Link>

              <Link
                to="/admin/cms/flashcards"
                className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 text-center text-white">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <CreditCard className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Flashcards</h3>
                  <p className="text-emerald-100 text-sm mb-6 leading-relaxed">
                    Criar e organizar flashcards de estudo
                  </p>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl py-3 px-4 font-semibold text-sm">
                    + Novo Flashcard
                  </div>
                </div>
              </Link>

              <Link
                to="/admin/disciplines"
                className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 text-center text-white">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Database className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Disciplinas</h3>
                  <p className="text-purple-100 text-sm mb-6 leading-relaxed">
                    Organizar disciplinas médicas
                  </p>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl py-3 px-4 font-semibold text-sm">
                    + Nova Disciplina
                  </div>
                </div>
              </Link>

              <Link
                to="/admin/cms/content"
                className="group relative overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 text-center text-white">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Conteúdo</h3>
                  <p className="text-orange-100 text-sm mb-6 leading-relaxed">
                    Reviews, High Yield Tips e materiais
                  </p>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl py-3 px-4 font-semibold text-sm">
                    + Novo Material
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Seção de Atividade Recente */}
          <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/30">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <Activity className="w-6 h-6 text-blue-600" />
                Atividade Recente
              </h3>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <TrendingUp className="w-4 h-4" />
                <span>Últimas 24h</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white/50 rounded-2xl">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">Sistema inicializado</p>
                  <p className="text-sm text-slate-600">CMS ProMD está funcionando normalmente</p>
                </div>
                <div className="text-sm text-slate-500">Agora</div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-white/50 rounded-2xl">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Database className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">Banco de dados conectado</p>
                  <p className="text-sm text-slate-600">Todas as tabelas estão funcionais</p>
                </div>
                <div className="text-sm text-slate-500">2 min</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

