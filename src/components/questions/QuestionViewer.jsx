import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  EyeOff, 
  Clock, 
  BookOpen,
  FileText,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

const QuestionViewer = ({ 
  question, 
  onAnswer, 
  onNext, 
  onPrevious, 
  showExplanation = false,
  selectedAnswer = null,
  isAnswered = false,
  showNavigation = true,
  questionNumber = null,
  totalQuestions = null,
  timeRemaining = null,
  mode = 'study' // 'study', 'exam', 'review'
}) => {
  const [showWrongExplanations, setShowWrongExplanations] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState(selectedAnswer);

  const getDisciplineName = (disciplineId) => {
    const disciplinas = {
      '1': 'Cardiologia',
      '2': 'Pneumologia', 
      '3': 'Neurologia',
      '4': 'Gastroenterologia',
      '5': 'Endocrinologia',
      '6': 'Infectologia',
      '7': 'Nefrologia',
      '8': 'Hematologia',
      '9': 'Reumatologia',
      '10': 'Dermatologia',
      '11': 'Psiquiatria',
      '12': 'Oftalmologia',
      '13': 'Otorrinolaringologia',
      '14': 'Urologia',
      '15': 'Ginecologia'
    };
    return disciplinas[disciplineId] || 'Medicina Geral';
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermediário': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Difícil': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Muito Difícil': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAnswerChange = (alternativeId) => {
    setCurrentAnswer(alternativeId);
    if (onAnswer && mode !== 'exam') {
      // Em modo estudo, resposta é processada imediatamente
      onAnswer(alternativeId);
    }
  };

  const handleSubmitAnswer = () => {
    if (currentAnswer && onAnswer) {
      onAnswer(currentAnswer);
    }
  };

  const correctAnswer = question.alternatives.find(alt => alt.isCorrect);
  const isCorrect = currentAnswer === correctAnswer?.id;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header da Questão */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {questionNumber && totalQuestions && (
            <Badge variant="outline" className="text-lg px-3 py-1">
              {questionNumber} / {totalQuestions}
            </Badge>
          )}
          <div>
            <h2 className="text-xl font-bold text-gray-900">{question.title}</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>{getDisciplineName(question.discipline_id)}</span>
              <span>•</span>
              <Badge className={getDifficultyColor(question.difficulty)} variant="outline">
                {question.difficulty}
              </Badge>
              {question.source && (
                <>
                  <span>•</span>
                  <span>{question.source}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Timer (modo prova) */}
        {timeRemaining !== null && mode === 'exam' && (
          <div className="flex items-center space-x-2 text-lg font-mono">
            <Clock className="w-5 h-5 text-orange-600" />
            <span className={timeRemaining < 300 ? 'text-red-600' : 'text-gray-700'}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        )}
      </div>

      {/* Questão Principal */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>Enunciado</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enunciado */}
          <div className="prose max-w-none">
            <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
              {question.statement}
            </p>
          </div>

          {/* Imagens e Arquivos */}
          {question.files && question.files.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">Materiais de Apoio:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.files.map((file, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    {file.type.startsWith('image/') ? (
                      <img 
                        src={file.url} 
                        alt={file.name}
                        className="w-full h-auto max-h-96 object-contain bg-gray-50"
                      />
                    ) : file.type === 'application/pdf' ? (
                      <div className="p-4 bg-red-50 border border-red-200 rounded flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-red-600" />
                        <div>
                          <p className="font-medium text-red-800">{file.name}</p>
                          <p className="text-sm text-red-600">Arquivo PDF</p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alternativas */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Alternativas:</h4>
            <RadioGroup 
              value={currentAnswer} 
              onValueChange={handleAnswerChange}
              disabled={isAnswered && mode !== 'review'}
            >
              {question.alternatives.map((alternative, index) => {
                const isSelected = currentAnswer === alternative.id;
                const isCorrectAlt = alternative.isCorrect;
                
                // Cores baseadas no estado
                let borderColor = 'border-gray-200';
                let bgColor = 'bg-white';
                
                if (showExplanation) {
                  if (isCorrectAlt) {
                    borderColor = 'border-green-500';
                    bgColor = 'bg-green-50';
                  } else if (isSelected && !isCorrectAlt) {
                    borderColor = 'border-red-500';
                    bgColor = 'bg-red-50';
                  }
                } else if (isSelected) {
                  borderColor = 'border-blue-500';
                  bgColor = 'bg-blue-50';
                }

                return (
                  <div 
                    key={alternative.id}
                    className={`p-4 border-2 rounded-lg transition-all ${borderColor} ${bgColor} hover:shadow-sm`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge 
                          variant={isSelected ? "default" : "secondary"}
                          className="min-w-[28px] h-7 flex items-center justify-center"
                        >
                          {alternative.id}
                        </Badge>
                        
                        {showExplanation && (
                          <div className="flex items-center">
                            {isCorrectAlt ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : isSelected ? (
                              <XCircle className="w-5 h-5 text-red-600" />
                            ) : null}
                          </div>
                        )}
                      </div>
                      
                      <Label 
                        htmlFor={alternative.id}
                        className="flex-1 cursor-pointer text-gray-900 leading-relaxed"
                      >
                        <RadioGroupItem 
                          value={alternative.id} 
                          id={alternative.id}
                          className="sr-only"
                        />
                        {alternative.text}
                      </Label>
                    </div>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          {/* Botão para submeter resposta (modo prova) */}
          {mode === 'exam' && currentAnswer && !isAnswered && (
            <div className="flex justify-center pt-4">
              <Button 
                onClick={handleSubmitAnswer}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Confirmar Resposta
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Explicações (aparecem após responder) */}
      {showExplanation && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Explicação</span>
              {isAnswered && (
                <Badge className={isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {isCorrect ? 'Correto' : 'Incorreto'}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Resposta Correta */}
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Resposta Correta:</h4>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Badge className="bg-green-600 text-white">
                    {correctAnswer?.id}
                  </Badge>
                  <p className="text-green-900 font-medium">
                    {correctAnswer?.text}
                  </p>
                </div>
              </div>
            </div>

            {/* Explicação da Resposta Correta */}
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Por que está correta:</h4>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-900 whitespace-pre-wrap leading-relaxed">
                  {question.explanation}
                </p>
              </div>
            </div>

            {/* Explicação das Alternativas Erradas */}
            {question.wrongAnswersExplanation && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-700">Por que as outras estão erradas:</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowWrongExplanations(!showWrongExplanations)}
                    className="text-orange-600 border-orange-200 hover:bg-orange-50"
                  >
                    {showWrongExplanations ? (
                      <>
                        <EyeOff className="w-4 h-4 mr-2" />
                        Ocultar
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-2" />
                        Mostrar
                      </>
                    )}
                  </Button>
                </div>
                
                {showWrongExplanations && (
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-orange-900 whitespace-pre-wrap leading-relaxed">
                      {question.wrongAnswersExplanation}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navegação */}
      {showNavigation && (
        <div className="flex justify-between items-center pt-6 border-t">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={!onPrevious}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Anterior</span>
          </Button>

          <div className="text-center">
            {mode === 'study' && !showExplanation && currentAnswer && (
              <Button
                variant="ghost"
                onClick={() => handleSubmitAnswer()}
                className="text-blue-600 hover:text-blue-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                Ver Explicação
              </Button>
            )}
          </div>

          <Button
            variant="outline"
            onClick={onNext}
            disabled={!onNext}
            className="flex items-center space-x-2"
          >
            <span>Próxima</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuestionViewer;

