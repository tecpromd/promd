import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  BookOpen,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

const supabase = createClient(
  'https://truepksaojbpgwdtelbb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydWVwa3Nhb2picGd3ZHRlbGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzM0NjcsImV4cCI6MjA3MDE0OTQ2N30.UO0hdlI6IAvJeWDEbrnicMMLNn9ExAV7zPQlEc3DgTk'
);

const DisciplineManager = () => {
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    icon: '📚',
    order_index: 0
  });

  // Carregar disciplinas
  useEffect(() => {
    loadDisciplines();
  }, []);

  const loadDisciplines = async () => {
    try {
      const { data, error } = await supabase
        .from('disciplines')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setDisciplines(data || []);
    } catch (error) {
      console.error('Erro ao carregar disciplinas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        // Atualizar disciplina existente
        const { error } = await supabase
          .from('disciplines')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
        alert('Disciplina atualizada com sucesso!');
      } else {
        // Criar nova disciplina
        const { error } = await supabase
          .from('disciplines')
          .insert([formData]);

        if (error) throw error;
        alert('Disciplina criada com sucesso!');
      }

      resetForm();
      loadDisciplines();
    } catch (error) {
      console.error('Erro ao salvar disciplina:', error);
      alert('Erro ao salvar disciplina: ' + error.message);
    }
  };

  const handleEdit = (discipline) => {
    setFormData({
      name: discipline.name,
      description: discipline.description || '',
      color: discipline.color || '#3B82F6',
      icon: discipline.icon || '📚',
      order_index: discipline.order_index || 0
    });
    setEditingId(discipline.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta disciplina?')) return;

    try {
      const { error } = await supabase
        .from('disciplines')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('Disciplina excluída com sucesso!');
      loadDisciplines();
    } catch (error) {
      console.error('Erro ao excluir disciplina:', error);
      alert('Erro ao excluir disciplina: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: '#3B82F6',
      icon: '📚',
      order_index: 0
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const iconOptions = [
    '📚', '🏥', '🧬', '💊', '🫀', '🧠', '🦴', '👁️', 
    '🫁', '🩸', '🧪', '🔬', '💉', '🩺', '⚕️', '🏥'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando disciplinas...</p>
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
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <Link to="/admin/cms">
                <button className="bg-white/70 backdrop-blur-sm hover:bg-white/90 text-slate-700 px-6 py-3 rounded-2xl font-medium shadow-lg border border-white/20 transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Voltar ao CMS
                </button>
              </Link>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
                  <BookOpen className="h-8 w-8 text-purple-600" />
                  Disciplinas
                </h1>
                <p className="text-slate-600 text-lg font-medium">
                  Gerencie as disciplinas médicas da plataforma
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowAddForm(true)}
              className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Nova Disciplina
              </div>
            </button>
          </div>

          {/* Formulário de Adição/Edição */}
          {showAddForm && (
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/30 mb-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  {editingId ? '✏️ Editar Disciplina' : '➕ Nova Disciplina'}
                </h2>
                <p className="text-slate-600">
                  {editingId ? 'Atualize as informações da disciplina' : 'Preencha os dados para criar uma nova disciplina'}
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Nome da Disciplina</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ex: Cardiologia"
                      required
                      className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Ícone</label>
                    <select 
                      value={formData.icon} 
                      onChange={(e) => setFormData({...formData, icon: e.target.value})}
                      className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    >
                      {iconOptions.map(icon => (
                        <option key={icon} value={icon}>
                          {icon} {icon}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Descrição</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Descrição da disciplina..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Cor</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData({...formData, color: e.target.value})}
                        className="w-16 h-12 rounded-xl border-2 border-white/30 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.color}
                        onChange={(e) => setFormData({...formData, color: e.target.value})}
                        placeholder="#3B82F6"
                        className="flex-1 px-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Ordem</label>
                    <input
                      type="number"
                      value={formData.order_index}
                      onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value)})}
                      min="0"
                      className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="submit" 
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {editingId ? 'Atualizar' : 'Criar'}
                  </button>
                  <button 
                    type="button" 
                    onClick={resetForm}
                    className="bg-white/70 backdrop-blur-sm text-slate-700 px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 border border-white/30"
                  >
                    <X className="h-4 w-4" />
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de Disciplinas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {disciplines.map((discipline) => (
              <div key={discipline.id} className="group bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
                      style={{ backgroundColor: discipline.color + '20', border: `2px solid ${discipline.color}40` }}
                    >
                      {discipline.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{discipline.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">Ordem: {discipline.order_index}</p>
                    </div>
                  </div>
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white shadow-lg"
                    style={{ backgroundColor: discipline.color }}
                  ></div>
                </div>
                
                {discipline.description && (
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                    {discipline.description}
                  </p>
                )}
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleEdit(discipline)}
                    className="flex-1 bg-blue-500/20 text-blue-700 py-2 px-4 rounded-xl font-medium hover:bg-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(discipline.id)}
                    className="flex-1 bg-red-500/20 text-red-700 py-2 px-4 rounded-xl font-medium hover:bg-red-500/30 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>

          {disciplines.length === 0 && (
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/30 text-center">
              <BookOpen className="h-20 w-20 text-slate-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-slate-800 mb-3">
                Nenhuma disciplina encontrada
              </h3>
              <p className="text-slate-600 mb-6 text-lg">
                Comece criando sua primeira disciplina médica.
              </p>
              <button 
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto"
              >
                <Plus className="h-5 w-5" />
                Criar Primeira Disciplina
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisciplineManager;

