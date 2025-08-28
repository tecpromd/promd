import React, { useState } from 'react';

const QuestionStudyViewerModern = ({ question, onCorrect, onIncorrect, onNext }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showJustifications, setShowJustifications] = useState(false);

  const handleAnswerSelect = (answerIndex) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) {
      alert('Selecione uma resposta primeiro!');
      return;
    }

    setShowResult(true);
    
    const isCorrect = selectedAnswer === question.correct_alternative;
    
    if (isCorrect) {
      onCorrect();
    } else {
      onIncorrect();
    }
  };

  const handleShowJustifications = () => {
    setShowJustifications(true);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setShowJustifications(false);
    onNext();
  };

  const getAlternativeLetter = (index) => {
    return String.fromCharCode(65 + index);
  };

  const getAlternativeColor = (index) => {
    if (!showResult) {
      return selectedAnswer === index ? '#2563eb' : '#f8fafc';
    }
    
    if (index === question.correct_alternative) {
      return '#059669';
    }
    if (index === selectedAnswer && selectedAnswer !== question.correct_alternative) {
      return '#dc2626';
    }
    return '#f8fafc';
  };

  const getAlternativeTextColor = (index) => {
    if (!showResult) {
      return selectedAnswer === index ? 'white' : '#1e293b';
    }
    
    if (index === question.correct_alternative || 
        (index === selectedAnswer && selectedAnswer !== question.correct_alternative)) {
      return 'white';
    }
    return '#1e293b';
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'fácil':
      case 'facil':
      case 'easy':
        return '#059669';
      case 'intermediário':
      case 'intermediario':
      case 'medium':
        return '#d97706';
      case 'difícil':
      case 'dificil':
      case 'hard':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  };

  return (
    <div style={{ 
      display: 'flex',
      minHeight: '100vh',
      background: '#f8fafc'
    }}>
      {/* Conteúdo Principal */}
      <div style={{ 
        flex: showJustifications ? '0 0 60%' : '1',
        padding: '20px',
        transition: 'all 0.3s ease',
        overflow: 'auto'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Header da Questão */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '24px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            {/* Título e Metadados */}
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ 
                fontSize: '28px', 
                fontWeight: '700',
                color: '#1e293b', 
                marginBottom: '16px',
                lineHeight: '1.2'
              }}>
                {question.title}
              </h1>

              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                flexWrap: 'wrap',
                marginBottom: '20px'
              }}>
                <span style={{
                  background: '#f1f5f9',
                  color: '#475569',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '500'
                }}>
                  📚 {question.discipline || 'Medicina Geral'}
                </span>
                <span style={{
                  background: getDifficultyColor(question.difficulty),
                  color: 'white',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '500'
                }}>
                  🎯 {question.difficulty || 'Intermediário'}
                </span>
                {question.source && (
                  <span style={{
                    background: '#f1f5f9',
                    color: '#475569',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}>
                    📖 {question.source}
                  </span>
                )}
              </div>
            </div>

            {/* Enunciado */}
            <div style={{ 
              fontSize: '17px', 
              lineHeight: '1.7', 
              color: '#334155',
              marginBottom: '24px',
              padding: '20px',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              {question.statement || question.question}
            </div>

            {/* Imagens */}
            {question.image_url && (
              <div style={{ 
                textAlign: 'center', 
                marginBottom: '24px',
                padding: '16px',
                background: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <img 
                  src={question.image_url} 
                  alt="Imagem da questão"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '400px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </div>
            )}
          </div>

          {/* Alternativas */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '24px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: '600',
              color: '#1e293b', 
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🎯 Escolha a alternativa correta:
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {question.alternatives && question.alternatives.map((alternative, index) => (
                <div
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '2px solid',
                    borderColor: selectedAnswer === index ? getAlternativeColor(index) : '#e2e8f0',
                    background: getAlternativeColor(index),
                    color: getAlternativeTextColor(index),
                    cursor: showResult ? 'default' : 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    transform: selectedAnswer === index && !showResult ? 'translateY(-2px)' : 'translateY(0)',
                    boxShadow: selectedAnswer === index && !showResult ? '0 8px 25px -8px rgba(0, 0, 0, 0.2)' : '0 2px 4px -1px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: getAlternativeTextColor(index) === 'white' ? 'rgba(255,255,255,0.2)' : '#e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '16px',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: getAlternativeTextColor(index),
                    flexShrink: 0
                  }}>
                    {getAlternativeLetter(index)}
                  </div>
                  <div style={{ 
                    flex: 1, 
                    fontSize: '16px', 
                    lineHeight: '1.6',
                    fontWeight: '500'
                  }}>
                    {alternative}
                  </div>
                  
                  {showResult && (
                    <div style={{ marginLeft: '12px' }}>
                      {index === question.correct_alternative && (
                        <div style={{ 
                          background: 'rgba(255,255,255,0.2)', 
                          borderRadius: '50%', 
                          width: '32px', 
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px'
                        }}>
                          ✅
                        </div>
                      )}
                      {index === selectedAnswer && selectedAnswer !== question.correct_alternative && (
                        <div style={{ 
                          background: 'rgba(255,255,255,0.2)', 
                          borderRadius: '50%', 
                          width: '32px', 
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px'
                        }}>
                          ❌
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Botões de Ação */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '16px',
            marginBottom: '24px'
          }}>
            {!showResult ? (
              <button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                style={{
                  background: selectedAnswer !== null ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : '#94a3b8',
                  color: 'white',
                  border: 'none',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: selectedAnswer !== null ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedAnswer !== null ? '0 4px 14px 0 rgba(37, 99, 235, 0.3)' : 'none',
                  transform: selectedAnswer !== null ? 'translateY(0)' : 'none'
                }}
                onMouseOver={(e) => {
                  if (selectedAnswer !== null) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px 0 rgba(37, 99, 235, 0.4)';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedAnswer !== null) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 14px 0 rgba(37, 99, 235, 0.3)';
                  }
                }}
              >
                ✨ Confirmar Resposta
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '16px' }}>
                <button
                  onClick={handleShowJustifications}
                  style={{
                    background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 14px 0 rgba(217, 119, 6, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px 0 rgba(217, 119, 6, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 14px 0 rgba(217, 119, 6, 0.3)';
                  }}
                >
                  💡 Ver Justificativas
                </button>
                <button
                  onClick={handleNext}
                  style={{
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 14px 0 rgba(5, 150, 105, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px 0 rgba(5, 150, 105, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 14px 0 rgba(5, 150, 105, 0.3)';
                  }}
                >
                  Próxima Questão →
                </button>
              </div>
            )}
          </div>

          {/* Resultado */}
          {showResult && (
            <div style={{
              background: selectedAnswer === question.correct_alternative 
                ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' 
                : 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)',
              borderRadius: '16px',
              padding: '24px',
              border: '2px solid',
              borderColor: selectedAnswer === question.correct_alternative ? '#10b981' : '#ef4444',
              textAlign: 'center',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ 
                fontSize: '20px', 
                fontWeight: '700',
                color: selectedAnswer === question.correct_alternative ? '#065f46' : '#991b1b',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                {selectedAnswer === question.correct_alternative ? '🎉 Parabéns! Resposta correta!' : '😔 Resposta incorreta'}
              </div>
              <div style={{ 
                fontSize: '16px',
                color: selectedAnswer === question.correct_alternative ? '#047857' : '#dc2626',
                fontWeight: '500'
              }}>
                A resposta correta é: <strong>{getAlternativeLetter(question.correct_alternative)}) {question.alternatives[question.correct_alternative]}</strong>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Painel Lateral de Justificativas */}
      {showJustifications && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '40%',
          height: '100vh',
          background: 'white',
          boxShadow: '-4px 0 15px -3px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          animation: 'slideInRight 0.3s ease-out',
          overflow: 'auto',
          borderLeft: '1px solid #e2e8f0'
        }}>
          {/* Header do Painel */}
          <div style={{
            padding: '24px',
            borderBottom: '1px solid #e2e8f0',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            position: 'sticky',
            top: 0,
            zIndex: 10
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: '700',
                color: '#1e293b',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                💡 Justificativas Detalhadas
              </h3>
              <button
                onClick={() => setShowJustifications(false)}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '8px',
                  cursor: 'pointer',
                  color: '#64748b',
                  fontSize: '18px',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#e2e8f0';
                  e.target.style.color = '#475569';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#f1f5f9';
                  e.target.style.color = '#64748b';
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Conteúdo do Painel */}
          <div style={{ padding: '24px' }}>
            {/* Resposta Correta */}
            <div style={{
              marginBottom: '24px',
              padding: '20px',
              background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
              borderRadius: '12px',
              border: '1px solid #10b981'
            }}>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#065f46',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                ✅ Resposta Correta: {getAlternativeLetter(question.correct_alternative)}
              </h4>
              <p style={{
                fontSize: '14px',
                color: '#047857',
                lineHeight: '1.6',
                margin: '0 0 12px 0',
                fontWeight: '500'
              }}>
                {question.alternatives[question.correct_alternative]}
              </p>
              <div style={{
                fontSize: '14px',
                color: '#065f46',
                lineHeight: '1.6',
                padding: '12px',
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '8px'
              }}>
                <strong>Por que está correta:</strong><br />
                {question.explanation || question.correct_justification || 'Esta é a resposta correta baseada nos conceitos médicos fundamentais.'}
              </div>
            </div>

            {/* Alternativas Incorretas */}
            <div>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#1e293b',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                ❌ Por que as outras estão erradas:
              </h4>

              {question.alternatives && question.alternatives.map((alternative, index) => {
                if (index === question.correct_alternative) return null;
                
                return (
                  <div key={index} style={{
                    marginBottom: '16px',
                    padding: '16px',
                    background: '#fef2f2',
                    borderRadius: '12px',
                    border: '1px solid #fecaca'
                  }}>
                    <h5 style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#991b1b',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      {getAlternativeLetter(index)}) {alternative}
                    </h5>
                    <div style={{
                      fontSize: '13px',
                      color: '#7f1d1d',
                      lineHeight: '1.5',
                      padding: '8px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      borderRadius: '6px'
                    }}>
                      <strong>Por que está errada:</strong><br />
                      {question.wrong_justifications && question.wrong_justifications[index] 
                        ? question.wrong_justifications[index]
                        : `Esta alternativa não está correta pois não atende aos critérios diagnósticos ou terapêuticos adequados para o caso apresentado.`
                      }
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Informações Adicionais */}
            {question.additional_info && (
              <div style={{
                marginTop: '24px',
                padding: '16px',
                background: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#475569',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  📚 Informações Adicionais:
                </h4>
                <p style={{
                  fontSize: '13px',
                  color: '#64748b',
                  lineHeight: '1.5',
                  margin: 0
                }}>
                  {question.additional_info}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overlay */}
      {showJustifications && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '60%',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.3)',
            zIndex: 999,
            animation: 'fadeIn 0.3s ease-out'
          }}
          onClick={() => setShowJustifications(false)}
        />
      )}

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default QuestionStudyViewerModern;

