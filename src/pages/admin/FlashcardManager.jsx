import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Upload,
  ArrowLeft,
  Save,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const FlashcardManager = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [showNewFlashcardForm, setShowNewFlashcardForm] = useState(false);
  const [editingFlashcard, setEditingFlashcard] = useState(null);

  // Form state para novo flashcard
  const [newFlashcard, setNewFlashcard] = useState({
    title: '',
    description: '',
    question: '',
    answer: '',
    difficulty: 'easy',
    type: 'text',
    tags: [],
    justification: '',
    image_url: ''
  });

  const disciplines = [
    'Behavioral Science', 'Biochemistry', 'Biostatistics & Epidemiology',
    'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology',
    'Genetics', 'Hematology', 'Immunology', 'Infectious Disease',
    'Anatomy, Musculoskeletal & Rheumatology', 'Neurology', 'Pathology',
    'Pharmacology', 'Psychiatry', 'Pulmonary', 'Renal',
    'Female Genital, Reproductive & Breast', 'Male Pathology'
  ];

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFlashcards(data || []);
    } catch (error) {
      console.error('Erro ao buscar flashcards:', error);
      alert('Erro ao carregar flashcards');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFlashcard = async () => {
    try {
      // Validações
      if (!newFlashcard.title.trim()) {
        alert('Título é obrigatório');
        return;
      }

      if (!newFlashcard.question.trim()) {
        alert('Pergunta é obrigatória');
        return;
      }

      if (!newFlashcard.answer.trim()) {
        alert('Resposta é obrigatória');
        return;
      }

      const { data, error } = await supabase
        .from('flashcards')
        .insert([{
          ...newFlashcard,
          tags: newFlashcard.tags.length > 0 ? newFlashcard.tags : null
        }])
        .select()
        .single();

      if (error) throw error;

      setFlashcards(prev => [data, ...prev]);
      setNewFlashcard({
        title: '',
        description: '',
        question: '',
        answer: '',
        difficulty: 'easy',
        type: 'text',
        tags: [],
        justification: '',
        image_url: ''
      });
      setShowNewFlashcardForm(false);
      alert('Flashcard criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar flashcard:', error);
      alert('Erro ao criar flashcard: ' + error.message);
    }
  };

  const handleUpdateFlashcard = async (flashcardId, updates) => {
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .update(updates)
        .eq('id', flashcardId)
        .select()
        .single();

      if (error) throw error;

      setFlashcards(prev => 
        prev.map(f => f.id === flashcardId ? data : f)
      );
      setEditingFlashcard(null);
      alert('Flashcard atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar flashcard:', error);
      alert('Erro ao atualizar flashcard');
    }
  };

  const handleDeleteFlashcard = async (flashcardId) => {
    if (!confirm('Tem certeza que deseja excluir este flashcard?')) return;

    try {
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', flashcardId);

      if (error) throw error;

      setFlashcards(prev => prev.filter(f => f.id !== flashcardId));
      alert('Flashcard excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir flashcard:', error);
      alert('Erro ao excluir flashcard');
    }
  };

  const filteredFlashcards = flashcards.filter(flashcard => {
    const matchesSearch = flashcard.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         flashcard.question.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDiscipline = !selectedDiscipline || 
                             (flashcard.tags && flashcard.tags.some(tag => 
                               tag.toLowerCase().includes(selectedDiscipline.toLowerCase())
                             ));
    
    const matchesDifficulty = !selectedDifficulty || flashcard.difficulty === selectedDifficulty;

    return matchesSearch && matchesDiscipline && matchesDifficulty;
  });

  const handleTagsChange = (value) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setNewFlashcard(prev => ({ ...prev, tags }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando flashcards...</p>
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
                to="/admin"
                className="mr-4 p-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gerenciar Flashcards</h1>
                <p className="text-gray-600">{flashcards.length} flashcards no banco</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowNewFlashcardForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Flashcard
              </button>
              <Link
                to="/admin/flashcards/import"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import em Lote
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar por título ou pergunta..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disciplina
              </label>
              <select
                value={selectedDiscipline}
                onChange={(e) => setSelectedDiscipline(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas as disciplinas</option>
                {disciplines.map(discipline => (
                  <option key={discipline} value={discipline}>{discipline}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dificuldade
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas as dificuldades</option>
                <option value="easy">Fácil</option>
                <option value="medium">Médio</option>
                <option value="hard">Difícil</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDiscipline('');
                  setSelectedDifficulty('');
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Modal Novo Flashcard */}
        {showNewFlashcardForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Novo Flashcard</h3>
                <button
                  onClick={() => setShowNewFlashcardForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={newFlashcard.title}
                    onChange={(e) => setNewFlashcard(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Zollinger-Ellison Syndrome - Definition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <input
                    type="text"
                    value={newFlashcard.description}
                    onChange={(e) => setNewFlashcard(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Breve descrição do flashcard"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pergunta *
                  </label>
                  <textarea
                    value={newFlashcard.question}
                    onChange={(e) => setNewFlashcard(prev => ({ ...prev, question: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite a pergunta do flashcard..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resposta *
                  </label>
                  <textarea
                    value={newFlashcard.answer}
                    onChange={(e) => setNewFlashcard(prev => ({ ...prev, answer: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite a resposta do flashcard..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Justificativa
                  </label>
                  <textarea
                    value={newFlashcard.justification}
                    onChange={(e) => setNewFlashcard(prev => ({ ...prev, justification: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Explicação adicional ou justificativa..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dificuldade
                    </label>
                    <select
                      value={newFlashcard.difficulty}
                      onChange={(e) => setNewFlashcard(prev => ({ ...prev, difficulty: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="easy">Fácil</option>
                      <option value="medium">Médio</option>
                      <option value="hard">Difícil</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo
                    </label>
                    <select
                      value={newFlashcard.type}
                      onChange={(e) => setNewFlashcard(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="text">Texto</option>
                      <option value="image">Imagem</option>
                      <option value="concept">Conceito</option>
                      <option value="definition">Definição</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (separadas por vírgula)
                  </label>
                  <input
                    type="text"
                    value={newFlashcard.tags.join(', ')}
                    onChange={(e) => handleTagsChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: gastroenterology, zollinger-ellison, syndrome"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL da Imagem (opcional)
                  </label>
                  <input
                    type="url"
                    value={newFlashcard.image_url}
                    onChange={(e) => setNewFlashcard(prev => ({ ...prev, image_url: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowNewFlashcardForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateFlashcard}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Flashcard
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Flashcards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFlashcards.map((flashcard) => (
            <div key={flashcard.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {flashcard.title}
                    </h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                        flashcard.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                        flashcard.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {flashcard.difficulty}
                      </span>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {flashcard.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setEditingFlashcard(flashcard)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteFlashcard(flashcard.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Pergunta:</p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {flashcard.question}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Resposta:</p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {flashcard.answer}
                    </p>
                  </div>

                  {flashcard.tags && flashcard.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {flashcard.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                      {flashcard.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{flashcard.tags.length - 3}</span>
                      )}
                    </div>
                  )}

                  {flashcard.image_url && (
                    <div className="flex items-center text-sm text-gray-500">
                      <ImageIcon className="w-4 h-4 mr-1" />
                      Contém imagem
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Criado em: {new Date(flashcard.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredFlashcards.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow p-12">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum flashcard encontrado</h3>
              <p className="text-gray-500 mb-4">
                {flashcards.length === 0 
                  ? 'Comece criando seu primeiro flashcard.'
                  : 'Tente ajustar os filtros de busca.'
                }
              </p>
              <button
                onClick={() => setShowNewFlashcardForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center mx-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Flashcard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardManager;

