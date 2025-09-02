import React, { useState } from 'react';
import { Upload, Plus, Edit, Trash2, Image, FileText, Save, X } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('questoes');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState('questao');

  const [newQuestion, setNewQuestion] = useState({
    discipline: '',
    questionText: '',
    options: [
      { letter: 'A', text: '', isCorrect: false, explanation: '' },
      { letter: 'B', text: '', isCorrect: false, explanation: '' },
      { letter: 'C', text: '', isCorrect: false, explanation: '' },
      { letter: 'D', text: '', isCorrect: false, explanation: '' },
      { letter: 'E', text: '', isCorrect: false, explanation: '' }
    ],
    images: [],
    attachments: []
  });

  const [newFlashcard, setNewFlashcard] = useState({
    discipline: '',
    front: '',
    back: '',
    images: [],
    difficulty: 'medium'
  });

  const disciplines = [
    'Cardiologia', 'Pneumologia', 'Neurologia', 'Gastroenterologia',
    'Endocrinologia', 'Nefrologia', 'Hematologia', 'Oncologia',
    'Infectologia', 'Reumatologia', 'Dermatologia', 'Oftalmologia'
  ];

  const handleImageUpload = (e, type) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = {
          id: Date.now() + Math.random(),
          name: file.name,
          url: event.target.result,
          size: file.size
        };
        
        if (type === 'questao') {
          setNewQuestion(prev => ({
            ...prev,
            images: [...prev.images, imageData]
          }));
        } else {
          setNewFlashcard(prev => ({
            ...prev,
            images: [...prev.images, imageData]
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAttachmentUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const attachmentData = {
          id: Date.now() + Math.random(),
          name: file.name,
          url: event.target.result,
          size: file.size,
          type: file.type
        };
        
        setNewQuestion(prev => ({
          ...prev,
          attachments: [...prev.attachments, attachmentData]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleOptionChange = (index, field, value) => {
    setNewQuestion(prev => ({
      ...prev,
      options: prev.options.map((option, i) => 
        i === index ? { ...option, [field]: value } : option
      )
    }));
  };

  const handleCorrectAnswer = (index) => {
    setNewQuestion(prev => ({
      ...prev,
      options: prev.options.map((option, i) => ({
        ...option,
        isCorrect: i === index
      }))
    }));
  };

  const saveQuestion = async () => {
    try {
      // Aqui integraria com Supabase
      console.log('Salvando questão:', newQuestion);
      
      // Reset form
      setNewQuestion({
        discipline: '',
        questionText: '',
        options: [
          { letter: 'A', text: '', isCorrect: false, explanation: '' },
          { letter: 'B', text: '', isCorrect: false, explanation: '' },
          { letter: 'C', text: '', isCorrect: false, explanation: '' },
          { letter: 'D', text: '', isCorrect: false, explanation: '' },
          { letter: 'E', text: '', isCorrect: false, explanation: '' }
        ],
        images: [],
        attachments: []
      });
      
      setShowUploadModal(false);
      alert('Questão salva com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar questão:', error);
      alert('Erro ao salvar questão');
    }
  };

  const saveFlashcard = async () => {
    try {
      // Aqui integraria com Supabase
      console.log('Salvando flashcard:', newFlashcard);
      
      // Reset form
      setNewFlashcard({
        discipline: '',
        front: '',
        back: '',
        images: [],
        difficulty: 'medium'
      });
      
      setShowUploadModal(false);
      alert('Flashcard salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar flashcard:', error);
      alert('Erro ao salvar flashcard');
    }
  };

  const removeImage = (imageId, type) => {
    if (type === 'questao') {
      setNewQuestion(prev => ({
        ...prev,
        images: prev.images.filter(img => img.id !== imageId)
      }));
    } else {
      setNewFlashcard(prev => ({
        ...prev,
        images: prev.images.filter(img => img.id !== imageId)
      }));
    }
  };

  const removeAttachment = (attachmentId) => {
    setNewQuestion(prev => ({
      ...prev,
      attachments: prev.attachments.filter(att => att.id !== attachmentId)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-promd-navy dark:text-white">
              Dashboard Administrativo
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              Gerencie conteúdo, questões e flashcards
            </p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-promd-navy text-white px-6 py-3 rounded-lg hover:bg-promd-navy/90 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Adicionar Conteúdo
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg mb-8">
          <div className="border-b border-slate-200 dark:border-slate-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'questoes', name: 'Questões', icon: FileText },
                { id: 'flashcards', name: 'Flashcards', icon: Edit },
                { id: 'estatisticas', name: 'Estatísticas', icon: Upload }
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'border-promd-navy text-promd-navy'
                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'questoes' && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Questões Cadastradas
                </h3>
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-8 text-center">
                  <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">
                    Nenhuma questão cadastrada ainda
                  </p>
                  <button
                    onClick={() => {
                      setUploadType('questao');
                      setShowUploadModal(true);
                    }}
                    className="mt-4 bg-promd-navy text-white px-4 py-2 rounded-lg hover:bg-promd-navy/90 transition-colors"
                  >
                    Adicionar Primeira Questão
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'flashcards' && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Flashcards Cadastrados
                </h3>
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-8 text-center">
                  <Edit className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">
                    Nenhum flashcard cadastrado ainda
                  </p>
                  <button
                    onClick={() => {
                      setUploadType('flashcard');
                      setShowUploadModal(true);
                    }}
                    className="mt-4 bg-promd-navy text-white px-4 py-2 rounded-lg hover:bg-promd-navy/90 transition-colors"
                  >
                    Adicionar Primeiro Flashcard
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'estatisticas' && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Estatísticas da Plataforma
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
                    <h4 className="text-lg font-semibold mb-2">Total de Questões</h4>
                    <p className="text-3xl font-bold">11</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
                    <h4 className="text-lg font-semibold mb-2">Total de Flashcards</h4>
                    <p className="text-3xl font-bold">0</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
                    <h4 className="text-lg font-semibold mb-2">Usuários Ativos</h4>
                    <p className="text-3xl font-bold">1</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal de Upload */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {uploadType === 'questao' ? 'Adicionar Nova Questão' : 'Adicionar Novo Flashcard'}
                </h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                {uploadType === 'questao' ? (
                  <div className="space-y-6">
                    {/* Disciplina */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Disciplina
                      </label>
                      <select
                        value={newQuestion.discipline}
                        onChange={(e) => setNewQuestion(prev => ({ ...prev, discipline: e.target.value }))}
                        className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      >
                        <option value="">Selecione uma disciplina</option>
                        {disciplines.map(discipline => (
                          <option key={discipline} value={discipline}>{discipline}</option>
                        ))}
                      </select>
                    </div>

                    {/* Texto da questão */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Texto da Questão
                      </label>
                      <textarea
                        value={newQuestion.questionText}
                        onChange={(e) => setNewQuestion(prev => ({ ...prev, questionText: e.target.value }))}
                        rows={4}
                        className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                        placeholder="Digite o texto da questão..."
                      />
                    </div>

                    {/* Alternativas */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
                        Alternativas
                      </label>
                      {newQuestion.options.map((option, index) => (
                        <div key={option.letter} className="mb-4 p-4 border border-slate-200 dark:border-slate-600 rounded-lg">
                          <div className="flex items-center gap-3 mb-3">
                            <input
                              type="radio"
                              name="correctAnswer"
                              checked={option.isCorrect}
                              onChange={() => handleCorrectAnswer(index)}
                              className="text-promd-navy"
                            />
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {option.letter})
                            </span>
                            <input
                              type="text"
                              value={option.text}
                              onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                              className="flex-1 border border-slate-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                              placeholder="Texto da alternativa"
                            />
                          </div>
                          <textarea
                            value={option.explanation}
                            onChange={(e) => handleOptionChange(index, 'explanation', e.target.value)}
                            rows={2}
                            className="w-full border border-slate-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                            placeholder="Justificativa para esta alternativa..."
                          />
                        </div>
                      ))}
                    </div>

                    {/* Upload de imagens */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Imagens
                      </label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'questao')}
                        className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      />
                      {newQuestion.images.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                          {newQuestion.images.map(image => (
                            <div key={image.id} className="relative">
                              <img
                                src={image.url}
                                alt={image.name}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <button
                                onClick={() => removeImage(image.id, 'questao')}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Upload de anexos */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Anexos (PDF, DOC, etc.)
                      </label>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleAttachmentUpload}
                        className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      />
                      {newQuestion.attachments.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {newQuestion.attachments.map(attachment => (
                            <div key={attachment.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                              <span className="text-sm text-slate-700 dark:text-slate-300">
                                {attachment.name}
                              </span>
                              <button
                                onClick={() => removeAttachment(attachment.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Flashcard form */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Disciplina
                      </label>
                      <select
                        value={newFlashcard.discipline}
                        onChange={(e) => setNewFlashcard(prev => ({ ...prev, discipline: e.target.value }))}
                        className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      >
                        <option value="">Selecione uma disciplina</option>
                        {disciplines.map(discipline => (
                          <option key={discipline} value={discipline}>{discipline}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Frente do Card
                      </label>
                      <textarea
                        value={newFlashcard.front}
                        onChange={(e) => setNewFlashcard(prev => ({ ...prev, front: e.target.value }))}
                        rows={3}
                        className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                        placeholder="Pergunta ou conceito..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Verso do Card
                      </label>
                      <textarea
                        value={newFlashcard.back}
                        onChange={(e) => setNewFlashcard(prev => ({ ...prev, back: e.target.value }))}
                        rows={4}
                        className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                        placeholder="Resposta ou explicação..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Dificuldade
                      </label>
                      <select
                        value={newFlashcard.difficulty}
                        onChange={(e) => setNewFlashcard(prev => ({ ...prev, difficulty: e.target.value }))}
                        className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      >
                        <option value="easy">Fácil</option>
                        <option value="medium">Médio</option>
                        <option value="hard">Difícil</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Imagens
                      </label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'flashcard')}
                        className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      />
                      {newFlashcard.images.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                          {newFlashcard.images.map(image => (
                            <div key={image.id} className="relative">
                              <img
                                src={image.url}
                                alt={image.name}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <button
                                onClick={() => removeImage(image.id, 'flashcard')}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Botões */}
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={uploadType === 'questao' ? saveQuestion : saveFlashcard}
                    className="px-6 py-2 bg-promd-navy text-white rounded-lg hover:bg-promd-navy/90 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Salvar {uploadType === 'questao' ? 'Questão' : 'Flashcard'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

