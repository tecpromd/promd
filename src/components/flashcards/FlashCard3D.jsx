import React, { useState } from 'react';
import { Eye, RotateCcw, BookOpen, Image as ImageIcon, ZoomIn, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import { generateFlashcardNumber, parseQuestionNumber, formatQuestionNumberForDisplay } from '../../utils/questionNumbering';

const FlashCard3D = ({ 
  flashcard, 
  index, 
  onImageClick,
  showAnswer = false,
  onToggleAnswer,
  onDifficultyRating
}) => {
  const [isFlipped, setIsFlipped] = useState(showAnswer);
  const [imageError, setImageError] = useState(false);
  const [showRating, setShowRating] = useState(false);

  // Gerar número lógico do flashcard
  const flashcardNumber = generateFlashcardNumber(
    flashcard.discipline || 'Medicina Geral', 
    index + 1
  );
  
  const displayNumber = formatQuestionNumberForDisplay(flashcardNumber);

  const handleFlip = () => {
    const newFlipped = !isFlipped;
    setIsFlipped(newFlipped);
    
    // Mostrar avaliação quando virar para a resposta
    if (newFlipped) {
      setShowRating(true);
    }
    
    if (onToggleAnswer) {
      onToggleAnswer(newFlipped);
    }
  };

  const handleDifficultyRating = (difficulty) => {
    if (onDifficultyRating) {
      onDifficultyRating(flashcard.id, difficulty);
    }
    setShowRating(false);
    // Opcional: voltar para frente após avaliação
    setTimeout(() => {
      setIsFlipped(false);
    }, 1000);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Verificar se tem imagem (do localStorage ou URL)
  const hasImage = (flashcard.image_url || flashcard.image) && !imageError;
  const imageUrl = flashcard.image_url || flashcard.image;

  const handleImageClick = (e) => {
    e.stopPropagation();
    if (onImageClick && imageUrl) {
      onImageClick(imageUrl);
    }
  };

  return (
    <div className="promd-flashcard group" onClick={handleFlip}>
      <div className={`promd-flashcard-inner ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Frente do Card */}
        <div className="promd-flashcard-front">
          <div className="w-full h-full flex flex-col">
            {/* Header com número */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-mono text-white/80">
                #{displayNumber}
              </span>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-white/80" />
                {hasImage && (
                  <ImageIcon className="w-4 h-4 text-white/80" />
                )}
              </div>
            </div>

            {/* Imagem do flashcard */}
            {hasImage && (
              <div className="relative mb-4 group/image">
                <img 
                  src={imageUrl}
                  alt="Flashcard"
                  className="w-full h-32 object-cover rounded-lg cursor-pointer transition-transform hover:scale-105"
                  onError={handleImageError}
                  onClick={handleImageClick}
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover/image:opacity-100">
                  <ZoomIn className="w-6 h-6 text-white" />
                </div>
              </div>
            )}

            {/* Conteúdo principal */}
            <div className="flex-1 flex flex-col justify-center">
              <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                {flashcard.title || flashcard.front || 'Flashcard'}
              </h3>
              <p className="text-white/80 text-sm line-clamp-3">
                {flashcard.content || flashcard.question || 'Conteúdo do flashcard'}
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/20">
              <span className="text-xs text-white/60">
                {flashcard.discipline || 'Medicina Geral'}
              </span>
              <div className="flex items-center gap-1 text-xs text-white/80">
                <RotateCcw className="w-3 h-3" />
                Ver Resposta
              </div>
            </div>
          </div>
        </div>

        {/* Verso do Card */}
        <div className="promd-flashcard-back">
          <div className="w-full h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-mono text-promd-navy/80">
                #{displayNumber}
              </span>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-promd-navy/80" />
                {hasImage && (
                  <ImageIcon className="w-4 h-4 text-promd-navy/80" />
                )}
              </div>
            </div>

            {/* Imagem do flashcard (também no verso) */}
            {hasImage && (
              <div className="relative mb-4 group/image">
                <img 
                  src={imageUrl}
                  alt="Flashcard"
                  className="w-full h-32 object-cover rounded-lg cursor-pointer transition-transform hover:scale-105"
                  onError={handleImageError}
                  onClick={handleImageClick}
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover/image:opacity-100">
                  <ZoomIn className="w-6 h-6 text-white" />
                </div>
              </div>
            )}

            {/* Resposta */}
            <div className="flex-1 flex flex-col justify-center">
              <h3 className="text-lg font-semibold text-promd-navy mb-2">
                Resposta
              </h3>
              <p className="text-promd-navy/90 text-sm leading-relaxed">
                {flashcard.answer || flashcard.back || 'Resposta do flashcard'}
              </p>
            </div>

            {/* Sistema de Avaliação de Dificuldade */}
            {showRating && (
              <div className="mb-4 p-3 bg-promd-gray-50 rounded-lg border border-promd-gray-200">
                <p className="text-xs text-promd-gray-600 mb-2 text-center">
                  Como foi a dificuldade?
                </p>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDifficultyRating('easy');
                    }}
                    className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-xs"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    Fácil
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDifficultyRating('medium');
                    }}
                    className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors text-xs"
                  >
                    <Minus className="w-3 h-3" />
                    Médio
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDifficultyRating('hard');
                    }}
                    className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-xs"
                  >
                    <ThumbsDown className="w-3 h-3" />
                    Difícil
                  </button>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-promd-gray-200">
              <span className="text-xs text-promd-gray-500">
                {flashcard.discipline || 'Medicina Geral'}
              </span>
              <div className="flex items-center gap-1 text-xs text-promd-navy/80">
                <RotateCcw className="w-3 h-3" />
                Ver Pergunta
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashCard3D;

