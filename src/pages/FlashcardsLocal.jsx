import React, { useState } from 'react'
import { useFlashcards } from '../hooks/useFlashcards'
import { useLanguage } from '../contexts/LanguageContext'
import { FlashcardFormLocal } from '../components/flashcards/FlashcardFormLocal'
import FlashcardGridView from '../components/flashcards/FlashcardGridView'
import FlashcardListView from '../components/flashcards/FlashcardListView'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent } from '../components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog'
import { Plus, Search, BookOpen, HardDrive, Trash2, Edit, Star, RotateCcw, Grid3X3, List } from 'lucide-react'

export const FlashcardsLocal = () => {
  const { flashcards, loading, createFlashcard, updateFlashcard, deleteFlashcard, updateFlashcardImage } = useFlashcards()
  const { t } = useLanguage()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingFlashcard, setEditingFlashcard] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' ou 'list'

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
    if (window.confirm('Tem certeza que deseja excluir este flashcard?')) {
      await deleteFlashcard(id)
    }
  }

  const handleImageUpdate = async (flashcardId, imageUrl) => {
    try {
      const { error } = await updateFlashcardImage(flashcardId, imageUrl)
      if (error) {
        console.error('Erro ao atualizar imagem:', error)
        alert('Erro ao atualizar imagem. Tente novamente.')
      }
    } catch (err) {
      console.error('Erro ao atualizar imagem:', err)
      alert('Erro ao atualizar imagem. Tente novamente.')
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

  const handleDifficultyRating = (flashcardId, difficulty) => {
    console.log(`Flashcard ${flashcardId} avaliado como: ${difficulty}`)
    // Aqui você pode implementar a lógica de repetição espaçada
  }

  const handleImageClick = (imageUrl) => {
    // Abrir imagem em modal ou nova aba
    window.open(imageUrl, '_blank')
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

      {/* Busca e controles */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar flashcards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Toggle de visualização */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="h-8 w-8 p-0"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="h-8 w-8 p-0"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Lista de Flashcards */}
      <div>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando flashcards...</p>
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
                  : 'Comece criando seu primeiro flashcard para estudar.'
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
        ) : viewMode === 'grid' ? (
          <FlashcardGridView
            flashcards={filteredFlashcards}
            onEdit={openEditForm}
            onDelete={handleDeleteFlashcard}
            onImageUpdate={handleImageUpdate}
            showImageUpload={true}
            showActions={true}
          />
        ) : (
          <FlashcardListView
            flashcards={filteredFlashcards}
            onEdit={openEditForm}
            onDelete={handleDeleteFlashcard}
            showActions={true}
          />
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

