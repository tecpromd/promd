import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Upload,
  ArrowLeft,
  Save,
  X,
  BookOpen,
  Lightbulb,
  Eye,
  Download,
  Tag,
  Calendar
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const ContentMaterialManager = () => {
  const [materials, setMaterials] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [showNewMaterialForm, setShowNewMaterialForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);

  const [newMaterial, setNewMaterial] = useState({
    title: '',
    content: '',
    type: 'review',
    topic_id: '',
    file_url: '',
    file_type: ''
  });

  const materialTypes = [
    { value: 'review', label: 'Review', icon: BookOpen, color: '#3B82F6', description: 'Conteúdo teórico completo' },
    { value: 'high_yield_tips', label: 'High Yield Tips', icon: Lightbulb, color: '#F59E0B', description: 'Dicas importantes e pontos-chave' },
    { value: 'qf', label: 'QF Materials', icon: FileText, color: '#10B981', description: 'Material de apoio para questões' }
  ];

  useEffect(() => {
    fetchMaterials();
    fetchTopics();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('content_materials')
        .select(`
          *,
          topics:topic_id(name, discipline)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMaterials(data || []);
    } catch (error) {
      console.error('Erro ao buscar materiais:', error);
      alert('Erro ao carregar materiais');
    } finally {
      setLoading(false);
    }
  };

  const fetchTopics = async () => {
    try {
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setTopics(data || []);
    } catch (error) {
      console.error('Erro ao buscar temas:', error);
    }
  };

  const handleCreateMaterial = async () => {
    try {
      if (!newMaterial.title.trim()) {
        alert('Título é obrigatório');
        return;
      }

      if (!newMaterial.topic_id) {
        alert('Tema é obrigatório');
        return;
      }

      const materialData = {
        title: newMaterial.title.trim(),
        content: newMaterial.content.trim(),
        type: newMaterial.type,
        topic_id: parseInt(newMaterial.topic_id),
        file_url: newMaterial.file_url.trim() || null,
        file_type: newMaterial.file_type || null,
        is_active: true
      };

      const { data, error } = await supabase
        .from('content_materials')
        .insert([materialData])
        .select(`
          *,
          topics:topic_id(name, discipline)
        `)
        .single();

      if (error) throw error;

      setMaterials(prev => [data, ...prev]);
      setNewMaterial({
        title: '',
        content: '',
        type: 'review',
        topic_id: '',
        file_url: '',
        file_type: ''
      });
      setShowNewMaterialForm(false);
      alert('Material criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar material:', error);
      alert('Erro ao criar material: ' + error.message);
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    if (!confirm('Tem certeza que deseja excluir este material?')) return;

    try {
      const { error } = await supabase
        .from('content_materials')
        .update({ is_active: false })
        .eq('id', materialId);

      if (error) throw error;

      setMaterials(prev => prev.filter(material => material.id !== materialId));
      alert('Material excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir material:', error);
      alert('Erro ao excluir material');
    }
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (material.content && material.content.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || material.type === selectedType;
    const matchesTopic = selectedTopic === '' || material.topic_id.toString() === selectedTopic;
    return matchesSearch && matchesType && matchesTopic;
  });

  const getTypeInfo = (type) => {
    return materialTypes.find(t => t.value === type) || materialTypes[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto mb-4"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent rounded-full animate-ping border-t-blue-400 mx-auto"></div>
          </div>
          <p className="text-slate-600 font-medium text-lg">Carregando materiais...</p>
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
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <Link to="/admin/cms">
                <button className="bg-white/70 backdrop-blur-sm hover:bg-white/90 text-slate-700 px-6 py-3 rounded-2xl font-medium shadow-lg border border-white/20 transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Voltar ao CMS
                </button>
              </Link>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-600" />
                  Gerenciar Conteúdo
                </h1>
                <p className="text-slate-600 text-lg font-medium">
                  Reviews, High Yield Tips e materiais de apoio
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowNewMaterialForm(true)}
              className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Novo Material
              </div>
            </button>
          </div>

          {/* Filtros */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/30 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar materiais..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Tipo</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="all">Todos os tipos</option>
                  {materialTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Tema</label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Todos os temas</option>
                  {topics.map(topic => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name} ({topic.discipline})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedType('all');
                    setSelectedTopic('');
                  }}
                  className="w-full bg-white/70 backdrop-blur-sm text-slate-700 px-6 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/30"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          </div>

          {/* Modal Novo Material */}
          {showNewMaterialForm && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/30">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-800">📄 Novo Material</h3>
                  <button
                    onClick={() => setShowNewMaterialForm(false)}
                    className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-xl transition-all duration-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">Título *</label>
                      <input
                        type="text"
                        value={newMaterial.title}
                        onChange={(e) => setNewMaterial(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Título do material..."
                        className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">Tema *</label>
                      <select
                        value={newMaterial.topic_id}
                        onChange={(e) => setNewMaterial(prev => ({ ...prev, topic_id: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      >
                        <option value="">Selecionar tema...</option>
                        {topics.map(topic => (
                          <option key={topic.id} value={topic.id}>
                            {topic.name} ({topic.discipline})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Tipo de Material</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {materialTypes.map(type => {
                        const Icon = type.icon;
                        return (
                          <button
                            key={type.value}
                            onClick={() => setNewMaterial(prev => ({ ...prev, type: type.value }))}
                            className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                              newMaterial.type === type.value 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-white/30 bg-white/50 hover:bg-white/70'
                            }`}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <Icon className="w-6 h-6" style={{ color: type.color }} />
                              <span className="font-semibold text-slate-800">{type.label}</span>
                            </div>
                            <p className="text-sm text-slate-600">{type.description}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">URL do Arquivo (opcional)</label>
                      <input
                        type="url"
                        value={newMaterial.file_url}
                        onChange={(e) => setNewMaterial(prev => ({ ...prev, file_url: e.target.value }))}
                        placeholder="https://exemplo.com/arquivo.pdf"
                        className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">Tipo do Arquivo</label>
                      <select
                        value={newMaterial.file_type}
                        onChange={(e) => setNewMaterial(prev => ({ ...prev, file_type: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      >
                        <option value="">Selecionar tipo...</option>
                        <option value="pdf">PDF</option>
                        <option value="doc">Word</option>
                        <option value="txt">Texto</option>
                        <option value="md">Markdown</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Conteúdo</label>
                    <textarea
                      value={newMaterial.content}
                      onChange={(e) => setNewMaterial(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Conteúdo do material..."
                      rows={12}
                      className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button 
                    onClick={handleCreateMaterial}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Salvar Material
                  </button>
                  <button 
                    onClick={() => setShowNewMaterialForm(false)}
                    className="bg-white/70 backdrop-blur-sm text-slate-700 px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 border border-white/30"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Lista de Materiais */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredMaterials.map((material) => {
              const typeInfo = getTypeInfo(material.type);
              const Icon = typeInfo.icon;
              
              return (
                <div 
                  key={material.id} 
                  className="group bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-3 rounded-2xl"
                        style={{ backgroundColor: `${typeInfo.color}20` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: typeInfo.color }} />
                      </div>
                      <div>
                        <span 
                          className="text-sm font-semibold px-3 py-1 rounded-full"
                          style={{ 
                            backgroundColor: `${typeInfo.color}20`,
                            color: typeInfo.color
                          }}
                        >
                          {typeInfo.label}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setEditingMaterial(material)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-all duration-300"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteMaterial(material.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-xl transition-all duration-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-slate-900 text-lg mb-3 line-clamp-2">
                    {material.title}
                  </h3>

                  {material.topics && (
                    <div className="mb-3 p-3 bg-slate-100 rounded-2xl">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-700">
                          {material.topics.name}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">
                        {material.topics.discipline}
                      </span>
                    </div>
                  )}
                  
                  {material.content && (
                    <p className="text-sm text-slate-600 mb-4 line-clamp-3 leading-relaxed">
                      {material.content}
                    </p>
                  )}

                  {material.file_url && (
                    <div className="mb-4">
                      <a 
                        href={material.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        <Download className="w-4 h-4" />
                        Baixar arquivo ({material.file_type?.toUpperCase()})
                      </a>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(material.created_at).toLocaleDateString('pt-BR')}
                    </div>
                    <button className="flex items-center gap-1 hover:text-slate-700 transition-colors">
                      <Eye className="w-3 h-3" />
                      Visualizar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredMaterials.length === 0 && (
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/30 text-center">
              <FileText className="h-20 w-20 text-slate-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-slate-800 mb-3">
                {searchTerm || selectedType !== 'all' || selectedTopic ? 'Nenhum material encontrado' : 'Nenhum material cadastrado'}
              </h3>
              <p className="text-slate-600 mb-6 text-lg">
                {searchTerm || selectedType !== 'all' || selectedTopic
                  ? 'Tente ajustar os filtros de busca.' 
                  : 'Comece criando reviews e high yield tips para seus temas.'
                }
              </p>
              {!searchTerm && selectedType === 'all' && !selectedTopic && (
                <button 
                  onClick={() => setShowNewMaterialForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto"
                >
                  <Plus className="h-5 w-5" />
                  Criar Primeiro Material
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentMaterialManager;

