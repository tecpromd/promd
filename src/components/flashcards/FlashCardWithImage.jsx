import React, { useState } from 'react';
import ImageZoom from '../ImageZoom';
import ImageUpload from '../ImageUpload';

// Material-UI imports
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Rating,
  Tooltip,
  Paper,
  Fade
} from '@mui/material';
import {
  RotateLeft,
  Star,
  StarBorder,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';

const FlashCardWithImage = ({ 
  flashcard, 
  index, 
  onImageUpdate, 
  showImageUpload = false,
  flipped = false,
  onFlip,
  onNext,
  onPrevious,
  showNavigation = false,
  compact = false,
  onDifficultyRate
}) => {
  const [isFlipped, setIsFlipped] = useState(flipped);
  const [userRating, setUserRating] = useState(flashcard.userRating || 0);

  const handleClick = (e) => {
    // Não virar se clicou em um botão ou na área de imagem
    if (e.target.tagName === 'BUTTON' || e.target.closest('.image-area') || e.target.closest('.MuiRating-root')) return;
    
    if (onFlip) {
      onFlip();
    } else {
      setIsFlipped(!isFlipped);
    }
  };

  const handleDifficultyRating = (event, newValue) => {
    event.stopPropagation();
    setUserRating(newValue);
    
    if (onDifficultyRate) {
      onDifficultyRate(flashcard.id, newValue);
    }
    
    console.log(`Flashcard ${flashcard.id} avaliado como: ${newValue} estrelas`);
  };

  const handleImageUploaded = (imageUrl) => {
    if (onImageUpdate) {
      onImageUpdate(flashcard.id, imageUrl);
    }
  };

  const cardHeight = compact ? 300 : 400;
  const currentFlipped = onFlip ? flipped : isFlipped;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box 
      className="w-full cursor-pointer"
      style={{ perspective: '1000px', height: cardHeight }}
      onClick={handleClick}
    >
      <Box 
        className="relative w-full h-full transition-transform duration-600"
        style={{ 
          transformStyle: 'preserve-3d',
          transform: currentFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transitionDuration: '0.6s'
        }}
      >
        {/* Frente do Card */}
        <Card 
          className="absolute inset-0 w-full h-full shadow-lg hover:shadow-xl transition-shadow"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <CardContent className="h-full flex flex-col p-4">
            {/* Header */}
            <Box className="flex justify-between items-start mb-3">
              <Chip 
                label={`#${(index + 1).toString().padStart(2, '0')}`} 
                size="small" 
                variant="outlined"
              />
              <Box className="flex gap-1">
                <Chip 
                  label={flashcard.difficulty || 'medium'} 
                  size="small" 
                  color={getDifficultyColor(flashcard.difficulty)}
                />
                {flashcard.category && (
                  <Chip 
                    label={flashcard.category} 
                    size="small" 
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>

            {/* Pergunta */}
            <Box className="flex-1 flex flex-col justify-center">
              <Typography 
                variant={compact ? "h6" : "h5"} 
                className="text-center font-medium mb-4"
                style={{ 
                  display: '-webkit-box',
                  WebkitLineClamp: compact ? 4 : 6,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {flashcard.question}
              </Typography>

              {/* Imagem da pergunta */}
              {flashcard.questionImage && (
                <Box className="image-area flex justify-center mb-4">
                  <ImageZoom 
                    src={flashcard.questionImage} 
                    alt="Imagem da pergunta"
                    className="max-w-full max-h-32 object-contain rounded"
                  />
                </Box>
              )}
            </Box>

            {/* Footer */}
            <Box className="flex justify-between items-center">
              <Tooltip title="Clique para ver a resposta">
                <IconButton size="small" color="primary">
                  <Visibility />
                </IconButton>
              </Tooltip>
              
              <Typography variant="caption" className="text-slate-500">
                Pergunta
              </Typography>
              
              <Tooltip title="Virar card">
                <IconButton size="small">
                  <RotateLeft />
                </IconButton>
              </Tooltip>
            </Box>
          </CardContent>
        </Card>

        {/* Verso do Card */}
        <Card 
          className="absolute inset-0 w-full h-full shadow-lg hover:shadow-xl transition-shadow"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <CardContent className="h-full flex flex-col p-4">
            {/* Header */}
            <Box className="flex justify-between items-start mb-3">
              <Chip 
                label={`#${(index + 1).toString().padStart(2, '0')}`} 
                size="small" 
                variant="outlined"
                color="secondary"
              />
              <Box className="flex gap-1">
                <Chip 
                  label={flashcard.difficulty || 'medium'} 
                  size="small" 
                  color={getDifficultyColor(flashcard.difficulty)}
                />
                {flashcard.category && (
                  <Chip 
                    label={flashcard.category} 
                    size="small" 
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>

            {/* Resposta */}
            <Box className="flex-1 flex flex-col justify-center">
              <Typography 
                variant={compact ? "body1" : "h6"} 
                className="text-center mb-4"
                style={{ 
                  display: '-webkit-box',
                  WebkitLineClamp: compact ? 6 : 8,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {flashcard.answer}
              </Typography>

              {/* Imagem da resposta */}
              {flashcard.answerImage && (
                <Box className="image-area flex justify-center mb-4">
                  <ImageZoom 
                    src={flashcard.answerImage} 
                    alt="Imagem da resposta"
                    className="max-w-full max-h-32 object-contain rounded"
                  />
                </Box>
              )}

              {/* Upload de imagem (se habilitado) */}
              {showImageUpload && (
                <Box className="mt-2">
                  <ImageUpload onImageUploaded={handleImageUploaded} />
                </Box>
              )}
            </Box>

            {/* Avaliação de Dificuldade */}
            <Paper className="p-3 bg-slate-50 dark:bg-slate-800">
              <Typography variant="caption" className="block text-center mb-2">
                Como você avalia a dificuldade desta questão?
              </Typography>
              <Box className="flex justify-center">
                <Rating
                  value={userRating}
                  onChange={handleDifficultyRating}
                  size="small"
                  icon={<Star fontSize="inherit" />}
                  emptyIcon={<StarBorder fontSize="inherit" />}
                />
              </Box>
            </Paper>

            {/* Footer */}
            <Box className="flex justify-between items-center mt-3">
              <Tooltip title="Voltar para pergunta">
                <IconButton size="small" color="secondary">
                  <VisibilityOff />
                </IconButton>
              </Tooltip>
              
              <Typography variant="caption" className="text-slate-500">
                Resposta
              </Typography>
              
              <Tooltip title="Virar card">
                <IconButton size="small">
                  <RotateLeft />
                </IconButton>
              </Tooltip>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default FlashCardWithImage;

