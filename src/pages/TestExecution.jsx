import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft, ArrowRight, Flag, CheckCircle, XCircle } from 'lucide-react';
import { useQuestions } from '../hooks/useQuestions';
import QuestionImage from '../components/questions/QuestionImage';

const TestExecution = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const config = location.state?.config;
  
  const { questions, loading } = useQuestions();
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Filtrar questões baseado na configuração
  useEffect(() => {
    if (!questions.length || !config) return;

    let filtered = [...questions];

    // Filtrar por disciplinas selecionadas
    if (config.disciplines.length > 0) {
      filtered = filtered.filter(q => 
        config.disciplines.some(disciplineId => {
          // Buscar nome da disciplina pelo ID (simplificado)
          return q.discipline && q.discipline.toLowerCase().includes('cardio') && disciplineId === 1 ||
                 q.discipline && q.discipline.toLowerCase().includes('neuro') && disciplineId === 2 ||
                 q.discipline && q.discipline.toLowerCase().includes('dermato') && disciplineId === 3 ||
                 q.discipline && q.discipline.toLowerCase().includes('farmaco') && disciplineId === 4 ||
                 q.discipline && q.discipline.toLowerCase().includes('embrio') && disciplineId === 31;
        })
      );
    }

    // Filtrar por tipos de questões
    if (config.types.includes('ineditas')) {
      // Para questões inéditas, usar todas (simplificado)
      // Em produção, verificar se usuário já respondeu
    }

    // Limitar número de questões
    filtered = filtered.slice(0, config.questionCount);

    // Se modo personalizado, filtrar por IDs
    if (config.model === 'personalizado' && config.customIds.length > 0) {
      filtered = filtered.filter(q => 
        config.customIds.includes(q.question_number?.toString()) ||
        config.customIds.includes(q.id)
      );
    }

    setFilteredQuestions(filtered);
    console.log('✅ Questões filtradas:', filtered.length, 'de', questions.length);
  }, [questions, config]);

  // Timer para modo cronometrado
  useEffect(() => {
    if (!testStarted || config?.mode !== 'cronometrado') return;

    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [testStarted, config?.mode]);

  // Verificar se deve finalizar automaticamente (modo cronometrado)
  useEffect(() => {
    if (config?.mode === 'cronometrado' && filteredQuestions.length > 0) {
      const maxTime = filteredQuestions.length * 90; // 1.5 min por questão
      if (timeElapsed >= maxTime) {
        finishTest();
      }
    }
  }, [timeElapsed, filteredQuestions.length, config?.mode]);

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  // Responder questão
  const answerQuestion = (optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionIndex
    }));

    // No modo tutor, mostrar feedback imediato
    if (config?.mode === 'tutor') {
      // Implementar feedback visual
    }
  };

  // Navegar entre questões
  const goToQuestion = (index) => {
    if (index >= 0 && index < filteredQuestions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  // Finalizar teste
  const finishTest = () => {
    setShowResults(true);
  };

  // Calcular resultados
  const calculateResults = () => {
    let correct = 0;
    let total = filteredQuestions.length;

    filteredQuestions.forEach(question => {
      const userAnswer = answers[question.id];
      if (userAnswer !== undefined && question.question_options) {
        const correctOption = question.question_options.find(opt => opt.is_correct);
        if (correctOption && userAnswer === question.question_options.indexOf(correctOption)) {
          correct++;
        }
      }
    });

    return { correct, total, percentage: total > 0 ? Math.round((correct / total) * 100) : 0 };
  };

  // Formatar tempo
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Configuração não encontrada</h2>
          <button
            onClick={() => navigate('/test-configuration')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Voltar à Configuração
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando questões...</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const results = calculateResults();
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Teste Finalizado!</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">{results.correct}</div>
                <div className="text-gray-600">Questões Corretas</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-gray-600 mb-2">{results.total}</div>
                <div className="text-gray-600">Total de Questões</div>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">{results.percentage}%</div>
                <div className="text-gray-600">Aproveitamento</div>
              </div>
            </div>

            <div className="mb-8">
              <div className="text-lg text-gray-600 mb-2">Tempo Total: {formatTime(timeElapsed)}</div>
              <div className="text-lg text-gray-600">Modo: {config.mode === 'tutor' ? 'Tutor' : 'Cronometrado'}</div>
            </div>

            <div className="space-x-4">
              <button
                onClick={() => navigate('/test-configuration')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Novo Teste
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Voltar ao Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (filteredQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma questão encontrada</h2>
          <p className="text-gray-600 mb-4">Verifique os filtros selecionados</p>
          <button
            onClick={() => navigate('/test-configuration')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Voltar à Configuração
          </button>
        </div>
      </div>
    );
  }

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pronto para começar?</h2>
          <div className="space-y-2 text-gray-600 mb-6">
            <p>📚 {filteredQuestions.length} questões</p>
            <p>⏱️ {config.mode === 'tutor' ? 'Sem limite de tempo' : `${Math.round(filteredQuestions.length * 1.5)} minutos`}</p>
            <p>🎯 Modo {config.mode === 'tutor' ? 'Tutor' : 'Cronometrado'}</p>
          </div>
          <button
            onClick={() => setTestStarted(true)}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Iniciar Teste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/test-configuration')}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-semibold">
                Questão {currentQuestionIndex + 1} de {filteredQuestions.length}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {config.mode === 'cronometrado' && (
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatTime(timeElapsed)}
                </div>
              )}
              <button
                onClick={finishTest}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
              >
                <Flag className="w-4 h-4 mr-1" />
                Finalizar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Questão */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {currentQuestion?.question_text || 'Questão não encontrada'}
              </h2>
              {currentQuestion?.question_number && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  #{currentQuestion.question_number}
                </span>
              )}
            </div>

            {/* Imagem da questão */}
            {currentQuestion?.question_image_url && (
              <div className="mb-6">
                <QuestionImage 
                  imageUrl={currentQuestion.question_image_url}
                  alt={`Imagem da questão ${currentQuestion.question_number}`}
                />
              </div>
            )}
          </div>

          {/* Opções */}
          <div className="space-y-3 mb-8">
            {currentQuestion?.question_options?.map((option, index) => {
              const isSelected = answers[currentQuestion.id] === index;
              const isCorrect = option.is_correct;
              const showFeedback = config.mode === 'tutor' && isSelected;

              return (
                <button
                  key={index}
                  onClick={() => answerQuestion(index)}
                  className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                    isSelected
                      ? showFeedback
                        ? isCorrect
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                        : 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center mr-3 text-sm font-medium">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option.option_text}</span>
                    {showFeedback && (
                      <div className="ml-auto">
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navegação */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => goToQuestion(currentQuestionIndex - 1)}
              disabled={currentQuestionIndex === 0}
              className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Anterior
            </button>

            <div className="flex space-x-2">
              {filteredQuestions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToQuestion(index)}
                  className={`w-8 h-8 rounded-full text-sm font-medium ${
                    index === currentQuestionIndex
                      ? 'bg-blue-600 text-white'
                      : answers[filteredQuestions[index]?.id] !== undefined
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => goToQuestion(currentQuestionIndex + 1)}
              disabled={currentQuestionIndex === filteredQuestions.length - 1}
              className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próxima
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestExecution;

