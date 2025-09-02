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
  Tag,
  ArrowLeft,
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';

const supabase = createClient(
  'https://truepksaojbpgwdtelbb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydWVwa3Nhb2picGd3ZHRlbGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzM0NjcsImV4cCI6MjA3MDE0OTQ2N30.UO0hdlI6IAvJeWDEbrnicMMLNn9ExAV7zPQlEc3DgTk'
);

const TopicManager = () => {
  const [topics, setTopics] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discipline_id: '',
    color: '#10B981',
    order_index: 0
  });

  // Carregar temas e disciplinas
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Carregar disciplinas
      const { data: disciplinesData, error: disciplinesError } = await supabase
        .from('disciplines')
        .select('*')
        .order('name');

      if (disciplinesError) throw disciplinesError;
      setDisciplines(disciplinesData || []);

      // Carregar temas com disciplinas
      const { data: topicsData, error: topicsError } = await supabase
        .from('topics')
        .select(`
          *,
          disciplines (
            id,
            name,
            color,
            icon
          )
        `)
        .order('order_index', { ascending: true });

      if (topicsError) throw topicsError;
      setTopics(topicsData || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        // Atualizar tema existente
        const { error } = await supabase
          .from('topics')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
        alert('Tema atualizado com sucesso!');
      } else {
        // Criar novo tema
        const { error } = await supabase
          .from('topics')
          .insert([formData]);

        if (error) throw error;
        alert('Tema criado com sucesso!');
      }

      resetForm();
      loadData();
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
      alert('Erro ao salvar tema: ' + error.message);
    }
  };

  const handleEdit = (topic) => {
    setFormData({
      name: topic.name,
      description: topic.description || '',
      discipline_id: topic.discipline_id,
      color: topic.color || '#10B981',
      order_index: topic.order_index || 0
    });
    setEditingId(topic.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este tema?')) return;

    try {
      const { error } = await supabase
        .from('topics')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('Tema excluído com sucesso!');
      loadData();
    } catch (error) {
      console.error('Erro ao excluir tema:', error);
      alert('Erro ao excluir tema: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      discipline_id: '',
      color: '#10B981',
      order_index: 0
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando temas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to="/admin/cms">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao CMS
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Tag className="h-6 w-6 text-green-600" />
              Gerenciar Temas
            </h1>
          </div>
          
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Tema
          </Button>
        </div>

        {/* Formulário de Adição/Edição */}
        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {editingId ? 'Editar Tema' : 'Novo Tema'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome do Tema</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ex: Arritmias Cardíacas"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Disciplina</label>
                    <Select 
                      value={formData.discipline_id} 
                      onValueChange={(value) => setFormData({...formData, discipline_id: value})}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma disciplina" />
                      </SelectTrigger>
                      <SelectContent>
                        {disciplines.map(discipline => (
                          <SelectItem key={discipline.id} value={discipline.id}>
                            {discipline.icon} {discipline.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Descrição</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Descrição do tema..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Cor</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData({...formData, color: e.target.value})}
                        className="w-16 h-10"
                      />
                      <Input
                        value={formData.color}
                        onChange={(e) => setFormData({...formData, color: e.target.value})}
                        placeholder="#10B981"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Ordem</label>
                    <Input
                      type="number"
                      value={formData.order_index}
                      onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value)})}
                      min="0"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    <Save className="h-4 w-4 mr-2" />
                    {editingId ? 'Atualizar' : 'Criar'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Lista de Temas agrupados por Disciplina */}
        {disciplines.map((discipline) => {
          const disciplineTopics = topics.filter(topic => topic.discipline_id === discipline.id);
          
          if (disciplineTopics.length === 0) return null;
          
          return (
            <Card key={discipline.id} className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">{discipline.icon}</span>
                  <span>{discipline.name}</span>
                  <span className="text-sm text-gray-500">({disciplineTopics.length} temas)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {disciplineTopics.map((topic) => (
                    <Card key={topic.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{topic.name}</h3>
                            <p className="text-xs text-gray-500">Ordem: {topic.order_index}</p>
                          </div>
                          <div 
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: topic.color }}
                          ></div>
                        </div>
                        
                        {topic.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {topic.description}
                          </p>
                        )}
                        
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEdit(topic)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(topic.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {topics.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Tag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum tema encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                Comece criando seu primeiro tema.
              </p>
              {disciplines.length === 0 ? (
                <div className="space-y-2">
                  <p className="text-sm text-red-600">
                    Você precisa criar disciplinas primeiro.
                  </p>
                  <Link to="/admin/disciplines">
                    <Button variant="outline">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Gerenciar Disciplinas
                    </Button>
                  </Link>
                </div>
              ) : (
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Tema
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TopicManager;

