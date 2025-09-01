import React, { useState } from 'react';
import ImageZoom from '../ImageZoom';

const SimpleFlashCard = ({ flashcard, index }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = (e) => {
    // Não virar se clicou em um botão
    if (e.target.tagName === 'BUTTON') return;
    setIsFlipped(!isFlipped);
  };

  const handleDifficultyRating = (difficulty, e) => {
    e.stopPropagation();
    console.log(`Flashcard ${flashcard.id} avaliado como: ${difficulty}`);
    // Aqui você pode implementar a lógica de repetição espaçada
    // Opcional: voltar para frente após avaliação
    setTimeout(() => {
      setIsFlipped(false);
    }, 1000);
  };

  return (
    <div 
      className="w-full h-64 cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={handleClick}
    >
      <div 
        className="relative w-full h-full transition-transform duration-600"
        style={{ 
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transitionDuration: '0.6s'
        }}
      >
        {/* Frente do Card */}
        <div 
          className="absolute inset-0 w-full h-full rounded-lg p-6 bg-gradient-to-br from-blue-600 to-blue-800 text-white flex flex-col justify-between"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs opacity-80">#{(index + 1).toString().padStart(2, '0')}</span>
            <div className="text-xs opacity-80">📚</div>
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            <h3 className="text-lg font-semibold mb-2 text-center">
              {flashcard.title || 'Flashcard'}
            </h3>
            <p className="text-sm opacity-90 text-center">
              {flashcard.question || flashcard.content || 'Pergunta do flashcard'}
            </p>
          </div>
          
          <div className="flex justify-between items-end">
            <span className="text-xs opacity-70">
              {flashcard.discipline || 'Medicina Geral'}
            </span>
            <span className="text-xs opacity-70">Clique para virar</span>
          </div>
        </div>

        {/* Verso do Card */}
        <div 
          className="absolute inset-0 w-full h-full rounded-lg p-6 bg-white border-2 border-blue-200 flex flex-col justify-between"
          style={{ 
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden'
          }}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs text-gray-500">#{(index + 1).toString().padStart(2, '0')}</span>
            <div className="text-xs text-gray-500">💡</div>
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            <h3 className="text-lg font-semibold mb-2 text-center text-blue-800">
              Resposta
            </h3>
            <p className="text-sm text-gray-700 text-center">
              {flashcard.answer || flashcard.back || 'Resposta do flashcard'}
            </p>
          </div>
          
          <div className="flex justify-center gap-2 mt-4">
            <button 
              className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200"
              onClick={(e) => handleDifficultyRating('easy', e)}
            >
              Fácil
            </button>
            <button 
              className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-xs hover:bg-yellow-200"
              onClick={(e) => handleDifficultyRating('medium', e)}
            >
              Médio
            </button>
            <button 
              className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
              onClick={(e) => handleDifficultyRating('hard', e)}
            >
              Difícil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleFlashCard;

