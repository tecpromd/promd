import React, { useState, useEffect } from 'react';
import { Search, Filter, X, FileText, BookOpen, Hash } from 'lucide-react';
import { useQuestions } from '../hooks/useQuestions';

const BuscaAvancada = () => {
  const { questions, loading } = useQuestions();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('');
  const [searchType, setSearchType] = useState('all'); // all, question, flashcard
  const [filteredResults, setFilteredResults] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const disciplines = [
    'Cardiologia', 'Pneumologia', 'Neurologia', 'Gastroenterologia',
    'Endocrinologia', 'Nefrologia', 'Hematologia', 'Oncologia',
    'Infectologia', 'Reumatologia', 'Dermatologia', 'Oftalmologia'
  ];

  // Simular flashcards para demonstração
  const mockFlashcards = [
    {
      id: 'FC001',
      type: 'flashcard',
      discipline: 'Cardiologia',
      front: 'Qual é a principal causa de insuficiência cardíaca?',
      back: 'Doença arterial coronariana é a principal causa de insuficiência cardíaca, seguida por hipertensão arterial sistêmica.',
      difficulty: 'medium'
    },
    {
      id: 'FC002',
      type: 'flashcard',
      discipline: 'Pneumologia',
      front: 'Quais são os sinais de pneumonia na radiografia?',
      back: 'Consolidação pulmonar, infiltrados alveolares, broncograma aéreo, derrame pleural podem estar presentes.',
      difficulty: 'easy'
    },
    {
      id: 'FC003',
      type: 'flashcard',
      discipline: 'Neurologia',
      front: 'Sintomas clássicos de AVC isquêmico?',
      back: 'Hemiparesia, afasia, alteração do nível de consciência, déficits visuais, dependendo da área afetada.',
      difficulty: 'hard'
    }
  ];

  useEffect(() => {
    performSearch();
  }, [searchTerm, selectedDiscipline, searchType, questions]);

  const performSearch = () => {
    let results = [];

    // Buscar em questões
    if (searchType === 'all' || searchType === 'question') {
      const questionResults = questions.filter(question => {
        const matchesSearch = !searchTerm || 
          question.question_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          question.id?.toString().includes(searchTerm) ||
          question.options?.some(option => 
            option.option_text?.toLowerCase().includes(searchTerm.toLowerCase())
          );

        const matchesDiscipline = !selectedDiscipline || 
          question.discipline?.toLowerCase().includes(selectedDiscipline.toLowerCase());

        return matchesSearch && matchesDiscipline;
      }).map(q => ({ ...q, type: 'question' }));

      results = [...results, ...questionResults];
    }

    // Buscar em flashcards
    if (searchType === 'all' || searchType === 'flashcard') {
      const flashcardResults = mockFlashcards.filter(flashcard => {
        const matchesSearch = !searchTerm || 
          flashcard.front?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          flashcard.back?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          flashcard.id?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDiscipline = !selectedDiscipline || 
          flashcard.discipline?.toLowerCase().includes(selectedDiscipline.toLowerCase());

        return matchesSearch && matchesDiscipline;
      });

      results = [...results, ...flashcardResults];
    }

    setFilteredResults(results);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDiscipline('');
    setSearchType('all');
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'question':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'flashcard':
        return <BookOpen className="w-5 h-5 text-green-500" />;
      default:
        return <Hash className="w-5 h-5 text-slate-500" />;
    }
  };

  const getResultTypeLabel = (type) => {
    switch (type) {
      case 'question':
        return 'Questão';
      case 'flashcard':
        return 'Flashcard';
      default:
        return 'Item';
    }
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-promd-navy dark:text-white mb-2">
            Busca Avançada
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Encontre questões e flashcards por disciplina, ID ou conteúdo
          </p>
        </div>

        {/* Barra de busca */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Campo de busca principal */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por conteúdo, ID da questão ou flashcard..."
                className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-promd-navy"
              />
            </div>

            {/* Filtros rápidos */}
            <div className="flex gap-3">
              <select
                value={selectedDiscipline}
                onChange={(e) => setSelectedDiscipline(e.target.value)}
                className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-promd-navy"
              >
                <option value="">Todas as disciplinas</option>
                {disciplines.map(discipline => (
                  <option key={discipline} value={discipline}>{discipline}</option>
                ))}
              </select>

              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-promd-navy"
              >
                <option value="all">Todos os tipos</option>
                <option value="question">Apenas questões</option>
                <option value="flashcard">Apenas flashcards</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-2"
              >
                <Filter className="w-5 h-5" />
                Filtros
              </button>
            </div>
          </div>

          {/* Filtros expandidos */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Buscar por ID específico
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Q001, FC002"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Dificuldade (Flashcards)
                  </label>
                  <select className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                    <option value="">Todas</option>
                    <option value="easy">Fácil</option>
                    <option value="medium">Médio</option>
                    <option value="hard">Difícil</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Limpar Filtros
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Resultados */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Resultados da Busca
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              {loading ? 'Carregando...' : `${filteredResults.length} resultado(s) encontrado(s)`}
            </p>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-promd-navy"></div>
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  Nenhum resultado encontrado
                </h4>
                <p className="text-slate-600 dark:text-slate-400">
                  Tente ajustar os termos de busca ou filtros
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredResults.map((result, index) => (
                  <div
                    key={`${result.type}-${result.id}-${index}`}
                    className="border border-slate-200 dark:border-slate-600 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {getResultIcon(result.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-full">
                            {getResultTypeLabel(result.type)}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            ID: {result.id}
                          </span>
                          {result.discipline && (
                            <span className="text-xs bg-promd-navy/10 dark:bg-promd-navy/20 text-promd-navy dark:text-promd-sky px-2 py-1 rounded-full">
                              {result.discipline}
                            </span>
                          )}
                          {result.difficulty && (
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              result.difficulty === 'easy' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' :
                              result.difficulty === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300' :
                              'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                            }`}>
                              {result.difficulty === 'easy' ? 'Fácil' : result.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                            </span>
                          )}
                        </div>
                        
                        {result.type === 'question' ? (
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                              Questão Médica
                            </h4>
                            <p className="text-slate-700 dark:text-slate-300 text-sm mb-3">
                              {truncateText(result.question_text)}
                            </p>
                            {result.options && result.options.length > 0 && (
                              <div className="text-xs text-slate-600 dark:text-slate-400">
                                <strong>Alternativas:</strong> {result.options.length} opções
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                              {truncateText(result.front, 100)}
                            </h4>
                            <p className="text-slate-700 dark:text-slate-300 text-sm">
                              {truncateText(result.back)}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        <button className="px-3 py-1 text-xs bg-promd-navy text-white rounded hover:bg-promd-navy/90 transition-colors">
                          Ver Detalhes
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dicas de busca */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
            Dicas de Busca
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
            <div>
              <strong>Busca por ID:</strong> Digite Q001, FC002, etc.
            </div>
            <div>
              <strong>Busca por conteúdo:</strong> Digite palavras-chave do texto
            </div>
            <div>
              <strong>Filtro por disciplina:</strong> Use o dropdown de disciplinas
            </div>
            <div>
              <strong>Tipo de conteúdo:</strong> Filtre por questões ou flashcards
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuscaAvancada;

