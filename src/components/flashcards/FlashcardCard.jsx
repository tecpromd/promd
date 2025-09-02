import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { 
  Heart, 
  Eye, 
  Edit, 
  Trash2, 
  Play, 
  Image, 
  FileText, 
  File,
  Clock,
  User
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const DIFFICULTY_CONFIG = {
  iniciante: { label: 'Iniciante', color: 'bg-green-500', textColor: 'text-green-700' },
  intermediario: { label: 'Intermediário', color: 'bg-blue-500', textColor: 'text-blue-700' },
  avancado: { label: 'Avançado', color: 'bg-orange-500', textColor: 'text-orange-700' },
  expert: { label: 'Expert', color: 'bg-red-500', textColor: 'text-red-700' }
}

export const FlashcardCard = ({ 
  flashcard, 
  onEdit, 
  onDelete, 
  onStudy, 
  onToggleFavorite,
  isFavorited = false,
  showActions = true 
}) => {
  const { user, isAdmin } = useAuth()
  const [isFlipped, setIsFlipped] = useState(false)
  const [imageError, setImageError] = useState(false)

  const canEdit = user && (user.id === flashcard.user_id || isAdmin)
  const difficultyConfig = DIFFICULTY_CONFIG[flashcard.difficulty] || DIFFICULTY_CONFIG.intermediario

  const getFileIcon = (mimeType) => {
    if (mimeType?.startsWith('image/')) {
      return <Image className="h-4 w-4" />
    } else if (mimeType === 'application/pdf') {
      return <FileText className="h-4 w-4" />
    } else {
      return <File className="h-4 w-4" />
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getFirstImage = () => {
    return flashcard.files?.find(file => file.mime_type?.startsWith('image/'))
  }

  const firstImage = getFirstImage()

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
      {/* Header com informações básicas */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                variant="secondary"
                className={`${difficultyConfig.color} text-white`}
              >
                {difficultyConfig.label}
              </Badge>
              
              {flashcard.content && (
                <Badge variant="outline" className="text-xs">
                  {flashcard.content.title}
                </Badge>
              )}
            </div>
            
            <CardTitle className="text-lg line-clamp-2 mb-1">
              {flashcard.title}
            </CardTitle>
            
            {flashcard.description && (
              <CardDescription className="line-clamp-2">
                {flashcard.description}
              </CardDescription>
            )}
          </div>

          {/* Ações rápidas */}
          {showActions && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {canEdit && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit?.(flashcard)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete?.(flashcard)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Imagem de preview */}
        {firstImage && !imageError && (
          <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
            <img
              src={firstImage.file_url}
              alt={flashcard.title}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
            {flashcard.files.length > 1 && (
              <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                +{flashcard.files.length - 1}
              </Badge>
            )}
          </div>
        )}

        {/* Pergunta/Resposta */}
        {(flashcard.question || flashcard.answer) && (
          <div 
            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 cursor-pointer transition-all"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                {isFlipped ? 'Resposta' : 'Pergunta'}
              </span>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-sm">
              {isFlipped ? flashcard.answer : flashcard.question}
            </p>
            
            {!isFlipped && flashcard.question && (
              <p className="text-xs text-muted-foreground mt-2">
                Clique para ver a resposta
              </p>
            )}
          </div>
        )}

        {/* Arquivos anexados */}
        {flashcard.files && flashcard.files.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Arquivos ({flashcard.files.length})</h4>
            <div className="flex flex-wrap gap-2">
              {flashcard.files.slice(0, 3).map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded px-2 py-1 text-xs"
                >
                  {getFileIcon(file.mime_type)}
                  <span className="truncate max-w-[100px]">
                    {file.file_name}
                  </span>
                </div>
              ))}
              {flashcard.files.length > 3 && (
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded px-2 py-1 text-xs">
                  <File className="h-4 w-4" />
                  <span>+{flashcard.files.length - 3}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {flashcard.tags && flashcard.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {flashcard.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {flashcard.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{flashcard.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Footer com estatísticas e ações */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{flashcard.views_count || 0}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatDate(flashcard.created_at)}</span>
            </div>

            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span className="text-xs">
                {flashcard.user_id === user?.id ? 'Você' : 'Outro usuário'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleFavorite?.(flashcard.id)}
                className={isFavorited ? 'text-red-600' : ''}
              >
                <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
              </Button>
            )}
            
            <Button
              variant="default"
              size="sm"
              onClick={() => onStudy?.(flashcard)}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
            >
              <Play className="h-4 w-4 mr-1" />
              Estudar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

