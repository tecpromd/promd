import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, BookOpen, Clock, Target, Award } from 'lucide-react';
import ImageZoom from '../ImageZoom';

const EnhancedQuestionViewer = ({ 
  question, 
  onNext, 
  onPrevious, 
  currentIndex, 
  total, 
  onBackToList 
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    setStartTime(Date.now());
    setTimeSpent(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
  }, [question]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const handleAnswerSelect = (optionId) => {
    if (!showExplanation) {
      setSelectedAnswer(optionId);
    }
  };

  const handleConfirmAnswer = () => {
    if (selectedAnswer) {
      setShowExplanation(true);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    if (onNext) onNext();
  };

  const handlePrevious = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    if (onPrevious) onPrevious();
  };

  const getOptionStyle = (option) => {
    const baseStyle = {
      padding: '16px',
      border: '2px solid',
      borderRadius: '12px',
      cursor: showExplanation ? 'default' : 'pointer',
      transition: 'all 0.2s ease',
      marginBottom: '12px',
      fontSize: '16px',
      lineHeight: '1.5'
    };

    if (!showExplanation) {
      return {
        ...baseStyle,
        backgroundColor: selectedAnswer === option.id ? '#dbeafe' : 'white',
        borderColor: selectedAnswer === option.id ? '#3b82f6' : '#e5e7eb',
        color: selectedAnswer === option.id ? '#1e40af' : '#374151',
        transform: selectedAnswer === option.id ? 'scale(1.02)' : 'scale(1)',
        boxShadow: selectedAnswer === option.id ? '0 4px 12px rgba(59, 130, 246, 0.15)' : '0 1px 3px rgba(0, 0, 0, 0.1)'
      };
    }

    if (option.is_correct) {
      return {
        ...baseStyle,
        backgroundColor: '#dcfce7',
        borderColor: '#16a34a',
        color: '#166534',
        boxShadow: '0 4px 12px rgba(22, 163, 74, 0.15)'
      };
    } else if (selectedAnswer === option.id) {
      return {
        ...baseStyle,
        backgroundColor: '#fee2e2',
        borderColor: '#dc2626',
        color: '#991b1b',
        boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)'
      };
    } else {
      return {
        ...baseStyle,
        backgroundColor: '#f9fafb',
        borderColor: '#e5e7eb',
        color: '#6b7280'
      };
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
      case 'fácil':
        return '#10b981';
      case 'medium':
      case 'médio':
        return '#f59e0b';
      case 'hard':
      case 'difícil':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const correctOption = question.options?.find(opt => opt.is_correct);
  const isCorrect = selectedAnswer && correctOption && selectedAnswer === correctOption.id;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBackToList}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X size={20} />
              <span>Voltar à Lista</span>
            </button>
            
            <div className="h-6 w-px bg-gray-300"></div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <BookOpen size={16} />
              <span>Questão {currentIndex + 1} de {total}</span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {/* Timer */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock size={16} />
              <span>{formatTime(timeSpent)}</span>
            </div>

            {/* Difficulty */}
            {question.difficulty && (
              <div className="flex items-center space-x-2 text-sm">
                <Target size={16} style={{ color: getDifficultyColor(question.difficulty) }} />
                <span style={{ color: getDifficultyColor(question.difficulty) }}>
                  {question.difficulty}
                </span>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              
              <button
                onClick={handleNext}
                disabled={currentIndex === total - 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Question Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                {question.title || `Questão ${currentIndex + 1}`}
              </h1>
              
              {showExplanation && (
                <div className="flex items-center space-x-2">
                  <Award 
                    size={20} 
                    className={isCorrect ? 'text-green-600' : 'text-red-600'} 
                  />
                  <span className={`text-sm font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {isCorrect ? 'Correto!' : 'Incorreto'}
                  </span>
                </div>
              )}
            </div>

            {/* Question Text */}
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-800 leading-relaxed">
                {question.question}
              </p>
            </div>

            {/* Question Image */}
            {question.question_image_url && (
              <div className="mt-6">
                <ImageZoom
                  src={question.question_image_url}
                  alt="Imagem da questão"
                  className="max-w-full h-auto rounded-lg border border-gray-200"
                />
              </div>
            )}
          </div>

          {/* Options */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Alternativas:
            </h3>
            
            <div className="space-y-3">
              {question.options?.map((option, index) => (
                <div
                  key={option.id}
                  onClick={() => handleAnswerSelect(option.id)}
                  style={getOptionStyle(option)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-current bg-opacity-10 flex items-center justify-center text-sm font-semibold">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <div className="flex-1">
                      {option.option_text}
                    </div>
                    {showExplanation && option.is_correct && (
                      <div className="flex-shrink-0">
                        <Award size={20} className="text-green-600" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Button */}
            {!showExplanation ? (
              <button
                onClick={handleConfirmAnswer}
                disabled={!selectedAnswer}
                className="mt-6 w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {selectedAnswer ? 'Confirmar Resposta' : 'Selecione uma alternativa'}
              </button>
            ) : (
              <div className="mt-6 space-y-4">
                {/* Explanation */}
                {question.explanation && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Explicação:</h4>
                    <p className="text-blue-800 leading-relaxed">
                      {question.explanation}
                    </p>
                  </div>
                )}

                {/* Next Button */}
                <button
                  onClick={handleNext}
                  disabled={currentIndex === total - 1}
                  className="w-full py-3 px-6 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {currentIndex === total - 1 ? 'Finalizar' : 'Próxima Questão'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedQuestionViewer;

