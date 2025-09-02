import { useState } from 'react'
import { useFlashcards } from '../hooks/useFlashcards'
import { FlashcardCard } from '../components/flashcards/FlashcardCard'
import { FlashcardForm } from '../components/flashcards/FlashcardForm'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent } from '../components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog'
import { Plus, Search, BookOpen, Database } from 'lucide-react'

export const Flashcards = () => {
  const { flashcards, loading, createFlashcard, updateFlashcard, deleteFlashcard } = useFlashcards()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingFlashcard, setEditingFlashcard] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [formLoading, setFormLoading] = useState(false)

  const filteredFlashcards = flashcards.filter(flashcard =>
    flashcard.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flashcard.description?.toLowerCase().includes(searchQuery.toLowerCase())
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
      console.error('Erro ao atualizar flashcard:', err)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteFlashcard = async (flashcard) => {
    if (window.confirm(`Tem certeza que deseja excluir "${flashcard.title}"?`)) {
      await deleteFlashcard(flashcard.id)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Flashcards</h1>
          <p className="text-muted-foreground">
            Gerencie seus flashcards de estudo
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Indicador de banco real */}
          <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            <Database className="h-4 w-4" />
            Banco Real Conectado
          </div>
          
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Flashcard
          </Button>
        </div>
      </div>

      {/* Busca */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar flashcards..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Lista de flashcards */}
      {filteredFlashcards.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFlashcards.map((flashcard) => (
            <FlashcardCard
              key={flashcard.id}
              flashcard={flashcard}
              onEdit={openEditForm}
              onDelete={handleDeleteFlashcard}
              onStudy={() => {/* Implementar navegação para estudo */}}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? 'Nenhum flashcard encontrado' : 'Nenhum flashcard criado'}
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchQuery 
                ? 'Tente ajustar sua busca ou criar um novo flashcard'
                : 'Comece criando seu primeiro flashcard de estudo'
              }
            </p>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Flashcard
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modal de formulário */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingFlashcard ? 'Editar Flashcard' : 'Novo Flashcard'}
            </DialogTitle>
          </DialogHeader>
          
          {/* Formulário com banco real */}
          <FlashcardForm
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

