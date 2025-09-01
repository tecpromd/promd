import React from 'react';
import FlashCardWithImage from './FlashCardWithImage';
import { Button } from '../ui/button';
import { Edit, Trash2 } from 'lucide-react';

const FlashcardGridView = ({ 
  flashcards, 
  onEdit, 
  onDelete, 
  onImageUpdate,
  showImageUpload = false,
  showActions = true 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {flashcards.map((flashcard, index) => (
        <div key={flashcard.id} className="relative group">
          <FlashCardWithImage
            flashcard={flashcard}
            index={index}
            onImageUpdate={onImageUpdate}
            showImageUpload={showImageUpload}
          />
          
          {/* Botões de ação */}
          {showActions && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit(flashcard)
                  }}
                  className="bg-white/90 text-orange-600 border-orange-200 hover:bg-orange-50 h-8 w-8 p-0"
                >
                  <Edit className="h-3 w-3" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(flashcard.id)
                  }}
                  className="bg-white/90 text-red-600 border-red-200 hover:bg-red-50 h-8 w-8 p-0"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FlashcardGridView;

