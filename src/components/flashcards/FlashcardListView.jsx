import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import ImageZoom from '../ImageZoom';
import { Edit, Trash2, BookOpen, Clock, Target } from 'lucide-react';

const FlashcardListView = ({ 
  flashcards, 
  onEdit, 
  onDelete, 
  onStudy,
  showActions = true 
}) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 1:
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 2:
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 3:
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 1:
      case 'easy':
        return 'Fácil';
      case 2:
      case 'medium':
        return 'Médio';
      case 3:
      case 'hard':
        return 'Difícil';
      default:
        return 'N/A';
    }
  };

  return (
    <div className="space-y-4">
      {flashcards.map((flashcard, index) => (
        <Card key={flashcard.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              {/* Imagem do flashcard */}
              {flashcard.image_url && (
                <div className="flex-shrink-0 w-24 h-24">
                  <ImageZoom 
                    src={flashcard.image_url} 
                    alt={flashcard.title || 'Imagem do flashcard'}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Conteúdo principal */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {flashcard.title || `Flashcard #${index + 1}`}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {flashcard.question || flashcard.content || 'Sem descrição'}
                    </p>
                  </div>
                  
                  {/* Ações */}
                  {showActions && (
                    <div className="flex items-center gap-2 ml-4">
                      {onStudy && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onStudy(flashcard)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <BookOpen className="h-4 w-4 mr-1" />
                          Estudar
                        </Button>
                      )}
                      {onEdit && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(flashcard)}
                          className="text-orange-600 border-orange-200 hover:bg-orange-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete(flashcard.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {/* Metadados */}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    <Badge className={getDifficultyColor(flashcard.difficulty || flashcard.difficulty_level)}>
                      {getDifficultyText(flashcard.difficulty || flashcard.difficulty_level)}
                    </Badge>
                  </div>
                  
                  {flashcard.discipline && (
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{flashcard.discipline}</span>
                    </div>
                  )}
                  
                  {flashcard.user_progress?.[0]?.last_studied && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        Estudado em {new Date(flashcard.user_progress[0].last_studied).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  )}
                  
                  {flashcard.views_count && (
                    <span>{flashcard.views_count} visualizações</span>
                  )}
                </div>

                {/* Tags */}
                {flashcard.tags && flashcard.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {flashcard.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FlashcardListView;

