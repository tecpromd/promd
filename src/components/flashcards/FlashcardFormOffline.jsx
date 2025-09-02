import { useState, useEffect } from 'react'
import { useDisciplinesOffline } from '../../hooks/useDisciplinesOffline'
import { useContentsOffline } from '../../hooks/useContentsOffline'
import { saveFlashcard, uploadFile } from '../../data/mockData'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Switch } from '../ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Alert, AlertDescription } from '../ui/alert'
import { Badge } from '../ui/badge'
import { X, Upload, CheckCircle } from 'lucide-react'

const DIFFICULTY_OPTIONS = [
  { value: 'iniciante', label: 'Iniciante', color: 'bg-green-500' },
  { value: 'intermediario', label: 'Intermediário', color: 'bg-blue-500' },
  { value: 'avancado', label: 'Avançado', color: 'bg-orange-500' },
  { value: 'expert', label: 'Expert', color: 'bg-red-500' }
]

export const FlashcardFormOffline = ({ flashcard, onSubmit, onCancel, loading }) => {
  const { disciplines } = useDisciplinesOffline()
  const { getContentsByDiscipline } = useContentsOffline()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    question: '',
    answer: '',
    justification: '',
    content_id: '',
    difficulty: 'intermediario',
    type: 'text',
    tags: [],
    is_public: false
  })
  
  const [selectedDiscipline, setSelectedDiscipline] = useState('')
  const [availableContents, setAvailableContents] = useState([])
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [newTag, setNewTag] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Carregar conteúdos quando disciplina for selecionada
  useEffect(() => {
    if (selectedDiscipline) {
      loadContentsByDiscipline(selectedDiscipline)
    } else {
      setAvailableContents([])
    }
  }, [selectedDiscipline])

  const loadContentsByDiscipline = async (disciplineId) => {
    const { data, error } = await getContentsByDiscipline(disciplineId)
    if (!error) {
      setAvailableContents(data)
    }
  }

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files)
    
    for (const file of files) {
      if (uploadedFiles.length >= 5) {
        setError('Máximo de 5 arquivos permitidos')
        break
      }
      
      try {
        const uploadedFile = await uploadFile(file)
        setUploadedFiles(prev => [...prev, uploadedFile])
      } catch (err) {
        setError('Erro ao fazer upload do arquivo: ' + file.name)
      }
    }
  }

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsSubmitting(true)

    // Validações
    if (!formData.title.trim()) {
      setError('Título é obrigatório')
      setIsSubmitting(false)
      return
    }

    if (!formData.content_id) {
      setError('Selecione um conteúdo')
      setIsSubmitting(false)
      return
    }

    try {
      // Determinar tipo baseado nos arquivos
      let type = 'text'
      if (uploadedFiles.length > 0) {
        const hasImages = uploadedFiles.some(file => file.type.startsWith('image/'))
        const hasPdfs = uploadedFiles.some(file => file.type === 'application/pdf')
        
        if (hasImages && hasPdfs) {
          type = 'mixed'
        } else if (hasImages) {
          type = 'image'
        } else if (hasPdfs) {
          type = 'pdf'
        }
      }

      const flashcardData = {
        ...formData,
        type,
        tags: formData.tags.length > 0 ? formData.tags : null,
        files: uploadedFiles
      }

      const savedFlashcard = await saveFlashcard(flashcardData)
      
      setSuccess('✅ Flashcard criado com sucesso!')
      
      // Limpar formulário após 2 segundos
      setTimeout(() => {
        setFormData({
          title: '',
          description: '',
          question: '',
          answer: '',
          justification: '',
          content_id: '',
          difficulty: 'intermediario',
          type: 'text',
          tags: [],
          is_public: false
        })
        setSelectedDiscipline('')
        setUploadedFiles([])
        setSuccess('')
        
        if (onSubmit) {
          onSubmit(savedFlashcard)
        }
      }, 2000)
      
    } catch (err) {
      setError('Erro ao salvar flashcard: ' + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Informações básicas */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
          <CardDescription>
            Dados principais do flashcard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Interpretação de ECG - Arritmias"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Breve descrição do flashcard"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discipline">Disciplina *</Label>
              <Select value={selectedDiscipline} onValueChange={setSelectedDiscipline}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma disciplina" />
                </SelectTrigger>
                <SelectContent>
                  {disciplines.map(discipline => (
                    <SelectItem key={discipline.id} value={discipline.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: discipline.color }}
                        />
                        {discipline.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Conteúdo *</Label>
              <Select 
                value={formData.content_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, content_id: value }))}
                disabled={!selectedDiscipline}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um conteúdo" />
                </SelectTrigger>
                <SelectContent>
                  {availableContents.map(content => (
                    <SelectItem key={content.id} value={content.id}>
                      {content.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty">Dificuldade</Label>
            <Select 
              value={formData.difficulty} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTY_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${option.color}`} />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Conteúdo do flashcard */}
      <Card>
        <CardHeader>
          <CardTitle>Conteúdo</CardTitle>
          <CardDescription>
            Pergunta e resposta do flashcard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">Pergunta</Label>
            <Textarea
              id="question"
              value={formData.question}
              onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
              placeholder="Qual é a pergunta deste flashcard?"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="answer">Resposta</Label>
            <Textarea
              id="answer"
              value={formData.answer}
              onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
              placeholder="Qual é a resposta correta?"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="justification">Justificativa da Resposta</Label>
            <Textarea
              id="justification"
              value={formData.justification}
              onChange={(e) => setFormData(prev => ({ ...prev, justification: e.target.value }))}
              placeholder="Explique por que esta é a resposta correta. Inclua conceitos importantes, diagnósticos diferenciais, etc."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Upload de arquivos */}
      <Card>
        <CardHeader>
          <CardTitle>Arquivos</CardTitle>
          <CardDescription>
            Adicione imagens, PDFs ou outros arquivos de apoio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    Arraste arquivos aqui ou clique para selecionar
                  </span>
                  <span className="mt-1 block text-xs text-gray-500">
                    Máximo 5 arquivos • PNG, JPG, PDF, DOC • Até 10MB cada
                  </span>
                </label>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                />
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Arquivos carregados:</h4>
                {uploadedFiles.map(file => (
                  <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tags e configurações */}
      <Card>
        <CardHeader>
          <CardTitle>Tags e Configurações</CardTitle>
          <CardDescription>
            Organize e configure a visibilidade do flashcard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite uma tag e pressione Enter"
              />
              <Button type="button" onClick={addTag} variant="outline">
                Adicionar
              </Button>
            </div>
            
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_public"
              checked={formData.is_public}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_public: checked }))}
            />
            <Label htmlFor="is_public">Tornar público</Label>
          </div>
        </CardContent>
      </Card>

      {/* Botões de ação */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Criar Flashcard'}
        </Button>
      </div>
    </form>
  )
}

