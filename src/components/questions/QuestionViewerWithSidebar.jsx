import React, { useState } from 'react';
import { getQuestionExplanations } from '../../data/questionExplanations';

const QuestionViewerWithSidebar = ({ question, onNext, onPrevious, currentIndex, total }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleAnswerSelect = (optionId) => {
    setSelectedAnswer(optionId);
  };

  const handleConfirmAnswer = () => {
    setShowExplanation(true);
    setSidebarOpen(true);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setSidebarOpen(false);
    if (onNext) onNext();
  };

  const getOptionStyle = (option) => {
    if (!showExplanation) {
      return {
        backgroundColor: selectedAnswer === option.id ? '#dbeafe' : 'white',
        borderColor: selectedAnswer === option.id ? '#3b82f6' : '#e5e7eb',
        color: selectedAnswer === option.id ? '#1e40af' : '#374151'
      };
    }

    if (option.isCorrect) {
      return {
        backgroundColor: '#dcfce7',
        borderColor: '#16a34a',
        color: '#166534'
      };
    } else if (selectedAnswer === option.id) {
      return {
        backgroundColor: '#fee2e2',
        borderColor: '#dc2626',
        color: '#991b1b'
      };
    } else {
      return {
        backgroundColor: '#f9fafb',
        borderColor: '#e5e7eb',
        color: '#6b7280'
      };
    }
  };

  // Garantir que temos as opções corretas
  const options = question.options || [];
  const correctOption = options.find(opt => opt.isCorrect);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Área Principal da Questão */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'mr-96' : ''}`}>
        <div className="max-w-4xl mx-auto p-6 h-full overflow-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Questão {currentIndex + 1} de {total}
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {question.category && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    {question.category}
                  </span>
                )}
              </span>
              <span className="text-sm font-medium text-blue-600">
                {Math.round(((currentIndex + 1) / total) * 100)}%
              </span>
            </div>
          </div>

          {/* Barra de Progresso */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
            ></div>
          </div>

          {/* Título da Questão */}
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {question.title || `Questão ${question.id?.slice(0, 8) || currentIndex + 1}`}
            </h3>
            
            {/* Texto da Questão */}
            <div className="text-gray-700 leading-relaxed mb-6">
              {question.question}
            </div>

            {/* Imagem da Questão */}
            {question.image && (
              <div className="flex justify-center mb-6">
                <img 
                  src={question.image} 
                  alt="Imagem da questão"
                  className="max-w-full max-h-64 object-contain rounded-lg shadow-md border"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    console.log('Erro ao carregar imagem:', question.image);
                  }}
                />
              </div>
            )}
          </div>

          {/* Alternativas */}
          <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
            <h4 className="text-md font-semibold text-gray-800 mb-4">
              Selecione a alternativa correta:
            </h4>
            
            {options.length > 0 ? (
              <div className="space-y-3">
                {options.map((option, index) => (
                  <button
                    key={option.id || index}
                    onClick={() => handleAnswerSelect(option.id || index)}
                    disabled={showExplanation}
                    className="w-full text-left p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md disabled:cursor-not-allowed"
                    style={getOptionStyle(option)}
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-bold text-lg min-w-[24px]">
                        {option.letter || String.fromCharCode(65 + index)})
                      </span>
                      <span className="flex-1">
                        {option.text}
                      </span>
                      {showExplanation && option.isCorrect && (
                        <span className="text-green-600 font-bold text-xl">✓</span>
                      )}
                      {showExplanation && !option.isCorrect && selectedAnswer === (option.id || index) && (
                        <span className="text-red-600 font-bold text-xl">✗</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhuma alternativa disponível para esta questão.</p>
                <p className="text-sm mt-2">Verifique se as opções foram carregadas corretamente do banco de dados.</p>
              </div>
            )}
          </div>

          {/* Botão Confirmar */}
          {selectedAnswer !== null && !showExplanation && options.length > 0 && (
            <div className="text-center mb-6">
              <button
                onClick={handleConfirmAnswer}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              >
                Confirmar Resposta
              </button>
            </div>
          )}

          {/* Controles de Navegação */}
          <div className="flex justify-between items-center">
            <button
              onClick={onPrevious}
              disabled={currentIndex === 0}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Anterior
            </button>

            {showExplanation && (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Próxima Questão →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Deslizante com Explicações */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 z-50 ${
        sidebarOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          {/* Header do Sidebar */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Explicações Detalhadas</h3>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-blue-100 text-sm mt-2">
              Entenda por que cada alternativa está certa ou errada
            </p>
          </div>

          {/* Conteúdo do Sidebar */}
          <div className="flex-1 overflow-auto p-6">
            {(() => {
              const explanations = getQuestionExplanations(question.id);
              
              if (!explanations) {
                return (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm">
                      Explicações não disponíveis para esta questão.
                    </p>
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h5 className="font-medium text-blue-800 mb-2">📚 Informações Adicionais:</h5>
                      <div className="text-sm text-blue-700 space-y-1">
                        <p><strong>Fonte:</strong> {question.source || 'ProMD'}</p>
                        <p><strong>Categoria:</strong> {question.category || 'Medicina Geral'}</p>
                        <p><strong>Dificuldade:</strong> {question.difficulty || 'medium'}</p>
                      </div>
                    </div>
                  </div>
                );
              }

              const correctOption = Object.entries(explanations).find(([letter, data]) => data.isCorrect);
              const incorrectOptions = Object.entries(explanations).filter(([letter, data]) => !data.isCorrect);

              return (
                <>
                  {/* Resposta Correta */}
                  {correctOption && (
                    <div className="mb-6">
                      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg mb-4">
                        <h4 className="font-semibold text-green-800 mb-2">
                          ✅ Resposta Correta
                        </h4>
                        <p className="text-green-700 text-sm">
                          {correctOption[0]}) {correctOption[1].text}
                        </p>
                      </div>
                      
                      <div className="bg-white border rounded-lg p-4">
                        <h5 className="font-medium text-gray-800 mb-2">Por que está correta:</h5>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {correctOption[1].explanation}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Alternativas Incorretas */}
                  {incorrectOptions.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800 border-b pb-2">
                        ❌ Por que as outras estão erradas:
                      </h4>
                      
                      {incorrectOptions.map(([letter, data]) => (
                        <div key={letter} className="bg-red-50 border-l-4 border-red-300 rounded-r-lg">
                          <div className="p-4">
                            <h5 className="font-medium text-red-800 mb-2">
                              {letter}) {data.text}
                            </h5>
                            <p className="text-red-700 text-sm leading-relaxed">
                              {data.explanation}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Informações Adicionais */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-medium text-blue-800 mb-2">📚 Informações Adicionais:</h5>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p><strong>Fonte:</strong> {question.source || 'ProMD'}</p>
                      <p><strong>Categoria:</strong> {question.category || 'Medicina Geral'}</p>
                      <p><strong>Dificuldade:</strong> {question.difficulty || 'medium'}</p>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Footer do Sidebar */}
          <div className="border-t bg-gray-50 p-4">
            <button
              onClick={handleNext}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Próxima Questão →
            </button>
          </div>
        </div>
      </div>

      {/* Overlay quando sidebar está aberto */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default QuestionViewerWithSidebar;

