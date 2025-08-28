import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const FlashcardViewerProMD = ({ flashcard, onCorrect, onIncorrect, onNext, onDifficultyRate }) => {
  const { t } = useLanguage();
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleDifficultyRate = (level) => {
    setSelectedDifficulty(level);
    if (onDifficultyRate) {
      onDifficultyRate(level);
    }
    // Auto avançar após 1 segundo
    setTimeout(() => {
      setIsFlipped(false);
      setSelectedDifficulty(null);
      if (onNext) onNext();
    }, 1000);
  };

  const getDifficultyColor = (level) => {
    const colors = {
      1: '#dc2626', // Muito difícil - Vermelho
      2: '#ea580c', // Difícil - Laranja
      3: '#eab308', // Normal - Amarelo
      4: '#16a34a', // Fácil - Verde
      5: '#2563eb'  // Muito fácil - Azul
    };
    return colors[level] || '#6b7280';
  };

  const getDifficultyLabel = (level) => {
    const labels = {
      1: 'Muito difícil',
      2: 'Difícil', 
      3: 'Normal',
      4: 'Fácil',
      5: 'Muito fácil'
    };
    return labels[level] || 'Normal';
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
    }}>
      {/* Progresso e Header */}
      <div style={{
        width: '100%',
        maxWidth: '600px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          background: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          color: '#64748b',
          fontWeight: '500',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          📚 Seu progresso: 12 de 22 cards estudados
        </div>
        <div style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }}>
          <button style={{
            background: '#f1f5f9',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#64748b',
            cursor: 'pointer'
          }}>
            ✏️ Editar flashcard
          </button>
          <button style={{
            background: '#f1f5f9',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#64748b',
            cursor: 'pointer'
          }}>
            ⚙️ Opções do flashcard
          </button>
        </div>
      </div>

      {/* Card Container */}
      <div style={{
        perspective: '1000px',
        width: '100%',
        maxWidth: '600px',
        height: '500px',
        marginBottom: '30px'
      }}>
        <div
          onClick={handleCardClick}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: 'transform 0.6s ease-in-out',
            cursor: !isFlipped ? 'pointer' : 'default'
          }}
        >
          {/* Frente do Card */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Header da Frente */}
            <div style={{
              padding: '20px 24px 16px 24px',
              borderBottom: '1px solid #f1f5f9'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px'
              }}>
                <span style={{
                  background: '#dbeafe',
                  color: '#1e40af',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  Frente
                </span>
                <span style={{
                  fontSize: '12px',
                  color: '#64748b',
                  fontWeight: '500'
                }}>
                  Clique para ver a resposta
                </span>
              </div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#1e293b',
                margin: 0,
                lineHeight: '1.3'
              }}>
                {flashcard.title}
              </h2>
            </div>

            {/* Conteúdo da Frente */}
            <div style={{
              flex: 1,
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <div style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: '#334155',
                textAlign: 'center'
              }}>
                {flashcard.question || flashcard.front || flashcard.description}
              </div>

              {/* Imagem na Frente */}
              {flashcard.image_url && (
                <div style={{
                  marginTop: '20px',
                  textAlign: 'center'
                }}>
                  <img
                    src={flashcard.image_url}
                    alt="Imagem do flashcard"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      borderRadius: '8px',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Verso do Card */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Header do Verso */}
            <div style={{
              padding: '20px 24px 16px 24px',
              borderBottom: '1px solid #f1f5f9'
            }}>
              <span style={{
                background: '#dcfce7',
                color: '#166534',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                Verso
              </span>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1e293b',
                margin: '12px 0 0 0'
              }}>
                {flashcard.title}
              </h3>
            </div>

            {/* Conteúdo do Verso */}
            <div style={{
              flex: 1,
              padding: '24px',
              overflow: 'auto'
            }}>
              <div style={{
                fontSize: '15px',
                lineHeight: '1.6',
                color: '#334155',
                marginBottom: '16px'
              }}>
                <strong style={{ color: '#059669' }}>Resposta:</strong><br />
                {flashcard.answer || flashcard.back}
              </div>

              {flashcard.explanation && (
                <div style={{
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: '#475569',
                  padding: '16px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  marginBottom: '20px'
                }}>
                  <strong style={{ color: '#374151' }}>Explicação:</strong><br />
                  {flashcard.explanation}
                </div>
              )}

              {/* Avaliação de Dificuldade integrada no verso */}
              <div style={{
                marginTop: 'auto',
                paddingTop: '20px',
                borderTop: '1px solid #f1f5f9'
              }}>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '12px',
                  textAlign: 'center'
                }}>
                  Avalie a dificuldade:
                </h4>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '8px',
                  marginBottom: '8px'
                }}>
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDifficultyRate(level);
                      }}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: selectedDifficulty === level ? '3px solid #1e293b' : '2px solid #e2e8f0',
                        background: selectedDifficulty === level ? getDifficultyColor(level) : '#f8fafc',
                        color: selectedDifficulty === level ? 'white' : '#64748b',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title={getDifficultyLabel(level)}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '10px',
                  color: '#94a3b8',
                  paddingX: '4px'
                }}>
                  <span>Difícil</span>
                  <span>Fácil</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback de seleção */}
      {selectedDifficulty && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0',
          textAlign: 'center',
          maxWidth: '300px',
          width: '100%',
          marginBottom: '20px'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#059669',
            fontWeight: '600',
            margin: 0
          }}>
            ✅ Avaliado como: {getDifficultyLabel(selectedDifficulty)}
          </p>
          <p style={{
            fontSize: '12px',
            color: '#64748b',
            margin: '4px 0 0 0'
          }}>
            Avançando para o próximo...
          </p>
        </div>
      )}

      {/* Instruções */}
      {!isFlipped && (
        <div style={{
          textAlign: 'center',
          color: '#64748b',
          fontSize: '14px',
          maxWidth: '400px'
        }}>
          <p style={{ margin: 0 }}>
            💡 <strong>Dica:</strong> Clique no card para ver a resposta e avaliar a dificuldade
          </p>
        </div>
      )}
    </div>
  );
};

export default FlashcardViewerProMD;

