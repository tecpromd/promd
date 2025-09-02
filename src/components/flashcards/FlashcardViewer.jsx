import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { RotateCcw, Eye, EyeOff, CheckCircle, XCircle, BookOpen } from 'lucide-react';

const FlashcardViewer = ({ flashcard, onNext, onPrevious, onMarkAnswer, showNavigation = true }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showExplanations, setShowExplanations] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      setShowExplanations(false);
    }
  };

  const handleMarkAnswer = (isCorrect) => {
    if (onMarkAnswer) {
      onMarkAnswer(isCorrect);
    }
    // Reset para próximo flashcard
    setTimeout(() => {
      setIsFlipped(false);
      setShowExplanations(false);
    }, 1000);
  };

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

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header do Flashcard */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{flashcard.title}</h2>
          <p className="text-sm text-gray-600">{getDisciplineName(flashcard.discipline_id)}</p>
        </div>
        <Badge className={getDifficultyColor(flashcard.difficulty)}>
          {flashcard.difficulty}
        </Badge>
      </div>

      {/* Carta do Flashcard */}
      <div className="relative perspective-1000 mb-8">
        <div 
          className={`relative w-full h-96 transition-transform duration-700 transform-style-preserve-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Frente da Carta - Pergunta */}
          <Card 
            className={`absolute inset-0 w-full h-full backface-hidden cursor-pointer hover:shadow-lg transition-shadow ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            onClick={handleFlip}
            style={{ backfaceVisibility: 'hidden' }}
          >
            <CardContent className="p-8 h-full flex flex-col justify-center">
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Pergunta:</h3>
                  <p className="text-lg text-gray-900 leading-relaxed">
                    {flashcard.question}
                  </p>
                </div>

                {/* Imagens se existirem */}
                {flashcard.files && flashcard.files.length > 0 && (
                  <div className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {flashcard.files.map((file, index) => (
                        file.type.startsWith('image/') && (
                          <img 
                            key={index}
                            src={file.url} 
                            alt={file.name}
                            className="max-w-full h-auto rounded-lg border shadow-sm"
                          />
                        )
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-center text-sm text-gray-500 mt-6">
                  <Eye className="w-4 h-4 mr-2" />
                  Clique para ver a resposta
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verso da Carta - Resposta */}
          <Card 
            className={`absolute inset-0 w-full h-full backface-hidden cursor-pointer hover:shadow-lg transition-shadow rotate-y-180 ${
              !isFlipped ? 'rotate-y-180' : ''
            }`}
            onClick={handleFlip}
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <CardContent className="p-8 h-full flex flex-col justify-center">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Resposta Correta:</h3>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-lg text-green-900 font-medium">
                      {flashcard.answer}
                    </p>
                  </div>
                </div>

                {/* Justificativa */}
                {flashcard.justification && (
                  <div>
                    <h4 className="text-md font-semibold text-gray-700 mb-3">Justificativa:</h4>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-900 whitespace-pre-wrap leading-relaxed">
                        {flashcard.justification}
                      </p>
                    </div>
                  </div>
                )}

                {/* Botão para mostrar explicações das alternativas erradas */}
                {flashcard.wrongAnswersExplanation && (
                  <div className="text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowExplanations(!showExplanations);
                      }}
                      className="text-orange-600 border-orange-200 hover:bg-orange-50"
                    >
                      {showExplanations ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-2" />
                          Ocultar Explicações
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          Por que as outras estão erradas?
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Explicações das alternativas erradas */}
                {showExplanations && flashcard.wrongAnswersExplanation && (
                  <div className="mt-4">
                    <h4 className="text-md font-semibold text-gray-700 mb-3">Por que as outras alternativas estão erradas:</h4>
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm text-orange-900 whitespace-pre-wrap leading-relaxed">
                        {flashcard.wrongAnswersExplanation}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-center text-sm text-gray-500">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clique para voltar à pergunta
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Botões de Avaliação - Só aparecem quando a carta está virada */}
      {isFlipped && (
        <div className="flex justify-center space-x-4 mb-8">
          <Button
            onClick={() => handleMarkAnswer(false)}
            variant="outline"
            size="lg"
            className="flex-1 max-w-xs border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
          >
            <XCircle className="w-5 h-5 mr-2" />
            Errei
          </Button>
          <Button
            onClick={() => handleMarkAnswer(true)}
            size="lg"
            className="flex-1 max-w-xs bg-green-600 hover:bg-green-700 text-white"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Acertei
          </Button>
        </div>
      )}

      {/* Navegação */}
      {showNavigation && (
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={!onPrevious}
          >
            ← Anterior
          </Button>
          
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={handleFlip}
              className="text-gray-600 hover:text-gray-800"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {isFlipped ? 'Ver Pergunta' : 'Ver Resposta'}
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={onNext}
            disabled={!onNext}
          >
            Próximo →
          </Button>
        </div>
      )}

      {/* CSS para animação 3D */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default FlashcardViewer;

