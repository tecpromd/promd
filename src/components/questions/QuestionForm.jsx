import React, { useState } from 'react';
import { useQuestions } from '../../hooks/useQuestions';
import { useDisciplinesOffline } from '../../hooks/useDisciplinesOffline';
import { useContentsOffline } from '../../hooks/useContentsOffline';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Plus, Trash2, Upload, FileText } from 'lucide-react';

const QuestionForm = ({ onSuccess, onCancel }) => {
  const { createQuestion, loading } = useQuestions();
  const { disciplines } = useDisciplinesOffline();
  const { getContentsByDiscipline } = useContentsOffline();

  const [formData, setFormData] = useState({
    title: '',
    statement: '',
    discipline_id: '',
    content_id: '',
    type: 'multiple_choice',
    difficulty: 'Intermediário',
    alternatives: [
      { id: 'A', text: '', isCorrect: false },
      { id: 'B', text: '', isCorrect: false },
      { id: 'C', text: '', isCorrect: false },
      { id: 'D', text: '', isCorrect: false },
      { id: 'E', text: '', isCorrect: false }
    ],
    explanation: '',
    wrongAnswersExplanation: '',
    tags: '',
    source: '',
    year: '',
    is_public: true
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [availableContents, setAvailableContents] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Atualizar conteúdos quando disciplina muda
  const handleDisciplineChange = (disciplineId) => {
    setFormData(prev => ({ ...prev, discipline_id: disciplineId, content_id: '' }));
    const contents = getContentsByDiscipline(disciplineId);
    setAvailableContents(contents);
  };

  // Atualizar alternativa
  const updateAlternative = (index, field, value) => {
    const newAlternatives = [...formData.alternatives];
    newAlternatives[index] = { ...newAlternatives[index], [field]: value };
    setFormData(prev => ({ ...prev, alternatives: newAlternatives }));
  };

  // Marcar alternativa como correta
  const setCorrectAlternative = (index) => {
    const newAlternatives = formData.alternatives.map((alt, i) => ({
      ...alt,
      isCorrect: i === index
    }));
    setFormData(prev => ({ ...prev, alternatives: newAlternatives }));
  };

  // Adicionar alternativa
  const addAlternative = () => {
    if (formData.alternatives.length < 8) {
      const nextLetter = String.fromCharCode(65 + formData.alternatives.length);
      const newAlternatives = [...formData.alternatives, {
        id: nextLetter,
        text: '',
        isCorrect: false
      }];
      setFormData(prev => ({ ...prev, alternatives: newAlternatives }));
    }
  };

  // Remover alternativa
  const removeAlternative = (index) => {
    if (formData.alternatives.length > 2) {
      const newAlternatives = formData.alternatives.filter((_, i) => i !== index);
      // Reajustar IDs das letras
      const adjustedAlternatives = newAlternatives.map((alt, i) => ({
        ...alt,
        id: String.fromCharCode(65 + i)
      }));
      setFormData(prev => ({ ...prev, alternatives: adjustedAlternatives }));
    }
  };

  // Lidar com upload de arquivo
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      // Validar tipo de arquivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert(`Arquivo ${file.name} não é suportado. Use JPG, PNG, GIF, WEBP ou PDF.`);
        return;
      }

      // Validar tamanho (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`Arquivo ${file.name} é muito grande. Máximo 10MB.`);
        return;
      }

      // Criar preview usando FileReader
      const reader = new FileReader();
      reader.onload = (e) => {
        const newFile = {
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          url: e.target.result, // Base64 data URL
          originalFile: file
        };
        setSelectedFiles(prev => [...prev, newFile]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remover arquivo
  const removeFile = (fileId) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  // Validar formulário
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!formData.statement.trim()) {
      newErrors.statement = 'Enunciado é obrigatório';
    }

    if (!formData.discipline_id) {
      newErrors.discipline_id = 'Disciplina é obrigatória';
    }

    if (!formData.explanation.trim()) {
      newErrors.explanation = 'Explicação é obrigatória';
    }

    // Verificar se há pelo menos uma alternativa correta
    const hasCorrectAnswer = formData.alternatives.some(alt => alt.isCorrect);
    if (!hasCorrectAnswer) {
      newErrors.alternatives = 'Marque pelo menos uma alternativa como correta';
    }

    // Verificar se todas as alternativas têm texto
    const emptyAlternatives = formData.alternatives.filter(alt => !alt.text.trim());
    if (emptyAlternatives.length > 0) {
      newErrors.alternatives = 'Todas as alternativas devem ter texto';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submeter formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar dados da questão
      const questionData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        files: selectedFiles.map(file => ({
          name: file.name,
          url: file.url,
          type: file.type,
          size: file.size
        }))
      };

      // Criar questão
      const result = await createQuestion(questionData);

      if (result.error) {
        setErrors({ submit: 'Erro ao criar questão: ' + result.error });
      } else {
        // Sucesso
        if (onSuccess) {
          onSuccess(result.data);
        }
      }
    } catch (error) {
      setErrors({ submit: 'Erro inesperado: ' + error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Nova Questão <span className="text-sm text-green-600 font-normal">(Banco Local)</span>
        </h2>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-green-600">Salvamento Local</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título da Questão *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Interpretação de ECG - Fibrilação Atrial"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Questão
                </label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple_choice">Múltipla Escolha</SelectItem>
                    <SelectItem value="true_false">Verdadeiro/Falso</SelectItem>
                    <SelectItem value="case_study">Caso Clínico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Disciplina *
                </label>
                <Select value={formData.discipline_id} onValueChange={handleDisciplineChange}>
                  <SelectTrigger className={errors.discipline_id ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecione uma disciplina" />
                  </SelectTrigger>
                  <SelectContent>
                    {disciplines.map((discipline) => (
                      <SelectItem key={discipline.id} value={discipline.id}>
                        {discipline.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.discipline_id && <p className="text-red-500 text-sm mt-1">{errors.discipline_id}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conteúdo
                </label>
                <Select value={formData.content_id} onValueChange={(value) => setFormData(prev => ({ ...prev, content_id: value }))}>
                  <SelectTrigger disabled={!formData.discipline_id}>
                    <SelectValue placeholder="Selecione um conteúdo" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableContents.map((content) => (
                      <SelectItem key={content.id} value={content.id}>
                        {content.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dificuldade
                </label>
                <Select value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fácil">Fácil</SelectItem>
                    <SelectItem value="Intermediário">Intermediário</SelectItem>
                    <SelectItem value="Difícil">Difícil</SelectItem>
                    <SelectItem value="Muito Difícil">Muito Difícil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enunciado */}
        <Card>
          <CardHeader>
            <CardTitle>Enunciado da Questão</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.statement}
              onChange={(e) => setFormData(prev => ({ ...prev, statement: e.target.value }))}
              rows={6}
              placeholder="Digite o enunciado completo da questão..."
              className={errors.statement ? 'border-red-500' : ''}
            />
            {errors.statement && <p className="text-red-500 text-sm mt-1">{errors.statement}</p>}
          </CardContent>
        </Card>

        {/* Alternativas */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Alternativas</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAlternative}
                disabled={formData.alternatives.length >= 8}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.alternatives.map((alternative, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Badge variant={alternative.isCorrect ? "default" : "secondary"}>
                    {alternative.id}
                  </Badge>
                  <input
                    type="radio"
                    name="correct_answer"
                    checked={alternative.isCorrect}
                    onChange={() => setCorrectAlternative(index)}
                    className="w-4 h-4 text-green-600"
                  />
                </div>
                
                <div className="flex-1">
                  <Textarea
                    value={alternative.text}
                    onChange={(e) => updateAlternative(index, 'text', e.target.value)}
                    placeholder={`Alternativa ${alternative.id}`}
                    rows={2}
                  />
                </div>

                {formData.alternatives.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAlternative(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            {errors.alternatives && <p className="text-red-500 text-sm">{errors.alternatives}</p>}
          </CardContent>
        </Card>

        {/* Explicações */}
        <Card>
          <CardHeader>
            <CardTitle>Explicações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Explicação da Resposta Correta *
              </label>
              <Textarea
                value={formData.explanation}
                onChange={(e) => setFormData(prev => ({ ...prev, explanation: e.target.value }))}
                rows={4}
                placeholder="Explique detalhadamente por que a alternativa marcada está correta..."
                className={errors.explanation ? 'border-red-500' : ''}
              />
              {errors.explanation && <p className="text-red-500 text-sm mt-1">{errors.explanation}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Por que as outras alternativas estão erradas? (Opcional)
              </label>
              <Textarea
                value={formData.wrongAnswersExplanation}
                onChange={(e) => setFormData(prev => ({ ...prev, wrongAnswersExplanation: e.target.value }))}
                rows={4}
                placeholder="Explique por que cada alternativa incorreta está errada..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Upload de Arquivos */}
        <Card>
          <CardHeader>
            <CardTitle>Arquivos (Imagens, PDFs)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*,.pdf"
                multiple
                className="w-full"
              />
              
              {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {selectedFiles.map(file => (
                    <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                      <div className="flex items-center gap-3">
                        {file.type.startsWith('image/') && (
                          <img 
                            src={file.url} 
                            alt={file.name}
                            className="w-12 h-12 object-cover rounded border"
                          />
                        )}
                        {file.type === 'application/pdf' && (
                          <div className="w-12 h-12 bg-red-100 rounded border flex items-center justify-center">
                            <FileText className="h-6 w-6 text-red-600" />
                          </div>
                        )}
                        
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB • {file.type.split('/')[1].toUpperCase()}
                          </p>
                        </div>
                      </div>
                      
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Metadados */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Adicionais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fonte/Origem
                </label>
                <Input
                  value={formData.source}
                  onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                  placeholder="Ex: USMLE Step 1, Residência USP 2023"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ano
                </label>
                <Input
                  value={formData.year}
                  onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                  placeholder="Ex: 2023"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (separadas por vírgula)
              </label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="Ex: ECG, Arritmia, Cardiologia, Emergência"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_public"
                checked={formData.is_public}
                onChange={(e) => setFormData(prev => ({ ...prev, is_public: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_public" className="ml-2 block text-sm text-gray-700">
                Tornar pública (outros usuários podem ver)
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Erro de submissão */}
        {errors.submit && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Botões */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting || loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Criando...
              </span>
            ) : (
              'Criar Questão'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;

