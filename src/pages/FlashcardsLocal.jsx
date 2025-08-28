import { useState } from 'react'
import { useFlashcardsLocal } from '../hooks/useFlashcardsLocal'
import { FlashcardFormLocal } from '../components/flashcards/FlashcardFormLocal'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent } from '../components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog'
import { Plus, Search, BookOpen, HardDrive, Trash2, Edit } from 'lucide-react'

export const FlashcardsLocal = () => {
  const { flashcards, loading, createFlashcard, updateFlashcard, deleteFlashcard } = useFlashcardsLocal()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingFlashcard, setEditingFlashcard] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [formLoading, setFormLoading] = useState(false)

  const filteredFlashcards = flashcards.filter(flashcard =>
    flashcard.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flashcard.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flashcard.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flashcard.answer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flashcard.justification?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateFlashcard = async (flashcardData, files) => {
    setFormLoading(true)
    try {
      const { error } = await createFlashcard(flashcardData)
      if (!error) {
        setIsFormOpen(false)
        setEditingFlashcard(null)
      }
    } catch (err) {
      console.error('Erro ao criar flashcard:', err)
    } finally {
      setFormLoading(false)
    }
  }

  const handleEditFlashcard = async (flashcardData, files) => {
    setFormLoading(true)
    try {
      const { error } = await updateFlashcard(editingFlashcard.id, flashcardData)
      if (!error) {
        setIsFormOpen(false)
        setEditingFlashcard(null)
      }
    } catch (err) {
      console.error('Erro ao editar flashcard:', err)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteFlashcard = async (id) => {
    if (confirm('Tem certeza que deseja excluir este flashcard?')) {
      await deleteFlashcard(id)
    }
  }

  const openEditForm = (flashcard) => {
    setEditingFlashcard(flashcard)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingFlashcard(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Flashcards</h1>
          <p className="text-muted-foreground">
            Gerencie seus flashcards de estudo
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Indicador de armazenamento local */}
          <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
            <HardDrive className="h-4 w-4" />
            Armazenamento Local
          </div>
          
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Flashcard
          </Button>
        </div>
      </div>

      {/* Busca */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar flashcards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Lista de Flashcards */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Carregando flashcards...</p>
          </div>
        ) : filteredFlashcards.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery ? 'Nenhum flashcard encontrado' : 'Nenhum flashcard criado'}
              </h3>
              <p className="text-gray-600 text-center mb-4">
                {searchQuery 
                  ? 'Tente ajustar sua busca ou criar um novo flashcard.'
                  : 'Comece criando seu primeiro flashcard de estudo.'
                }
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsFormOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeiro Flashcard
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredFlashcards.map(flashcard => (
            <Card key={flashcard.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{flashcard.title}</h3>
                    {flashcard.description && (
                      <p className="text-gray-600 mb-3">{flashcard.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Dificuldade: {flashcard.difficulty}</span>
                      {flashcard.tags && flashcard.tags.length > 0 && (
                        <div className="flex gap-1">
                          {flashcard.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                          {flashcard.tags.length > 3 && (
                            <span className="text-xs">+{flashcard.tags.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditForm(flashcard)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteFlashcard(flashcard.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal de formulário */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingFlashcard ? 'Editar Flashcard' : 'Novo Flashcard'}
            </DialogTitle>
          </DialogHeader>
          
          <FlashcardFormLocal
            flashcard={editingFlashcard}
            onSubmit={editingFlashcard ? handleEditFlashcard : handleCreateFlashcard}
            onCancel={closeForm}
            loading={formLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

