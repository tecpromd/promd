import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, BookOpen, Target, Users, Settings, Play } from 'lucide-react';
import { useDisciplines } from '../hooks/useDisciplines';

const TestConfiguration = () => {
  const navigate = useNavigate();
  const { disciplines, loading: disciplinesLoading } = useDisciplines();
  
  // Estados para configuração do teste
  const [testMode, setTestMode] = useState('tutor'); // tutor ou cronometrado
  const [testModel, setTestModel] = useState('promd'); // promd, nbme, personalizado
  const [questionTypes, setQuestionTypes] = useState(['ineditas']); // array de tipos selecionados
  const [selectedDisciplines, setSelectedDisciplines] = useState([]);
  const [questionCount, setQuestionCount] = useState(20);
  const [customQuestionIds, setCustomQuestionIds] = useState('');

  // Opções disponíveis
  const testModes = [
    { id: 'tutor', label: 'Modo Tutor', description: 'Sem limite de tempo, com feedback imediato', icon: BookOpen },
    { id: 'cronometrado', label: 'Modo Cronometrado', description: '1,5 min por questão', icon: Clock }
  ];

  const testModels = [
    { id: 'promd', label: 'ProMD Simulado', description: 'Questões automáticas baseadas no seu progresso' },
    { id: 'nbme', label: 'Estilo NBME', description: 'Formato similar ao exame oficial' },
    { id: 'personalizado', label: 'Personalizado', description: 'Escolha questões específicas por ID' }
  ];

  const questionTypeOptions = [
    { id: 'corretas', label: 'Respondidas Corretamente', count: 0 },
    { id: 'incorretas', label: 'Respondidas Incorretamente', count: 0 },
    { id: 'ineditas', label: 'Questões Inéditas', count: 14 },
    { id: 'marcadas', label: 'Questões Marcadas', count: 0 },
    { id: 'todas', label: 'Todas as Questões', count: 14 }
  ];

  // Calcular tempo estimado
  const calculateEstimatedTime = () => {
    if (testMode === 'tutor') return 'Sem limite';
    const minutes = Math.round(questionCount * 1.5);
    return `${minutes} minutos`;
  };

  // Selecionar/deselecionar todas as disciplinas
  const toggleAllDisciplines = () => {
    if (selectedDisciplines.length === disciplines.length) {
      setSelectedDisciplines([]);
    } else {
      setSelectedDisciplines(disciplines.map(d => d.id));
    }
  };

  // Selecionar/deselecionar disciplina individual
  const toggleDiscipline = (disciplineId) => {
    setSelectedDisciplines(prev => 
      prev.includes(disciplineId) 
        ? prev.filter(id => id !== disciplineId)
        : [...prev, disciplineId]
    );
  };

  // Iniciar teste
  const startTest = () => {
    const config = {
      mode: testMode,
      model: testModel,
      types: questionTypes,
      disciplines: selectedDisciplines,
      questionCount,
      customIds: testModel === 'personalizado' ? customQuestionIds.split(',').map(id => id.trim()) : []
    };

    // Navegar para página de execução do teste
    navigate('/test-execution', { state: { config } });
  };

  // Validar se pode iniciar o teste
  const canStartTest = () => {
    if (selectedDisciplines.length === 0) return false;
    if (questionTypes.length === 0) return false;
    if (testModel === 'personalizado' && !customQuestionIds.trim()) return false;
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Configurar Teste</h1>
          <p className="text-gray-600">Configure seu teste personalizado escolhendo modo, disciplinas e tipos de questões</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configurações Principais */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Modo da Prova */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                1. Modo da Prova
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testModes.map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <div
                      key={mode.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        testMode === mode.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setTestMode(mode.id)}
                    >
                      <div className="flex items-center mb-2">
                        <Icon className="w-5 h-5 mr-2 text-blue-600" />
                        <span className="font-medium">{mode.label}</span>
                      </div>
                      <p className="text-sm text-gray-600">{mode.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Modelo da Prova */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                2. Modelo da Prova
              </h2>
              <div className="space-y-3">
                {testModels.map((model) => (
                  <div
                    key={model.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      testModel === model.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setTestModel(model.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{model.label}</span>
                        <p className="text-sm text-gray-600 mt-1">{model.description}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        testModel === model.id ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Campo para IDs personalizados */}
              {testModel === 'personalizado' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IDs das Questões (separados por vírgula)
                  </label>
                  <input
                    type="text"
                    value={customQuestionIds}
                    onChange={(e) => setCustomQuestionIds(e.target.value)}
                    placeholder="Ex: 101, 102, 1101, 1201"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>

            {/* 3. Tipos de Questões */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                3. Tipos de Questões
              </h2>
              <div className="space-y-3">
                {questionTypeOptions.map((type) => (
                  <label key={type.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={questionTypes.includes(type.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setQuestionTypes(prev => [...prev, type.id]);
                          } else {
                            setQuestionTypes(prev => prev.filter(t => t !== type.id));
                          }
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-3 font-medium">{type.label}</span>
                    </div>
                    <span className="text-sm text-gray-500">{type.count} questões</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 4. Disciplinas */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                4. Disciplinas
              </h2>
              
              <div className="mb-4">
                <button
                  onClick={toggleAllDisciplines}
                  className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                >
                  {selectedDisciplines.length === disciplines.length ? 'Desmarcar Todas' : 'Selecionar Todas'}
                </button>
                <span className="ml-3 text-sm text-gray-600">
                  {selectedDisciplines.length} de {disciplines.length} selecionadas
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                {disciplinesLoading ? (
                  <div className="col-span-2 text-center py-4">Carregando disciplinas...</div>
                ) : (
                  disciplines.map((discipline) => (
                    <label key={discipline.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedDisciplines.includes(discipline.id)}
                          onChange={() => toggleDiscipline(discipline.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-3 font-medium">{discipline.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">140 questões</span>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Painel Lateral - Resumo e Configurações */}
          <div className="space-y-6">
            
            {/* 5. Número de Questões */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">5. Configurações Gerais</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Questões (máx. 40)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>1</span>
                    <span className="font-medium">{questionCount}</span>
                    <span>40</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Questões por bloco:</span>
                      <span className="font-medium">{questionCount}/40</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tempo estimado:</span>
                      <span className="font-medium">{calculateEstimatedTime()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Modo:</span>
                      <span className="font-medium capitalize">{testMode}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumo da Configuração */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Resumo da Configuração</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <div>📚 <strong>{questionCount}</strong> questões</div>
                <div>⏱️ <strong>{calculateEstimatedTime()}</strong></div>
                <div>🎯 <strong>{selectedDisciplines.length}</strong> disciplinas</div>
                <div>📋 <strong>{questionTypes.length}</strong> tipos selecionados</div>
              </div>
            </div>

            {/* Botão Iniciar Teste */}
            <button
              onClick={startTest}
              disabled={!canStartTest()}
              className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-all ${
                canStartTest()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Play className="w-5 h-5 mr-2" />
              Iniciar Teste
            </button>

            {!canStartTest() && (
              <p className="text-sm text-red-600 text-center">
                Selecione pelo menos uma disciplina e um tipo de questão
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestConfiguration;

