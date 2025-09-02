import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Upload,
  Download,
  ArrowLeft,
  Save,
  X
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const QuestionManager = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [showNewQuestionForm, setShowNewQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Form state para nova questão
  const [newQuestion, setNewQuestion] = useState({
    question_number: '',
    question_text: '',
    explanation: '',
    difficulty: 'medium',
    question_type: 'multiple_choice',
    tags: [],
    question_image_url: ''
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
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Erro ao buscar questões:', error);
      alert('Erro ao carregar questões');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async () => {
    try {
      // Validações
      if (!newQuestion.question_text.trim()) {
        alert('Texto da questão é obrigatório');
        return;
      }

      if (!newQuestion.question_number) {
        alert('Número da questão é obrigatório');
        return;
      }

      // Verificar se o número já existe
      const { data: existingQuestion } = await supabase
        .from('questions')
        .select('id')
        .eq('question_number', newQuestion.question_number)
        .single();

      if (existingQuestion) {
        alert('Já existe uma questão com este número');
        return;
      }

      const { data, error } = await supabase
        .from('questions')
        .insert([{
          ...newQuestion,
          question_number: parseInt(newQuestion.question_number),
          tags: newQuestion.tags.length > 0 ? newQuestion.tags : null,
          is_active: true
        }])
        .select()
        .single();

      if (error) throw error;

      setQuestions(prev => [data, ...prev]);
      setNewQuestion({
        question_number: '',
        question_text: '',
        explanation: '',
        difficulty: 'medium',
        question_type: 'multiple_choice',
        tags: [],
        question_image_url: ''
      });
      setShowNewQuestionForm(false);
      alert('Questão criada com sucesso!');
    } catch (error) {
      console.error('Erro ao criar questão:', error);
      alert('Erro ao criar questão: ' + error.message);
    }
  };

  const handleUpdateQuestion = async (questionId, updates) => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .update(updates)
        .eq('id', questionId)
        .select()
        .single();

      if (error) throw error;

      setQuestions(prev => 
        prev.map(q => q.id === questionId ? data : q)
      );
      setEditingQuestion(null);
      alert('Questão atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar questão:', error);
      alert('Erro ao atualizar questão');
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!confirm('Tem certeza que deseja excluir esta questão?')) return;

    try {
      const { error } = await supabase
        .from('questions')
        .update({ is_active: false })
        .eq('id', questionId);

      if (error) throw error;

      setQuestions(prev => prev.filter(q => q.id !== questionId));
      alert('Questão excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir questão:', error);
      alert('Erro ao excluir questão');
    }
  };

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.question_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.question_number.toString().includes(searchTerm);
    
    const matchesDiscipline = !selectedDiscipline || 
                             (question.tags && question.tags.some(tag => 
                               tag.toLowerCase().includes(selectedDiscipline.toLowerCase())
                             ));
    
    const matchesDifficulty = !selectedDifficulty || question.difficulty === selectedDifficulty;

    return matchesSearch && matchesDiscipline && matchesDifficulty;
  });

  const handleTagsChange = (value) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setNewQuestion(prev => ({ ...prev, tags }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando questões...</p>
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
                <h1 className="text-2xl font-bold text-gray-900">Gerenciar Questões</h1>
                <p className="text-gray-600">{questions.length} questões no banco</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowNewQuestionForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Questão
              </button>
              <Link
                to="/admin/questions/import"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
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
                  placeholder="Buscar por texto ou número..."
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

        {/* Modal Nova Questão */}
        {showNewQuestionForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Nova Questão</h3>
                <button
                  onClick={() => setShowNewQuestionForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número da Questão *
                  </label>
                  <input
                    type="number"
                    value={newQuestion.question_number}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, question_number: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: 100001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Texto da Questão *
                  </label>
                  <textarea
                    value={newQuestion.question_text}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, question_text: e.target.value }))}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite o texto completo da questão com as alternativas..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Explicação
                  </label>
                  <textarea
                    value={newQuestion.explanation}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, explanation: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Explicação da resposta correta..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dificuldade
                    </label>
                    <select
                      value={newQuestion.difficulty}
                      onChange={(e) => setNewQuestion(prev => ({ ...prev, difficulty: e.target.value }))}
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
                      value={newQuestion.question_type}
                      onChange={(e) => setNewQuestion(prev => ({ ...prev, question_type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="multiple_choice">Múltipla Escolha</option>
                      <option value="true_false">Verdadeiro/Falso</option>
                      <option value="essay">Dissertativa</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (separadas por vírgula)
                  </label>
                  <input
                    type="text"
                    value={newQuestion.tags.join(', ')}
                    onChange={(e) => handleTagsChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: gastroenterology, zollinger-ellison, diagnosis"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL da Imagem (opcional)
                  </label>
                  <input
                    type="url"
                    value={newQuestion.question_image_url}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, question_image_url: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowNewQuestionForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateQuestion}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Questão
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Questões */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Questões ({filteredQuestions.length})
            </h3>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredQuestions.map((question) => (
              <div key={question.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        #{question.question_number}
                      </span>
                      <span className={`ml-2 text-xs font-medium px-2.5 py-0.5 rounded ${
                        question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                        question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {question.difficulty}
                      </span>
                      {question.tags && question.tags.length > 0 && (
                        <div className="ml-2 flex flex-wrap gap-1">
                          {question.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                          {question.tags.length > 3 && (
                            <span className="text-xs text-gray-500">+{question.tags.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-900 mb-2 line-clamp-3">
                      {question.question_text.substring(0, 200)}...
                    </p>
                    
                    <p className="text-sm text-gray-500">
                      Criado em: {new Date(question.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => setEditingQuestion(question)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredQuestions.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma questão encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">
                {questions.length === 0 
                  ? 'Comece criando sua primeira questão.'
                  : 'Tente ajustar os filtros de busca.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionManager;

