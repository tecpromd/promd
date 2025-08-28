import React, { useState } from 'react';

const FlashcardViewer3D = ({ flashcard, onCorrect, onIncorrect, onNext }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      onCorrect();
    } else {
      onIncorrect();
    }
    
    // Reset card para próximo flashcard
    setTimeout(() => {
      setIsFlipped(false);
      onNext();
    }, 1000);
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      {/* Carta 3D */}
      <div 
        onClick={handleCardClick}
        style={{
          width: '100%',
          height: '400px',
          perspective: '1000px',
          cursor: 'pointer',
          marginBottom: '30px'
        }}
      >
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.6s ease-in-out'
        }}>
          {/* Frente da carta */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '15px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            color: 'white',
            textAlign: 'center'
          }}>
            <h2 style={{ 
              fontSize: '24px', 
              marginBottom: '20px',
              fontWeight: 'bold'
            }}>
              {flashcard.title}
            </h2>
            
            <div style={{ 
              fontSize: '18px', 
              lineHeight: '1.6',
              maxWidth: '100%'
            }}>
              {flashcard.front || flashcard.question}
            </div>

            {/* Imagem se existir */}
            {flashcard.files && flashcard.files.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <img 
                  src={flashcard.files[0].url} 
                  alt="Flashcard"
                  style={{
                    maxWidth: '200px',
                    maxHeight: '150px',
                    borderRadius: '8px',
                    objectFit: 'contain'
                  }}
                />
              </div>
            )}

            <div style={{ 
              position: 'absolute',
              bottom: '20px',
              fontSize: '14px',
              opacity: 0.8
            }}>
              👆 Clique para virar
            </div>
          </div>

          {/* Verso da carta */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            borderRadius: '15px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            color: 'white',
            textAlign: 'center'
          }}>
            <h3 style={{ 
              fontSize: '20px', 
              marginBottom: '20px',
              fontWeight: 'bold'
            }}>
              Resposta:
            </h3>
            
            <div style={{ 
              fontSize: '18px', 
              lineHeight: '1.6',
              marginBottom: '20px',
              fontWeight: 'bold'
            }}>
              {flashcard.back || flashcard.answer}
            </div>

            {/* Justificativa se existir */}
            {flashcard.justification && (
              <div style={{ 
                fontSize: '14px', 
                lineHeight: '1.5',
                opacity: 0.9,
                borderTop: '1px solid rgba(255,255,255,0.3)',
                paddingTop: '15px',
                marginTop: '15px'
              }}>
                <strong>Explicação:</strong><br />
                {flashcard.justification}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Botões de resposta (só aparecem quando virado) */}
      {isFlipped && (
        <div style={{ 
          display: 'flex', 
          gap: '20px',
          animation: 'fadeIn 0.5s ease-in-out'
        }}>
          <button
            onClick={() => handleAnswer(false)}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';
            }}
          >
            ❌ Errei
          </button>

          <button
            onClick={() => handleAnswer(true)}
            style={{
              background: '#10b981',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
            }}
          >
            ✅ Acertei
          </button>
        </div>
      )}

      {/* Instruções */}
      {!isFlipped && (
        <div style={{
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '14px',
          marginTop: '10px'
        }}>
          <p>🃏 <strong>Como usar:</strong></p>
          <p>1. Leia a pergunta na frente da carta</p>
          <p>2. Pense na resposta</p>
          <p>3. Clique na carta para virar e ver a resposta</p>
          <p>4. Marque se acertou ou errou</p>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default FlashcardViewer3D;

