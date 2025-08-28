import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Card, CardContent } from '../ui/card'
import { Upload, X, FileText } from 'lucide-react'

const disciplinas = [
  { id: 1, name: 'Cardiologia', color: '#ef4444' },
  { id: 2, name: 'Pneumologia', color: '#3b82f6' },
  { id: 3, name: 'Neurologia', color: '#8b5cf6' },
  { id: 4, name: 'Gastroenterologia', color: '#f59e0b' },
  { id: 5, name: 'Endocrinologia', color: '#10b981' },
  { id: 6, name: 'Infectologia', color: '#ef4444' },
  { id: 7, name: 'Nefrologia', color: '#06b6d4' },
  { id: 8, name: 'Hematologia', color: '#dc2626' },
  { id: 9, name: 'Reumatologia', color: '#ea580c' },
  { id: 10, name: 'Dermatologia', color: '#84cc16' },
  { id: 11, name: 'Psiquiatria', color: '#6366f1' },
  { id: 12, name: 'Oftalmologia', color: '#8b5cf6' },
  { id: 13, name: 'Otorrinolaringologia', color: '#06b6d4' },
  { id: 14, name: 'Urologia', color: '#0ea5e9' },
  { id: 15, name: 'Ginecologia', color: '#ec4899' }
]

const conteudosPorDisciplina = {
  1: ['Eletrocardiografia', 'Arritmias', 'Insuficiência Cardíaca', 'Hipertensão'],
  2: ['Radiologia Torácica', 'Asma', 'DPOC', 'Pneumonia'],
  3: ['Neuroimagem', 'AVC', 'Epilepsia', 'Demências'],
  4: ['Endoscopia', 'Hepatologia', 'Doenças Inflamatórias', 'Parasitoses'],
  5: ['Diabetes', 'Tireoide', 'Obesidade', 'Distúrbios Hormonais']
}

export const FlashcardFormLocal = ({ flashcard, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    title: flashcard?.title || '',
    description: flashcard?.description || '',
    discipline_id: flashcard?.discipline_id || '',
    content_id: flashcard?.content_id || '',
    difficulty: flashcard?.difficulty || 'intermediario',
    question: flashcard?.question || '',
    answer: flashcard?.answer || '',
    justification: flashcard?.justification || '',
    tags: flashcard?.tags || [],
    is_public: flashcard?.is_public || false
  })

  const [files, setFiles] = useState([])
  const [newTag, setNewTag] = useState('')

  const selectedDiscipline = disciplinas.find(d => d.id.toString() === formData.discipline_id)
  const availableContents = conteudosPorDisciplina[parseInt(formData.discipline_id)] || []

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (event) => {
    const selectedFiles = Array.from(event.target.files)
    
    selectedFiles.forEach(file => {
      // Validar tipo de arquivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
      if (!allowedTypes.includes(file.type)) {
        alert(`Arquivo ${file.name} não é suportado. Use JPG, PNG, GIF, WEBP ou PDF.`)
        return
      }

      // Validar tamanho (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`Arquivo ${file.name} é muito grande. Máximo 10MB.`)
        return
      }

      // Criar preview usando FileReader
      const reader = new FileReader()
      reader.onload = (e) => {
        const newFile = {
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          url: e.target.result, // Base64 data URL
          originalFile: file
        }
        setFiles(prev => [...prev, newFile])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleInputChange('tags', [...formData.tags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validação básica
    if (!formData.title || !formData.discipline_id || !formData.question || !formData.answer) {
      alert('Por favor, preencha todos os campos obrigatórios')
      return
    }

    // Preparar dados com arquivos
    const flashcardData = {
      ...formData,
      files: files.map(file => ({
        name: file.name,
        url: file.url,
        type: file.type,
        size: file.size
      }))
    }

    try {
      await onSubmit(flashcardData)
    } catch (error) {
      console.error('Erro ao salvar flashcard:', error)
      alert('Erro ao salvar flashcard. Tente novamente.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações Básicas */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Informações Básicas</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Título *</label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Ex: Interpretação de ECG - Arritmias"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Descrição</label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Breve descrição do flashcard"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Disciplina *</label>
                <Select value={formData.discipline_id} onValueChange={(value) => handleInputChange('discipline_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma disciplina" />
                  </SelectTrigger>
                  <SelectContent>
                    {disciplinas.map(disciplina => (
                      <SelectItem key={disciplina.id} value={disciplina.id.toString()}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: disciplina.color }}
                          />
                          {disciplina.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Conteúdo *</label>
                <Select 
                  value={formData.content_id} 
                  onValueChange={(value) => handleInputChange('content_id', value)}
                  disabled={!formData.discipline_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um conteúdo" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableContents.map((content, index) => (
                      <SelectItem key={index} value={content}>
                        {content}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Dificuldade</label>
              <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facil">Fácil</SelectItem>
                  <SelectItem value="intermediario">Intermediário</SelectItem>
                  <SelectItem value="dificil">Difícil</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conteúdo */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Conteúdo</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Pergunta</label>
              <Textarea
                value={formData.question}
                onChange={(e) => handleInputChange('question', e.target.value)}
                placeholder="Qual é a pergunta deste flashcard?"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Resposta</label>
              <Textarea
                value={formData.answer}
                onChange={(e) => handleInputChange('answer', e.target.value)}
                placeholder="Resposta correta"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Justificativa da Resposta</label>
              <Textarea
                value={formData.justification}
                onChange={(e) => handleInputChange('justification', e.target.value)}
                placeholder="Explique detalhadamente por que esta é a resposta correta..."
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Por que as outras alternativas estão erradas? (Opcional)</label>
              <Textarea
                value={formData.wrongAnswersExplanation || ''}
                onChange={(e) => handleInputChange('wrongAnswersExplanation', e.target.value)}
                placeholder="Explique por que cada alternativa incorreta está errada..."
                rows={4}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload de Arquivos */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Arquivos</h3>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              Arraste arquivos aqui ou clique para selecionar
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Máximo 5 arquivos • PNG, JPG, PDF, DOC • Até 10MB cada
            </p>
            <input
              type="file"
              multiple
              accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <Button type="button" variant="outline" onClick={() => document.getElementById('file-upload').click()}>
              Selecionar Arquivos
            </Button>
          </div>

          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map(file => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                  <div className="flex items-center gap-3">
                    {/* Preview da imagem */}
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
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Tags e Configurações</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Digite uma tag e pressione Enter"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag}>Adicionar</Button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-blue-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_public"
                checked={formData.is_public}
                onChange={(e) => handleInputChange('is_public', e.target.checked)}
              />
              <label htmlFor="is_public" className="text-sm">Tornar público</label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botões */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : (flashcard ? 'Atualizar' : 'Criar Flashcard')}
        </Button>
      </div>
    </form>
  )
}

