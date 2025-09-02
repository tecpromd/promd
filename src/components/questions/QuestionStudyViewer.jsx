import React, { useState } from 'react';

const QuestionStudyViewer = ({ question, onCorrect, onIncorrect, onNext }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswerSelect = (answerIndex) => {
    if (showResult) return; // Não permitir mudança após resposta
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) {
      alert('Selecione uma resposta primeiro!');
      return;
    }

    setShowResult(true);
    
    // Verificar se a resposta está correta
    const isCorrect = selectedAnswer === question.correct_alternative;
    
    if (isCorrect) {
      onCorrect();
    } else {
      onIncorrect();
    }
  };

  const handleShowExplanation = () => {
    setShowExplanation(true);
  };

  const handleNext = () => {
    // Reset para próxima questão
    setSelectedAnswer(null);
    setShowResult(false);
    setShowExplanation(false);
    onNext();
  };

  const getAlternativeLetter = (index) => {
    return String.fromCharCode(65 + index); // A, B, C, D, E...
  };

  const getAlternativeColor = (index) => {
    if (!showResult) {
      return selectedAnswer === index ? '#3b82f6' : '#f3f4f6';
    }
    
    // Mostrar resultado
    if (index === question.correct_alternative) {
      return '#10b981'; // Verde para resposta correta
    }
    if (index === selectedAnswer && selectedAnswer !== question.correct_alternative) {
      return '#ef4444'; // Vermelho para resposta errada selecionada
    }
    return '#f3f4f6'; // Cinza para outras
  };

  const getAlternativeTextColor = (index) => {
    if (!showResult) {
      return selectedAnswer === index ? 'white' : '#1f2937';
    }
    
    if (index === question.correct_alternative || 
        (index === selectedAnswer && selectedAnswer !== question.correct_alternative)) {
      return 'white';
    }
    return '#1f2937';
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px'
    }}>
      {/* Cabeçalho da questão */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '30px',
        marginBottom: '20px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ 
          fontSize: '24px', 
          color: '#1f2937', 
          marginBottom: '20px',
          fontWeight: 'bold'
        }}>
          {question.title}
        </h2>

        {/* Metadados */}
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          marginBottom: '25px',
          flexWrap: 'wrap'
        }}>
          <span style={{
            background: '#f3f4f6',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            color: '#6b7280'
          }}>
            {question.discipline || 'Medicina Geral'}
          </span>
          <span style={{
            background: getDifficultyColor(question.difficulty),
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            color: 'white'
          }}>
            {question.difficulty || 'Intermediário'}
          </span>
          {question.source && (
            <span style={{
              background: '#f3f4f6',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              color: '#6b7280'
            }}>
              {question.source}
            </span>
          )}
        </div>

        {/* Enunciado */}
        <div style={{ 
          fontSize: '16px', 
          lineHeight: '1.7', 
          color: '#1f2937',
          marginBottom: '20px'
        }}>
          {question.statement || question.question}
        </div>

        {/* Imagem se existir */}
        {question.image_url && (
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '20px' 
          }}>
            <img 
              src={question.image_url} 
              alt="Imagem da questão"
              style={{
                maxWidth: '100%',
                maxHeight: '300px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}
            />
          </div>
        )}
      </div>

      {/* Alternativas */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '30px',
        marginBottom: '20px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ 
          fontSize: '18px', 
          color: '#1f2937', 
          marginBottom: '20px',
          fontWeight: 'bold'
        }}>
          Escolha a alternativa correta:
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {question.alternatives && question.alternatives.map((alternative, index) => (
            <div
              key={index}
              onClick={() => handleAnswerSelect(index)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                padding: '15px',
                borderRadius: '8px',
                border: '2px solid',
                borderColor: selectedAnswer === index ? getAlternativeColor(index) : '#e5e7eb',
                background: getAlternativeColor(index),
                color: getAlternativeTextColor(index),
                cursor: showResult ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: getAlternativeTextColor(index) === 'white' ? 'rgba(255,255,255,0.2)' : '#e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px',
                fontSize: '12px',
                fontWeight: 'bold',
                color: getAlternativeTextColor(index),
                flexShrink: 0
              }}>
                {getAlternativeLetter(index)}
              </div>
              <div style={{ flex: 1, fontSize: '15px', lineHeight: '1.5' }}>
                {alternative}
              </div>
              
              {/* Ícones de resultado */}
              {showResult && (
                <div style={{ marginLeft: '10px' }}>
                  {index === question.correct_alternative && (
                    <span style={{ fontSize: '18px' }}>✅</span>
                  )}
                  {index === selectedAnswer && selectedAnswer !== question.correct_alternative && (
                    <span style={{ fontSize: '18px' }}>❌</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Botões de ação */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '15px',
        marginBottom: '20px'
      }}>
        {!showResult ? (
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            style={{
              background: selectedAnswer !== null ? '#3b82f6' : '#9ca3af',
              color: 'white',
              border: 'none',
              padding: '12px 30px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: selectedAnswer !== null ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease'
            }}
          >
            Confirmar Resposta
          </button>
        ) : (
          <>
            {!showExplanation && question.explanation && (
              <button
                onClick={handleShowExplanation}
                style={{
                  background: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                💡 Ver Explicação
              </button>
            )}
            <button
              onClick={handleNext}
              style={{
                background: '#10b981',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Próxima Questão →
            </button>
          </>
        )}
      </div>

      {/* Explicação */}
      {showResult && showExplanation && question.explanation && (
        <div style={{
          background: '#f9fafb',
          borderRadius: '12px',
          padding: '25px',
          border: '1px solid #e5e7eb',
          marginBottom: '20px'
        }}>
          <h4 style={{ 
            fontSize: '16px', 
            color: '#1f2937', 
            marginBottom: '15px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            💡 Explicação da Resposta
          </h4>
          <div style={{ 
            fontSize: '15px', 
            lineHeight: '1.6', 
            color: '#374151'
          }}>
            {question.explanation}
          </div>
        </div>
      )}

      {/* Resultado */}
      {showResult && (
        <div style={{
          background: selectedAnswer === question.correct_alternative ? '#f0fdf4' : '#fef2f2',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid',
          borderColor: selectedAnswer === question.correct_alternative ? '#bbf7d0' : '#fecaca',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: '18px', 
            fontWeight: 'bold',
            color: selectedAnswer === question.correct_alternative ? '#166534' : '#dc2626',
            marginBottom: '8px'
          }}>
            {selectedAnswer === question.correct_alternative ? '🎉 Parabéns! Resposta correta!' : '😔 Resposta incorreta'}
          </div>
          <div style={{ 
            fontSize: '14px',
            color: selectedAnswer === question.correct_alternative ? '#15803d' : '#b91c1c'
          }}>
            A resposta correta é: <strong>{getAlternativeLetter(question.correct_alternative)}) {question.alternatives[question.correct_alternative]}</strong>
          </div>
        </div>
      )}
    </div>
  );
};

// Função auxiliar para cor da dificuldade
const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'fácil':
    case 'facil':
    case 'easy':
      return '#10b981';
    case 'intermediário':
    case 'intermediario':
    case 'medium':
      return '#f59e0b';
    case 'difícil':
    case 'dificil':
    case 'hard':
      return '#ef4444';
    default:
      return '#6b7280';
  }
};

export default QuestionStudyViewer;

