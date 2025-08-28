import { useState } from 'react'
import { useDisciplines } from '../../hooks/useDisciplines'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Alert, AlertDescription } from '../ui/alert'
import { Badge } from '../ui/badge'
import { Plus, Edit, Trash2, GripVertical, BookOpen } from 'lucide-react'

const DISCIPLINE_COLORS = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', 
  '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
]

const DISCIPLINE_ICONS = [
  'heart', 'scan', 'user', 'brain', 'bone', 'baby', 
  'stethoscope', 'pill', 'syringe', 'microscope'
]

export const DisciplineManager = () => {
  const { disciplines, loading, createDiscipline, updateDiscipline, deleteDiscipline } = useDisciplines()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDiscipline, setEditingDiscipline] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: DISCIPLINE_COLORS[0],
    icon: DISCIPLINE_ICONS[0]
  })
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    setError('')

    try {
      if (editingDiscipline) {
        const { error } = await updateDiscipline(editingDiscipline.id, formData)
        if (error) throw error
      } else {
        const { error } = await createDiscipline(formData)
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

  const handleEdit = (discipline) => {
    setEditingDiscipline(discipline)
    setFormData({
      name: discipline.name,
      description: discipline.description || '',
      color: discipline.color,
      icon: discipline.icon
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (discipline) => {
    if (window.confirm(`Tem certeza que deseja excluir a disciplina "${discipline.name}"?`)) {
      const { error } = await deleteDiscipline(discipline.id)
      if (error) {
        alert('Erro ao excluir disciplina: ' + error.message)
      }
    }
  }

  const resetForm = () => {
    setEditingDiscipline(null)
    setFormData({
      name: '',
      description: '',
      color: DISCIPLINE_COLORS[0],
      icon: DISCIPLINE_ICONS[0]
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
          <h2 className="text-2xl font-bold">Gerenciar Disciplinas</h2>
          <p className="text-muted-foreground">
            Organize as disciplinas médicas da plataforma
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Disciplina
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingDiscipline ? 'Editar Disciplina' : 'Nova Disciplina'}
              </DialogTitle>
              <DialogDescription>
                {editingDiscipline 
                  ? 'Edite as informações da disciplina'
                  : 'Adicione uma nova disciplina médica'
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
                <Label htmlFor="name">Nome da Disciplina</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Cardiologia"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Breve descrição da disciplina"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Cor</Label>
                <div className="flex gap-2 flex-wrap">
                  {DISCIPLINE_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${
                        formData.color === color ? 'border-gray-900' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Ícone</Label>
                <div className="flex gap-2 flex-wrap">
                  {DISCIPLINE_ICONS.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      className={`p-2 rounded border ${
                        formData.icon === icon 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, icon }))}
                    >
                      <BookOpen className="h-4 w-4" />
                    </button>
                  ))}
                </div>
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {disciplines.map((discipline) => (
          <Card key={discipline.id} className="relative group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: discipline.color + '20' }}
                  >
                    <BookOpen 
                      className="h-5 w-5" 
                      style={{ color: discipline.color }}
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{discipline.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {discipline.order_index + 1}º posição
                    </Badge>
                  </div>
                </div>
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
              </div>
            </CardHeader>
            
            <CardContent>
              <CardDescription className="mb-4">
                {discipline.description || 'Sem descrição'}
              </CardDescription>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(discipline)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(discipline)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {disciplines.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma disciplina encontrada</h3>
            <p className="text-muted-foreground text-center mb-4">
              Comece criando sua primeira disciplina médica
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeira Disciplina
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

