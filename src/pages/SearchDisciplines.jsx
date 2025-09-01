import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, BookOpen, ArrowLeft, Grid3X3, List } from 'lucide-react';
import { useQuestions } from '../hooks/useQuestions';
import { supabase } from '../lib/supabase';

const SearchDisciplines = () => {
  const navigate = useNavigate();
  const { questions, loading } = useQuestions();
  const [disciplines, setDisciplines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('');
  const [questionNumber, setQuestionNumber] = useState('');
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [loadingDisciplines, setLoadingDisciplines] = useState(true);

  // Carregar disciplinas do Supabase
  useEffect(() => {
    const fetchDisciplines = async () => {
      try {
        const { data, error } = await supabase
          .from('disciplines')
          .select('*')
          .order('name');
        
        if (error) throw error;
        setDisciplines(data || []);
      } catch (error) {
        console.error('Erro ao carregar disciplinas:', error);
      } finally {
        setLoadingDisciplines(false);
      }
    };

    fetchDisciplines();
  }, []);

  // Filtrar questões baseado nos critérios de busca
  useEffect(() => {
    if (!questions.length) return;

    let filtered = questions;

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por disciplina
    if (selectedDiscipline) {
      filtered = filtered.filter(q => 
        q.discipline?.toLowerCase().includes(selectedDiscipline.toLowerCase()) ||
        q.category?.toLowerCase().includes(selectedDiscipline.toLowerCase())
      );
    }

    // Filtro por número da questão
    if (questionNumber) {
      filtered = filtered.filter(q => 
        q.id?.includes(questionNumber) ||
        q.questionNumber?.toString().includes(questionNumber)
      );
    }

    setFilteredQuestions(filtered);
  }, [questions, searchTerm, selectedDiscipline, questionNumber]);

  const handleQuestionClick = (questionId) => {
    navigate(`/questions?id=${questionId}`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDiscipline('');
    setQuestionNumber('');
  };

  if (loading || loadingDisciplines) {
    return (
      <div className="min-h-screen bg-promd-gray-50 dark:bg-promd-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-promd-gray-200 dark:bg-promd-gray-700 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-promd-gray-200 dark:bg-promd-gray-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-promd-gray-50 dark:bg-promd-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header com navegação */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 text-promd-gray-600 dark:text-promd-gray-300 hover:text-promd-navy dark:hover:text-promd-sky transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar ao Dashboard
          </button>
        </div>

        {/* Título */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 promd-bg-gradient rounded-xl">
            <Search className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold promd-text-primary dark:text-white">
              Buscar por Disciplinas
            </h1>
            <p className="text-promd-gray-600 dark:text-promd-gray-300">
              Encontre questões específicas por disciplina, número ou conteúdo
            </p>
          </div>
        </div>

        {/* Filtros de Busca */}
        <div className="promd-card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Busca por texto */}
            <div>
              <label className="block text-sm font-medium promd-text-primary dark:text-white mb-2">
                Buscar por conteúdo
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-promd-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Digite palavras-chave..."
                  className="w-full pl-10 pr-4 py-2 border border-promd-gray-300 rounded-lg focus:ring-2 focus:ring-promd-sky focus:border-promd-sky dark:bg-promd-gray-800 dark:border-promd-gray-600 dark:text-white"
                />
              </div>
            </div>

            {/* Filtro por disciplina */}
            <div>
              <label className="block text-sm font-medium promd-text-primary dark:text-white mb-2">
                Disciplina
              </label>
              <select
                value={selectedDiscipline}
                onChange={(e) => setSelectedDiscipline(e.target.value)}
                className="w-full px-4 py-2 border border-promd-gray-300 rounded-lg focus:ring-2 focus:ring-promd-sky focus:border-promd-sky dark:bg-promd-gray-800 dark:border-promd-gray-600 dark:text-white"
              >
                <option value="">Todas as disciplinas</option>
                {disciplines.map((discipline) => (
                  <option key={discipline.id} value={discipline.name}>
                    {discipline.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Busca por número */}
            <div>
              <label className="block text-sm font-medium promd-text-primary dark:text-white mb-2">
                Número da questão
              </label>
              <input
                type="text"
                value={questionNumber}
                onChange={(e) => setQuestionNumber(e.target.value)}
                placeholder="Ex: 150001, 160002..."
                className="w-full px-4 py-2 border border-promd-gray-300 rounded-lg focus:ring-2 focus:ring-promd-sky focus:border-promd-sky dark:bg-promd-gray-800 dark:border-promd-gray-600 dark:text-white"
              />
            </div>
          </div>

          {/* Controles */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-sm text-promd-gray-600 dark:text-promd-gray-300">
                {filteredQuestions.length} questões encontradas
              </span>
              {(searchTerm || selectedDiscipline || questionNumber) && (
                <button
                  onClick={clearFilters}
                  className="text-sm promd-text-red hover:underline"
                >
                  Limpar filtros
                </button>
              )}
            </div>

            {/* Modo de visualização */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'promd-bg-primary text-white' 
                    : 'text-promd-gray-600 hover:bg-promd-gray-100 dark:text-promd-gray-300 dark:hover:bg-promd-gray-700'
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'promd-bg-primary text-white' 
                    : 'text-promd-gray-600 hover:bg-promd-gray-100 dark:text-promd-gray-300 dark:hover:bg-promd-gray-700'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Resultados */}
        {filteredQuestions.length === 0 ? (
          <div className="promd-card p-8 text-center">
            <BookOpen className="w-16 h-16 text-promd-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold promd-text-primary dark:text-white mb-2">
              Nenhuma questão encontrada
            </h3>
            <p className="text-promd-gray-600 dark:text-promd-gray-300">
              Tente ajustar os filtros de busca ou limpar os critérios
            </p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }>
            {filteredQuestions.map((question) => (
              <div
                key={question.id}
                onClick={() => handleQuestionClick(question.id)}
                className="promd-card p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-promd-sky"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-medium promd-text-sky bg-promd-sky/10 px-2 py-1 rounded-full">
                    {question.discipline || 'Medicina Geral'}
                  </span>
                  <span className="text-xs text-promd-gray-500">
                    ID: {question.id?.slice(0, 8)}
                  </span>
                </div>
                
                <h3 className="font-semibold promd-text-primary dark:text-white mb-2 line-clamp-2">
                  {question.title || `Questão ${question.id?.slice(0, 8)}`}
                </h3>
                
                <p className="text-sm text-promd-gray-600 dark:text-promd-gray-300 line-clamp-3 mb-4">
                  {question.question}
                </p>
                
                <div className="flex justify-between items-center text-xs text-promd-gray-500">
                  <span>{question.difficulty || 'Médio'}</span>
                  <span>{question.options?.length || 0} alternativas</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchDisciplines;

