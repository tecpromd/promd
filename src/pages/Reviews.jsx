import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpacedRepetition } from '../hooks/useSpacedRepetition';
import { useQuestions } from '../hooks/useQuestions';
import { formatNextReviewDate } from '../data/spacedRepetition';
import { ArrowLeft, CheckCircle, RotateCcw, Calendar, TrendingUp, BarChart3 } from 'lucide-react';

const Reviews = () => {
  const navigate = useNavigate();
  const { 
    getReviewQuestions, 
    getStats, 
    recordAnswer, 
    isLoading: progressLoading 
  } = useSpacedRepetition();
  
  const { questions, loading: questionsLoading } = useQuestions();
  const [reviewQuestions, setReviewQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });
  const [difficulty, setDifficulty] = useState('normal');

  const stats = getStats();
  const isLoading = progressLoading || questionsLoading;

  // Carregar questões para revisão
  useEffect(() => {
    if (!isLoading && questions.length > 0) {
      const reviewList = getReviewQuestions();
      const questionsWithData = reviewList
        .map(review => {
          const questionData = questions.find(q => q.id === review.questionId);
          return questionData ? { ...questionData, reviewData: review } : null;
        })
        .filter(Boolean);
      
      setReviewQuestions(questionsWithData);
    }
  }, [isLoading, questions, getReviewQuestions]);

  const currentQuestion = reviewQuestions[currentQuestionIndex];

  const handleAnswerSelect = (optionIndex) => {
    if (showResult) return;
    setSelectedAnswer(optionIndex);
  };

  const handleConfirmAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = currentQuestion.options[selectedAnswer]?.isCorrect || false;
    setShowResult(true);

    // Registrar resposta no sistema de repetição espaçada
    recordAnswer(currentQuestion.id, isCorrect, difficulty);

    // Atualizar estatísticas da sessão
    setSessionStats(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < reviewQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setDifficulty('normal');
    } else {
      // Fim da sessão de revisão
      alert(`Sessão concluída! Você acertou ${sessionStats.correct + (showResult && currentQuestion.options[selectedAnswer]?.isCorrect ? 1 : 0)} de ${sessionStats.total + 1} questões.`);
    }
  };

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header com navegação */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar ao Dashboard
            </button>
          </div>
          
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (reviewQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header com navegação */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar ao Dashboard
            </button>
          </div>

          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-slate-800 dark:bg-slate-700 rounded-xl">
              <RotateCcw className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Sistema de Revisões
              </h1>
              <p className="text-slate-600 dark:text-slate-300">
                Repetição espaçada baseada no algoritmo SM-2
              </p>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Questões Dominadas</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.mastered}</p>
                </div>
                <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Em Aprendizado</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.learning}</p>
                </div>
                <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Taxa de Acerto</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.averageAccuracy}%</p>
                </div>
                <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Total de Revisões</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalReviews}</p>
                </div>
                <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <Calendar className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Status das revisões */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-slate-600 dark:text-slate-300" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Parabéns! Você está em dia!
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Não há questões programadas para revisão no momento.
              </p>
              <button
                onClick={() => navigate('/questions')}
                className="px-6 py-3 bg-slate-800 dark:bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-900 dark:hover:bg-slate-600 transition-colors"
              >
                Estudar Mais Questões
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header com navegação */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar ao Dashboard
          </button>
        </div>

        {/* Header com estatísticas */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sessão de Revisão</h1>
            <div className="text-sm text-slate-600 dark:text-slate-300">
              Questão {currentQuestionIndex + 1} de {reviewQuestions.length}
            </div>
          </div>
          
          {/* Barra de progresso */}
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-4">
            <div 
              className="bg-slate-800 dark:bg-slate-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / reviewQuestions.length) * 100}%` }}
            ></div>
          </div>

          {/* Estatísticas da sessão */}
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
              <span className="text-slate-600 dark:text-slate-300">Corretas: {sessionStats.correct}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
              <span className="text-slate-600 dark:text-slate-300">Incorretas: {sessionStats.total - sessionStats.correct}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-800 rounded-full"></div>
              <span className="text-slate-600 dark:text-slate-300">Precisão: {sessionStats.total > 0 ? Math.round((sessionStats.correct / sessionStats.total) * 100) : 0}%</span>
            </div>
          </div>
        </div>

        {/* Questão atual */}
        {currentQuestion && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            {/* Informações da revisão */}
            <div className="flex justify-between items-center mb-4 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-4">
                <span className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-2 py-1 rounded-full">
                  Prioridade: {Math.round(currentQuestion.reviewData.priority)}
                </span>
                {currentQuestion.reviewData.lastReviewed && (
                  <span>
                    Última revisão: {new Date(currentQuestion.reviewData.lastReviewed).toLocaleDateString()}
                  </span>
                )}
              </div>
              <div>
                Próxima: {formatNextReviewDate(currentQuestion.reviewData.nextReviewDate)}
              </div>
            </div>

            {/* Texto da questão */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                {currentQuestion.title || `Questão ${currentQuestion.id?.slice(0, 8)}`}
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentQuestion.question}
              </p>
            </div>

            {/* Alternativas */}
            <div className="space-y-3 mb-6">
              {currentQuestion.options?.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = option.isCorrect;
                const showCorrectAnswer = showResult && isCorrect;
                const showIncorrectAnswer = showResult && isSelected && !isCorrect;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      showCorrectAnswer
                        ? 'border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                        : showIncorrectAnswer
                        ? 'border-slate-400 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                        : isSelected
                        ? 'border-slate-800 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                        : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span className="font-medium">{option.optionLetter})</span> {option.optionText}
                  </button>
                );
              })}
            </div>

            {/* Avaliação de dificuldade */}
            {showResult && (
              <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <h4 className="font-medium text-slate-900 dark:text-white mb-3">Como você achou esta questão?</h4>
                <div className="flex gap-2">
                  {[
                    { value: 'very_easy', label: 'Muito Fácil' },
                    { value: 'easy', label: 'Fácil' },
                    { value: 'normal', label: 'Normal' },
                    { value: 'hard', label: 'Difícil' }
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => handleDifficultyChange(value)}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        difficulty === value
                          ? 'bg-slate-800 dark:bg-slate-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Botões de ação */}
            <div className="flex justify-between">
              <div></div>
              {!showResult ? (
                <button
                  onClick={handleConfirmAnswer}
                  disabled={selectedAnswer === null}
                  className="bg-slate-800 dark:bg-slate-700 text-white px-6 py-2 rounded-lg hover:bg-slate-900 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Confirmar Resposta
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="bg-slate-800 dark:bg-slate-700 text-white px-6 py-2 rounded-lg hover:bg-slate-900 dark:hover:bg-slate-600 transition-colors"
                >
                  {currentQuestionIndex < reviewQuestions.length - 1 ? 'Próxima Questão →' : 'Finalizar Sessão'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;

