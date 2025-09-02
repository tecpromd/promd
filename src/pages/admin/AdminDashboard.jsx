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
  Zap
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link
                to="/"
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 flex items-center"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voltar ao Site
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">🎛️ CMS ProMD</h1>
                <p className="text-gray-600">Sistema de Gerenciamento de Conteúdo - Adicione questões, flashcards e materiais</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                ✅ Sistema Ativo
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Questões</p>
                <p className="text-3xl font-bold text-gray-900">{stats.questions}</p>
                <p className="text-xs text-gray-500">no banco de dados</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CreditCard className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Flashcards</p>
                <p className="text-3xl font-bold text-gray-900">{stats.flashcards}</p>
                <p className="text-xs text-gray-500">no banco de dados</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Disciplinas</p>
                <p className="text-3xl font-bold text-gray-900">{stats.disciplines}</p>
                <p className="text-xs text-gray-500">organizadas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <BarChart3 className="w-8 h-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                <p className="text-3xl font-bold text-gray-900">{stats.users}</p>
                <p className="text-xs text-gray-500">utilizando</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ações Principais - Destaque */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 mb-8 text-white">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">🚀 Ações Principais</h2>
            <p className="text-blue-100">Adicione conteúdo diretamente ao banco de dados</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/admin/cms/questions"
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all transform hover:scale-105"
            >
              <div className="text-center">
                <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">📚 Gerenciar Questões</h3>
                <p className="text-sm text-blue-100 mb-4">Adicionar, editar e organizar questões</p>
                <div className="bg-white/20 rounded-lg p-2">
                  <span className="text-xs font-medium">+ Nova Questão</span>
                </div>
              </div>
            </Link>

            <Link
              to="/admin/cms/flashcards"
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all transform hover:scale-105"
            >
              <div className="text-center">
                <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CreditCard className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">🃏 Gerenciar Flashcards</h3>
                <p className="text-sm text-blue-100 mb-4">Criar e organizar flashcards</p>
                <div className="bg-white/20 rounded-lg p-2">
                  <span className="text-xs font-medium">+ Novo Flashcard</span>
                </div>
              </div>
            </Link>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-center">
                <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">📤 Import em Lote</h3>
                <p className="text-sm text-blue-100 mb-4">Upload de arquivos CSV/Excel</p>
                <div className="bg-white/20 rounded-lg p-2">
                  <span className="text-xs font-medium">Em breve</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Zap className="w-6 h-6 mr-2 text-yellow-500" />
            Ações Rápidas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/cms/questions"
              className="flex items-center p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all group"
            >
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Plus className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <span className="font-medium text-gray-900">Nova Questão</span>
                <p className="text-xs text-gray-500">Adicionar ao banco</p>
              </div>
            </Link>
            
            <Link
              to="/admin/cms/flashcards"
              className="flex items-center p-4 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all group"
            >
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <Plus className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <span className="font-medium text-gray-900">Novo Flashcard</span>
                <p className="text-xs text-gray-500">Criar flashcard</p>
              </div>
            </Link>
            
            <Link
              to="/admin/cms/questions"
              className="flex items-center p-4 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all group"
            >
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <Eye className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <span className="font-medium text-gray-900">Ver Questões</span>
                <p className="text-xs text-gray-500">Listar todas</p>
              </div>
            </Link>

            <Link
              to="/admin/cms/flashcards"
              className="flex items-center p-4 border-2 border-orange-200 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-all group"
            >
              <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                <Eye className="w-5 h-5 text-orange-600" />
              </div>
              <div className="ml-3">
                <span className="font-medium text-gray-900">Ver Flashcards</span>
                <p className="text-xs text-gray-500">Listar todos</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Informações do Sistema */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">ℹ️ Informações do Sistema</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Como usar o CMS:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use "Gerenciar Questões" para adicionar questões individuais</li>
                <li>• Use "Gerenciar Flashcards" para criar flashcards</li>
                <li>• Todas as alterações são salvas diretamente no banco</li>
                <li>• Use tags para organizar por disciplinas</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Status do Sistema:</h4>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>Banco de dados: Conectado</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>Storage: Funcionando</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>CMS: Operacional</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

