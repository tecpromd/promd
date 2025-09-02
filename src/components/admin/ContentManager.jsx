import { useState, useEffect } from 'react'
import { useContents } from '../../hooks/useContents'
import { useDisciplines } from '../../hooks/useDisciplines'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Alert, AlertDescription } from '../ui/alert'
import { Badge } from '../ui/badge'
import { Plus, Edit, Trash2, BookOpen, FileText } from 'lucide-react'

export const ContentManager = () => {
  const { contents, loading, createContent, updateContent, deleteContent } = useContents()
  const { disciplines } = useDisciplines()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingContent, setEditingContent] = useState(null)
  const [selectedDiscipline, setSelectedDiscipline] = useState('all')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discipline_id: ''
  })
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState('')

  const filteredContents = selectedDiscipline === 'all' 
    ? contents 
    : contents.filter(content => content.discipline_id === selectedDiscipline)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    setError('')

    try {
      if (editingContent) {
        const { error } = await updateContent(editingContent.id, formData)
        if (error) throw error
      } else {
        const { error } = await createContent(formData)
        if (error) throw error
      }

      setIsDialogOpen(false)
      resetForm()
    } catch (err) {
      setError(err.message)
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = (content) => {
    setEditingContent(content)
    setFormData({
      title: content.title,
      description: content.description || '',
      discipline_id: content.discipline_id
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (content) => {
    if (window.confirm(`Tem certeza que deseja excluir o conteúdo "${content.title}"?`)) {
      const { error } = await deleteContent(content.id)
      if (error) {
        alert('Erro ao excluir conteúdo: ' + error.message)
      }
    }
  }

  const resetForm = () => {
    setEditingContent(null)
    setFormData({
      title: '',
      description: '',
      discipline_id: ''
    })
    setError('')
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    resetForm()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Conteúdos</h2>
          <p className="text-muted-foreground">
            Organize os conteúdos por disciplina
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Conteúdo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingContent ? 'Editar Conteúdo' : 'Novo Conteúdo'}
              </DialogTitle>
              <DialogDescription>
                {editingContent 
                  ? 'Edite as informações do conteúdo'
                  : 'Adicione um novo conteúdo à disciplina'
                }
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="discipline">Disciplina</Label>
                <Select
                  value={formData.discipline_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, discipline_id: value }))}
                  required
                >
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
                <Label htmlFor="title">Título do Conteúdo</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Eletrocardiografia Básica"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Breve descrição do conteúdo"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtro por disciplina */}
      <div className="flex items-center gap-4">
        <Label htmlFor="filter">Filtrar por disciplina:</Label>
        <Select value={selectedDiscipline} onValueChange={setSelectedDiscipline}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as disciplinas</SelectItem>
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredContents.map((content) => (
          <Card key={content.id} className="relative group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: content.discipline?.color + '20' }}
                  >
                    <FileText 
                      className="h-5 w-5" 
                      style={{ color: content.discipline?.color }}
                    />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{content.title}</CardTitle>
                    <Badge 
                      variant="secondary" 
                      className="text-xs mt-1"
                      style={{ 
                        backgroundColor: content.discipline?.color + '20',
                        color: content.discipline?.color 
                      }}
                    >
                      {content.discipline?.name}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <CardDescription className="mb-4 line-clamp-3">
                {content.description || 'Sem descrição'}
              </CardDescription>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(content)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(content)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContents.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {selectedDiscipline === 'all' 
                ? 'Nenhum conteúdo encontrado' 
                : 'Nenhum conteúdo nesta disciplina'
              }
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              {selectedDiscipline === 'all'
                ? 'Comece criando seu primeiro conteúdo'
                : 'Adicione conteúdos para esta disciplina'
              }
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeiro Conteúdo
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

