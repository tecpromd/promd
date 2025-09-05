import React, { useState, useEffect } from 'react';
import { useFlashcards } from '../hooks/useFlashcards';
import { useLanguage } from '../contexts/LanguageContext';
import FlashCardWithImage from '../components/flashcards/FlashCardWithImage';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Filter,
  BookOpen,
  Target,
  Clock,
  CheckCircle,
  Grid3X3,
  List,
  Eye,
  Play
} from 'lucide-react';

// Material-UI imports
import {
  Box,
  Container,
  Grid2 as Grid,
  Typography,
  Paper,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  ToggleButton,
  ToggleButtonGroup,
  LinearProgress,
  Fab,
  Tooltip
} from '@mui/material';

export const StudyMode = () => {
  const { flashcards, loading, updateProgress } = useFlashcards();
  const { t } = useLanguage();
  
  // Estados do modo estudo
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filteredFlashcards, setFilteredFlashcards] = useState([]);
  const [viewMode, setViewMode] = useState('study');
  const [cardFlipped, setCardFlipped] = useState(false);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    category: 'all',
    status: 'all'
  });
  const [studySession, setStudySession] = useState({
    startTime: null,
    cardsStudied: 0,
    correctAnswers: 0,
    sessionActive: false
  });

  // Filtrar flashcards baseado nos filtros selecionados
  useEffect(() => {
    let filtered = [...flashcards];

    if (filters.difficulty !== 'all') {
      filtered = filtered.filter(card => card.difficulty === filters.difficulty);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(card => card.category === filters.category);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(card => {
        switch (filters.status) {
          case 'new': return !card.studied;
          case 'reviewed': return card.studied;
          case 'difficult': return card.difficulty === 'hard';
          default: return true;
        }
      });
    }

    setFilteredFlashcards(filtered);
    setCurrentIndex(0);
  }, [flashcards, filters]);

  const currentCard = filteredFlashcards[currentIndex];
  const progress = filteredFlashcards.length > 0 ? ((currentIndex + 1) / filteredFlashcards.length) * 100 : 0;

  const handleNext = () => {
    if (currentIndex < filteredFlashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCardFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCardFlipped(false);
    }
  };

  const handleFlip = () => {
    setCardFlipped(!cardFlipped);
  };

  const startStudySession = () => {
    setStudySession({
      startTime: new Date(),
      cardsStudied: 0,
      correctAnswers: 0,
      sessionActive: true
    });
  };

  const endStudySession = () => {
    setStudySession(prev => ({
      ...prev,
      sessionActive: false
    }));
  };

  const categories = [...new Set(flashcards.map(card => card.category))].filter(Boolean);

  if (loading) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Box className="text-center">
          <Typography variant="h6">Carregando flashcards...</Typography>
          <LinearProgress className="mt-4" />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-4">
      {/* Header */}
      <Box className="mb-6">
        <Typography variant="h4" className="font-bold mb-2">
          📚 Flashcards
        </Typography>
        <Typography variant="body1" className="text-slate-600 dark:text-slate-400">
          Estude com flashcards interativos e acompanhe seu progresso
        </Typography>
      </Box>

      {/* Controles e Filtros */}
      <Paper className="p-4 mb-6">
        <Grid container spacing={3} alignItems="center">
          {/* Modo de Visualização */}
          <Grid xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" className="mb-2">Modo de Visualização</Typography>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, newMode) => newMode && setViewMode(newMode)}
              size="small"
              fullWidth
            >
              <ToggleButton value="study">
                <Eye className="h-4 w-4 mr-1" />
                Estudo
              </ToggleButton>
              <ToggleButton value="grid">
                <Grid3X3 className="h-4 w-4 mr-1" />
                Grade
              </ToggleButton>
              <ToggleButton value="list">
                <List className="h-4 w-4 mr-1" />
                Lista
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>

          {/* Filtros */}
          <Grid xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Dificuldade</InputLabel>
              <MuiSelect
                value={filters.difficulty}
                label="Dificuldade"
                onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
              >
                <MenuItem value="all">Todas</MenuItem>
                <MenuItem value="easy">Fácil</MenuItem>
                <MenuItem value="medium">Médio</MenuItem>
                <MenuItem value="hard">Difícil</MenuItem>
              </MuiSelect>
            </FormControl>
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Categoria</InputLabel>
              <MuiSelect
                value={filters.category}
                label="Categoria"
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              >
                <MenuItem value="all">Todas</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <MuiSelect
                value={filters.status}
                label="Status"
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="new">Novos</MenuItem>
                <MenuItem value="reviewed">Revisados</MenuItem>
                <MenuItem value="difficult">Difíceis</MenuItem>
              </MuiSelect>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Estatísticas da Sessão */}
      {studySession.sessionActive && (
        <Paper className="p-4 mb-6 bg-blue-50 dark:bg-blue-950">
          <Grid container spacing={2}>
            <Grid xs={6} sm={3}>
              <Box className="text-center">
                <Typography variant="h6" className="font-bold text-blue-600">
                  {studySession.cardsStudied}
                </Typography>
                <Typography variant="caption">Cards Estudados</Typography>
              </Box>
            </Grid>
            <Grid xs={6} sm={3}>
              <Box className="text-center">
                <Typography variant="h6" className="font-bold text-green-600">
                  {studySession.correctAnswers}
                </Typography>
                <Typography variant="caption">Acertos</Typography>
              </Box>
            </Grid>
            <Grid xs={6} sm={3}>
              <Box className="text-center">
                <Typography variant="h6" className="font-bold text-purple-600">
                  {studySession.cardsStudied > 0 ? Math.round((studySession.correctAnswers / studySession.cardsStudied) * 100) : 0}%
                </Typography>
                <Typography variant="caption">Taxa de Acerto</Typography>
              </Box>
            </Grid>
            <Grid xs={6} sm={3}>
              <Box className="text-center">
                <Typography variant="h6" className="font-bold text-orange-600">
                  {studySession.startTime ? Math.round((new Date() - studySession.startTime) / 60000) : 0}min
                </Typography>
                <Typography variant="caption">Tempo de Estudo</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Conteúdo Principal */}
      {filteredFlashcards.length === 0 ? (
        <Paper className="p-8 text-center">
          <BookOpen className="h-16 w-16 mx-auto text-slate-400 mb-4" />
          <Typography variant="h6" className="mb-2">Nenhum flashcard encontrado</Typography>
          <Typography variant="body2" className="text-slate-600 mb-4">
            Ajuste os filtros ou adicione novos flashcards para começar a estudar
          </Typography>
          <Button variant="contained" onClick={() => setFilters({ difficulty: 'all', category: 'all', status: 'all' })}>
            Limpar Filtros
          </Button>
        </Paper>
      ) : (
        <>
          {/* Modo Estudo */}
          {viewMode === 'study' && (
            <Box>
              {/* Progresso */}
              <Paper className="p-4 mb-4">
                <Box className="flex justify-between items-center mb-2">
                  <Typography variant="body2">
                    Flashcard {currentIndex + 1} de {filteredFlashcards.length}
                  </Typography>
                  <Typography variant="body2" className="font-medium">
                    {Math.round(progress)}%
                  </Typography>
                </Box>
                <LinearProgress variant="determinate" value={progress} className="h-2 rounded" />
              </Paper>

              {/* Card Principal */}
              <Box className="max-w-4xl mx-auto">
                {currentCard && (
                  <FlashCardWithImage
                    flashcard={currentCard}
                    flipped={cardFlipped}
                    onFlip={handleFlip}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                    showNavigation={true}
                    compact={false}
                  />
                )}
              </Box>

              {/* Controles de Navegação */}
              <Box className="flex justify-center gap-2 mt-6">
                <Tooltip title="Anterior">
                  <IconButton 
                    onClick={handlePrevious} 
                    disabled={currentIndex === 0}
                    size="large"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </IconButton>
                </Tooltip>

                <Tooltip title={cardFlipped ? "Mostrar Pergunta" : "Mostrar Resposta"}>
                  <IconButton onClick={handleFlip} size="large" color="primary">
                    <RotateCcw className="h-6 w-6" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Próximo">
                  <IconButton 
                    onClick={handleNext} 
                    disabled={currentIndex === filteredFlashcards.length - 1}
                    size="large"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          )}

          {/* Modo Grade */}
          {viewMode === 'grid' && (
            <Grid container spacing={3}>
              {filteredFlashcards.map((flashcard, index) => (
                <Grid xs={12} sm={6} md={4} key={flashcard.id}>
                  <Paper 
                    className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => {
                      setCurrentIndex(index);
                      setViewMode('study');
                    }}
                  >
                    <Typography variant="h6" className="mb-2 line-clamp-2">
                      {flashcard.question}
                    </Typography>
                    <Box className="flex justify-between items-center">
                      <Chip 
                        label={flashcard.category} 
                        size="small" 
                        variant="outlined"
                      />
                      <Chip 
                        label={flashcard.difficulty} 
                        size="small" 
                        color={
                          flashcard.difficulty === 'easy' ? 'success' :
                          flashcard.difficulty === 'medium' ? 'warning' : 'error'
                        }
                      />
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Modo Lista */}
          {viewMode === 'list' && (
            <Paper>
              {filteredFlashcards.map((flashcard, index) => (
                <Box 
                  key={flashcard.id}
                  className="p-4 border-b cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                  onClick={() => {
                    setCurrentIndex(index);
                    setViewMode('study');
                  }}
                >
                  <Box className="flex justify-between items-start">
                    <Box className="flex-1">
                      <Typography variant="subtitle1" className="mb-1">
                        {flashcard.question}
                      </Typography>
                      <Typography variant="body2" className="text-slate-600 line-clamp-2">
                        {flashcard.answer}
                      </Typography>
                    </Box>
                    <Box className="flex gap-1 ml-4">
                      <Chip label={flashcard.category} size="small" variant="outlined" />
                      <Chip 
                        label={flashcard.difficulty} 
                        size="small" 
                        color={
                          flashcard.difficulty === 'easy' ? 'success' :
                          flashcard.difficulty === 'medium' ? 'warning' : 'error'
                        }
                      />
                    </Box>
                  </Box>
                </Box>
              ))}
            </Paper>
          )}
        </>
      )}

      {/* FAB para Iniciar Sessão */}
      {!studySession.sessionActive && filteredFlashcards.length > 0 && (
        <Fab
          color="primary"
          onClick={startStudySession}
          className="fixed bottom-6 right-6"
        >
          <Play className="h-6 w-6" />
        </Fab>
      )}
    </Container>
  );
};

