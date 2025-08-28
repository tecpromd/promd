import React, { useState } from 'react';
import { useQuestions } from '../hooks/useQuestions';
import QuestionViewerWithSidebar from '../components/questions/QuestionViewerWithSidebar';

const Questions = () => {
  const { questions, importQuestions, exportQuestions } = useQuestions();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' ou 'study'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleStartStudy = () => {
    if (filteredQuestions.length > 0) {
      setCurrentQuestionIndex(0);
      setViewMode('study');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setCurrentQuestionIndex(0);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const result = importQuestions(e.target.result);
          if (result.success) {
            alert(`${result.count} questões importadas com sucesso!`);
          } else {
            alert(`Erro ao importar: ${result.error}`);
          }
        } catch (error) {
          alert('Erro ao processar arquivo');
        }
      };
      reader.readAsText(file);
    }
  };

  const filteredQuestions = questions.filter(question => 
    !searchQuery || 
    question.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    question.question?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Modo de Estudo com Sidebar
  if (viewMode === 'study' && filteredQuestions.length > 0) {
    return (
      <QuestionViewerWithSidebar
        question={filteredQuestions[currentQuestionIndex]}
        onNext={handleNextQuestion}
        onPrevious={handlePreviousQuestion}
        currentIndex={currentQuestionIndex}
        total={filteredQuestions.length}
        onBackToList={handleBackToList}
      />
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>
          🗄️ Banco de Questões
        </h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Gerencie questões para provas e estudos
        </p>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#f97316', borderRadius: '50%' }}></div>
          <span style={{ color: '#f97316', fontSize: '14px' }}>Armazenamento Local</span>
        </div>
      </div>

      {/* Estatísticas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        <div style={{ 
          border: '1px solid #e5e7eb', 
          borderRadius: '8px', 
          padding: '20px',
          backgroundColor: 'white'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#666', marginBottom: '10px' }}>
            Total de Questões
          </h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{questions.length}</div>
        </div>
        
        <div style={{ 
          border: '1px solid #e5e7eb', 
          borderRadius: '8px', 
          padding: '20px',
          backgroundColor: 'white'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#666', marginBottom: '10px' }}>
            Questões Filtradas
          </h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{filteredQuestions.length}</div>
        </div>
      </div>

      {/* Controles */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '15px', 
        alignItems: 'center', 
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px'
      }}>
        {/* Busca */}
        <input
          type="text"
          placeholder="Buscar questões..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: '10px 15px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            minWidth: '250px',
            flex: '1'
          }}
        />

        {/* Botões */}
        <input
          type="file"
          accept=".json"
          onChange={handleImport}
          style={{ display: 'none' }}
          id="import-questions"
        />
        
        <button
          onClick={() => document.getElementById('import-questions').click()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          📤 Importar
        </button>
        
        <button
          onClick={exportQuestions}
          disabled={questions.length === 0}
          style={{
            padding: '10px 20px',
            backgroundColor: questions.length === 0 ? '#9ca3af' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: questions.length === 0 ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          📥 Exportar
        </button>

        <button
          onClick={handleStartStudy}
          disabled={filteredQuestions.length === 0}
          style={{
            padding: '10px 20px',
            backgroundColor: filteredQuestions.length === 0 ? '#9ca3af' : '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: filteredQuestions.length === 0 ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          📚 Estudar Questões
        </button>
      </div>

      {/* Lista de Questões */}
      <div>
        {filteredQuestions.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: 'white'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📚</div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '10px' }}>
              {questions.length === 0 ? 'Nenhuma questão criada' : 'Nenhuma questão encontrada'}
            </h3>
            <p style={{ color: '#666', marginBottom: '30px' }}>
              {questions.length === 0 
                ? 'Comece importando questões do arquivo JSON fornecido.'
                : 'Tente ajustar os termos de busca.'
              }
            </p>
            {questions.length === 0 && (
              <button
                onClick={() => document.getElementById('import-questions').click()}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                📤 Importar Questões
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {filteredQuestions.map((question, index) => (
              <div 
                key={question.id || index}
                style={{ 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px', 
                  padding: '20px',
                  backgroundColor: 'white',
                  transition: 'box-shadow 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}
                onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: '1' }}>
                    <h3 style={{ 
                      fontSize: '18px', 
                      fontWeight: '600', 
                      marginBottom: '10px',
                      color: '#1f2937'
                    }}>
                      {question.title || `Questão ${index + 1}`}
                    </h3>
                    
                    <div style={{ 
                      display: 'flex', 
                      gap: '10px', 
                      alignItems: 'center', 
                      marginBottom: '15px',
                      fontSize: '14px',
                      color: '#6b7280'
                    }}>
                      <span>{question.discipline || 'Medicina Geral'}</span>
                      <span>•</span>
                      <span style={{ 
                        padding: '2px 8px', 
                        backgroundColor: '#dbeafe', 
                        color: '#1e40af',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        {question.difficulty || 'Intermediário'}
                      </span>
                      {question.source && (
                        <>
                          <span>•</span>
                          <span>{question.source}</span>
                        </>
                      )}
                    </div>
                    
                    <p style={{ 
                      color: '#4b5563', 
                      lineHeight: '1.5',
                      marginBottom: '10px'
                    }}>
                      {(question.statement || question.question || '').substring(0, 200)}
                      {(question.statement || question.question || '').length > 200 && '...'}
                    </p>
                    
                    {question.tags && question.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                        {question.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span 
                            key={tagIndex}
                            style={{ 
                              padding: '2px 6px', 
                              backgroundColor: '#f3f4f6', 
                              color: '#374151',
                              borderRadius: '3px',
                              fontSize: '11px'
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                        {question.tags.length > 3 && (
                          <span style={{ 
                            padding: '2px 6px', 
                            backgroundColor: '#f3f4f6', 
                            color: '#374151',
                            borderRadius: '3px',
                            fontSize: '11px'
                          }}>
                            +{question.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '5px', marginLeft: '20px' }}>
                    <button
                      onClick={() => alert('Visualização em desenvolvimento')}
                      style={{
                        padding: '8px',
                        backgroundColor: '#f3f4f6',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                      title="Visualizar"
                    >
                      👁️
                    </button>
                    <button
                      onClick={() => alert('Edição em desenvolvimento')}
                      style={{
                        padding: '8px',
                        backgroundColor: '#f3f4f6',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Tem certeza que deseja deletar esta questão?')) {
                          alert('Função deletar em desenvolvimento');
                        }
                      }}
                      style={{
                        padding: '8px',
                        backgroundColor: '#fef2f2',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#dc2626'
                      }}
                      title="Deletar"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {filteredQuestions.length > 0 && (
        <div style={{ 
          marginTop: '30px', 
          padding: '15px',
          backgroundColor: '#f9fafb',
          borderRadius: '6px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          Mostrando {filteredQuestions.length} de {questions.length} questões
        </div>
      )}
    </div>
  );
};

export default Questions;

