import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Clock, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const SimuladoAvancado = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(90 * 60); // 90 minutos
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  // Questões simuladas com IDs numéricos
  const simuladoQuestions = [
    {
      id: '090001',
      discipline: 'Cardiologia',
      text: 'Homem de 52 anos apresenta fadiga e dispneia aos esforços há 3 meses. Exame físico revela edema bilateral de membros inferiores, hepatomegalia e S2 proeminente. Qual a causa mais provável da dispneia?',
      options: [
        { letter: 'A', text: 'Fibrose pulmonar' },
        { letter: 'B', text: 'Hipertensão pulmonar' },
        { letter: 'C', text: 'Insuficiência cardíaca congestiva' },
        { letter: 'D', text: 'Embolia pulmonar' },
        { letter: 'E', text: 'Pneumonia' }
      ],
      correctAnswer: 'C'
    },
    {
      id: '100001',
      discipline: 'Pneumologia',
      text: 'Paciente de 45 anos com tosse seca persistente e dispneia progressiva. Radiografia de tórax mostra infiltrado reticular bilateral. Qual o diagnóstico mais provável?',
      options: [
        { letter: 'A', text: 'Pneumonia atípica' },
        { letter: 'B', text: 'Fibrose pulmonar idiopática' },
        { letter: 'C', text: 'Sarcoidose' },
        { letter: 'D', text: 'Tuberculose miliar' },
        { letter: 'E', text: 'Pneumoconiose' }
      ],
      correctAnswer: 'B'
    },
    {
      id: '110001',
      discipline: 'Neurologia',
      text: 'Mulher de 35 anos apresenta cefaleia súbita e intensa, descrita como "a pior dor de cabeça da vida". Qual a primeira hipótese diagnóstica?',
      options: [
        { letter: 'A', text: 'Enxaqueca' },
        { letter: 'B', text: 'Cefaleia tensional' },
        { letter: 'C', text: 'Hemorragia subaracnóidea' },
        { letter: 'D', text: 'Meningite' },
        { letter: 'E', text: 'Tumor cerebral' }
      ],
      correctAnswer: 'C'
    }
  ];

  useEffect(() => {
    let interval = null;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsActive(false);
      setShowResults(true);
    }
    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < simuladoQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const finishExam = () => {
    setIsActive(false);
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    simuladoQuestions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: simuladoQuestions.length,
      percentage: Math.round((correct / simuladoQuestions.length) * 100)
    };
  };

  if (showResults) {
    const score = calculateScore();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header de Resultados */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 mb-6">
            <div className="text-center mb-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Simulado USMLE Finalizado!
              </h1>
              <div className="text-4xl md:text-6xl font-bold text-promd-navy dark:text-promd-sky mb-4">
                {score.percentage}%
              </div>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-6">
                Você acertou {score.correct} de {score.total} questões
              </p>
            </div>

            {/* Estatísticas Detalhadas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-8">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {score.correct}
                </div>
                <div className="text-green-700 dark:text-green-300">Acertos</div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {score.total - score.correct}
                </div>
                <div className="text-red-700 dark:text-red-300">Erros</div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatTime(90 * 60 - timeRemaining)}
                </div>
                <div className="text-blue-700 dark:text-blue-300">Tempo Usado</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {Math.round(((90 * 60 - timeRemaining) / 60) / simuladoQuestions.length * 10) / 10}
                </div>
                <div className="text-purple-700 dark:text-purple-300">Min/Questão</div>
              </div>
            </div>

            {/* Performance por Disciplina */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Performance por Disciplina
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Cardiologia', 'Pneumologia', 'Neurologia'].map((discipline, index) => {
                  const disciplineQuestions = simuladoQuestions.filter(q => q.discipline === discipline);
                  const disciplineCorrect = disciplineQuestions.filter((q, qIndex) => 
                    answers[simuladoQuestions.findIndex(sq => sq.id === q.id)] === q.correctAnswer
                  ).length;
                  const disciplinePercentage = disciplineQuestions.length > 0 
                    ? Math.round((disciplineCorrect / disciplineQuestions.length) * 100) 
                    : 0;
                  
                  return (
                    <div key={discipline} className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-slate-900 dark:text-white">{discipline}</span>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {disciplineCorrect}/{disciplineQuestions.length}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mb-2">
                        <div 
                          className={`h-2 rounded-full ${
                            disciplinePercentage >= 70 ? 'bg-green-500' :
                            disciplinePercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${disciplinePercentage}%` }}
                        ></div>
                      </div>
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {disciplinePercentage}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recomendações de Estudo */}
            <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                📚 Recomendações de Estudo
              </h3>
              <div className="text-blue-800 dark:text-blue-200">
                {score.percentage >= 80 ? (
                  <p>🎉 Excelente performance! Continue praticando para manter o nível. Foque em revisar os erros para aperfeiçoamento.</p>
                ) : score.percentage >= 60 ? (
                  <p>👍 Boa performance! Revise as questões erradas e pratique mais nas disciplinas com menor pontuação.</p>
                ) : (
                  <p>📖 Recomendamos mais estudo. Foque nas disciplinas com menor pontuação e pratique mais questões similares.</p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-promd-navy text-white px-6 md:px-8 py-3 rounded-lg hover:bg-promd-navy/90 transition-colors"
              >
                Fazer Novo Simulado
              </button>
              <Link
                to="/"
                className="bg-slate-600 text-white px-6 md:px-8 py-3 rounded-lg hover:bg-slate-700 transition-colors text-center"
              >
                Voltar ao Dashboard
              </Link>
            </div>
          </div>

          {/* Revisão Detalhada das Questões */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              📋 Revisão Detalhada das Questões
            </h2>
            
            <div className="space-y-6">
              {simuladoQuestions.map((question, index) => {
                const userAnswer = answers[index];
                const isCorrect = userAnswer === question.correctAnswer;
                const correctOption = question.options.find(opt => opt.letter === question.correctAnswer);
                const userOption = question.options.find(opt => opt.letter === userAnswer);
                
                return (
                  <div key={question.id} className="border border-slate-200 dark:border-slate-600 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        isCorrect ? 'bg-green-500' : userAnswer ? 'bg-red-500' : 'bg-gray-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded">
                            {question.discipline}
                          </span>
                          <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded">
                            ID: {question.id}
                          </span>
                          {isCorrect ? (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">✓ Correto</span>
                          ) : userAnswer ? (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">✗ Incorreto</span>
                          ) : (
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">- Não respondida</span>
                          )}
                        </div>
                        <p className="text-slate-900 dark:text-white font-medium mb-3">
                          {question.text}
                        </p>
                        
                        <div className="space-y-2">
                          {userAnswer && (
                            <div className={`p-3 rounded-lg ${
                              isCorrect ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                                        : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                            }`}>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm">Sua resposta:</span>
                                <span className={`font-bold ${isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                                  {userAnswer}) {userOption?.text}
                                </span>
                              </div>
                            </div>
                          )}
                          
                          {!isCorrect && (
                            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm">Resposta correta:</span>
                                <span className="font-bold text-green-700 dark:text-green-300">
                                  {question.correctAnswer}) {correctOption?.text}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header responsivo */}
      <div className="bg-white dark:bg-slate-800 shadow-lg border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <Link 
                to="/"
                className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-promd-navy dark:hover:text-promd-sky transition-colors"
              >
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-promd-navy dark:text-white">
                  Simulado USMLE
                </h1>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
                  Questão {currentQuestion + 1} de {simuladoQuestions.length}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 px-3 py-2 rounded-lg">
                <Clock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="font-mono text-sm md:text-lg text-slate-900 dark:text-white">
                  {formatTime(timeRemaining)}
                </span>
              </div>
              
              <button
                onClick={() => setIsActive(!isActive)}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${
                  isActive 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span className="hidden sm:inline">{isActive ? 'Pausar' : 'Iniciar'}</span>
              </button>
              
              <button
                onClick={finishExam}
                className="bg-promd-navy text-white px-3 md:px-4 py-2 rounded-lg hover:bg-promd-navy/90 transition-colors text-sm md:text-base"
              >
                Finalizar
              </button>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3 md:mt-4">
            <div className="flex justify-between text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-2">
              <span>Progresso do Simulado</span>
              <span>{Math.round(((currentQuestion + 1) / simuladoQuestions.length) * 100)}% completo</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div 
                className="bg-promd-navy h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / simuladoQuestions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal responsivo */}
      <div className="max-w-4xl mx-auto p-4 pb-24">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 md:p-8 mb-6">
          {/* Questão atual */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs md:text-sm bg-promd-navy/10 dark:bg-promd-navy/20 text-promd-navy dark:text-promd-sky px-3 py-1 rounded-full font-medium">
                {simuladoQuestions[currentQuestion].discipline}
              </span>
              <span className="text-xs md:text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full">
                ID: {simuladoQuestions[currentQuestion].id}
              </span>
            </div>
            
            <h2 className="text-base md:text-lg font-semibold text-slate-900 dark:text-white mb-4 md:mb-6 leading-relaxed">
              {simuladoQuestions[currentQuestion].text}
            </h2>
          </div>

          {/* Alternativas responsivas */}
          <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
            <h3 className="text-base md:text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Alternativas:
            </h3>
            {simuladoQuestions[currentQuestion].options.map((option) => (
              <button
                key={option.letter}
                onClick={() => handleAnswerSelect(currentQuestion, option.letter)}
                className={`w-full text-left p-3 md:p-4 rounded-lg border-2 transition-all ${
                  answers[currentQuestion] === option.letter
                    ? 'border-promd-navy bg-promd-navy/5 dark:bg-promd-navy/10'
                    : 'border-slate-200 dark:border-slate-600 hover:border-promd-sky hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {option.letter})
                  </span>
                  <span className="text-slate-900 dark:text-white flex-1 leading-relaxed text-sm md:text-base">
                    {option.text}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Mapa de questões responsivo */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Mapa de Questões
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-10 gap-2">
            {simuladoQuestions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 md:w-10 md:h-10 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                  index === currentQuestion
                    ? 'bg-promd-navy text-white'
                    : answers[index]
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-500'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-4 text-xs md:text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 md:w-4 md:h-4 bg-promd-navy rounded"></div>
              <span>Atual</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded"></div>
              <span>Respondida</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 md:w-4 md:h-4 bg-slate-300 dark:bg-slate-600 rounded"></div>
              <span>Não respondida</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navegação fixa responsiva */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-3 md:p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
          >
            <SkipBack className="w-4 h-4" />
            <span className="hidden sm:inline">Anterior</span>
          </button>
          
          <div className="text-center">
            <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-1">
              {currentQuestion + 1} de {simuladoQuestions.length}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-500">
              {Object.keys(answers).length} respondidas
            </div>
          </div>
          
          <button
            onClick={nextQuestion}
            disabled={currentQuestion === simuladoQuestions.length - 1}
            className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-promd-navy text-white rounded-lg hover:bg-promd-navy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
          >
            <span className="hidden sm:inline">Próxima</span>
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimuladoAvancado;

