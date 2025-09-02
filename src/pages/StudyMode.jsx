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
  CheckCircle
} from 'lucide-react';

export const StudyMode = () => {
  const { flashcards, loading, updateProgress } = useFlashcards();
  const { t } = useLanguage();
  
  // Estados do modo estudo
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filteredFlashcards, setFilteredFlashcards] = useState([]);
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
    console.log('🔍 Aplicando filtros:', filters);
    console.log('📚 Total flashcards:', flashcards.length);
    
    let filtered = [...flashcards];

    if (filters.difficulty !== 'all') {
      filtered = filtered.filter(card => {
        const cardDifficulty = card.difficulty?.toLowerCase();
        const filterDifficulty = filters.difficulty.toLowerCase();
        return cardDifficulty === filterDifficulty;
      });
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(card => {
        const cardTags = card.tags || [];
        const cardCategory = card.category?.toLowerCase() || '';
        const filterCategory = filters.category.toLowerCase();
        
        return cardTags.some(tag => tag.toLowerCase().includes(filterCategory)) ||
               cardCategory.includes(filterCategory);
      });
    }

    if (filters.status !== 'all') {
      // Para status "new", mostrar todos os flashcards (já que não temos sistema de progresso ainda)
      if (filters.status === 'new') {
        // Manter todos os flashcards
      } else {
        // Para outros status, filtrar baseado em lógica futura
        filtered = filtered.filter(card => {
          // Por enquanto, mostrar todos para "review" e "mastered"
          return true;
        });
      }
    }

    console.log('✅ Flashcards filtrados:', filtered.length);
    setFilteredFlashcards(filtered);
    setCurrentIndex(0);
  }, [flashcards, filters]);

  // Iniciar sessão de estudo
  const startStudySession = () => {
    setStudySession({
      startTime: new Date(),
      cardsStudied: 0,
      correctAnswers: 0,
      sessionActive: true
    });
  };

  // Finalizar sessão de estudo
  const endStudySession = () => {
    const duration = studySession.startTime ? 
      Math.round((new Date() - studySession.startTime) / 1000 / 60) : 0;
    
    alert(`Sessão finalizada!\n\nTempo: ${duration} minutos\nCards estudados: ${studySession.cardsStudied}\nAcertos: ${studySession.correctAnswers}/${studySession.cardsStudied}`);
    
    setStudySession({
      startTime: null,
      cardsStudied: 0,
      correctAnswers: 0,
      sessionActive: false
    });
  };

  // Navegar para próximo flashcard
  const nextCard = () => {
    if (currentIndex < filteredFlashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Navegar para flashcard anterior
  const previousCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Registrar progresso do flashcard
  const handleDifficultyRating = async (difficulty) => {
    const currentCard = filteredFlashcards[currentIndex];
    if (!currentCard) return;

    // Atualizar progresso no banco
    const progressData = {
      difficulty_rating: difficulty,
      times_studied: (currentCard.user_progress?.[0]?.times_studied || 0) + 1,
      mastery_level: difficulty === 'easy' ? 
        Math.min((currentCard.user_progress?.[0]?.mastery_level || 0) + 2, 10) :
        difficulty === 'medium' ? 
        Math.min((currentCard.user_progress?.[0]?.mastery_level || 0) + 1, 10) :
        Math.max((currentCard.user_progress?.[0]?.mastery_level || 0) - 1, 0)
    };

    await updateProgress(currentCard.id, progressData);

    // Atualizar estatísticas da sessão
    setStudySession(prev => ({
      ...prev,
      cardsStudied: prev.cardsStudied + 1,
      correctAnswers: prev.correctAnswers + (difficulty === 'easy' ? 1 : 0)
    }));

    // Avançar automaticamente para o próximo card
    setTimeout(() => {
      nextCard();
    }, 1000);
  };

  // Resetar filtros
  const resetFilters = () => {
    setFilters({
      difficulty: 'all',
      category: 'all',
      status: 'all'
    });
  };

  // Obter categorias únicas
  const categories = [...new Set(flashcards.map(card => 
    card.discipline || card.category || 'Geral'
  ))];

  const currentCard = filteredFlashcards[currentIndex];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando flashcards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header com controles */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              Modo Estudo Focado
            </h1>
            
            {!studySession.sessionActive ? (
              <Button onClick={startStudySession} className="bg-green-600 hover:bg-green-700">
                <Clock className="h-4 w-4 mr-2" />
                Iniciar Sessão
              </Button>
            ) : (
              <Button onClick={endStudySession} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                <CheckCircle className="h-4 w-4 mr-2" />
                Finalizar Sessão
              </Button>
            )}
          </div>

          {/* Estatísticas da sessão */}
          {studySession.sessionActive && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600">
                      Tempo: {studySession.startTime ? 
                        Math.round((new Date() - studySession.startTime) / 1000 / 60) : 0} min
                    </span>
                    <span className="text-gray-600">
                      Cards: {studySession.cardsStudied}
                    </span>
                    <span className="text-gray-600">
                      Acertos: {studySession.correctAnswers}/{studySession.cardsStudied}
                    </span>
                  </div>
                  <div className="text-blue-600 font-medium">
                    {currentIndex + 1} de {filteredFlashcards.length}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filtros */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Filtros:</span>
                </div>
                
                <Select value={filters.difficulty} onValueChange={(value) => 
                  setFilters(prev => ({ ...prev, difficulty: value }))
                }>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Dificuldade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="1">Fácil</SelectItem>
                    <SelectItem value="2">Médio</SelectItem>
                    <SelectItem value="3">Difícil</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.category} onValueChange={(value) => 
                  setFilters(prev => ({ ...prev, category: value }))
                }>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filters.status} onValueChange={(value) => 
                  setFilters(prev => ({ ...prev, status: value }))
                }>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="new">Novos</SelectItem>
                    <SelectItem value="review">Revisão</SelectItem>
                    <SelectItem value="mastered">Dominados</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="sm" onClick={resetFilters}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Limpar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Área principal do flashcard */}
        {filteredFlashcards.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum flashcard encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                Ajuste os filtros ou adicione novos flashcards para começar a estudar.
              </p>
              <Button onClick={resetFilters} variant="outline">
                Limpar Filtros
              </Button>
            </CardContent>
          </Card>
        ) : currentCard ? (
          <div className="space-y-6">
            {/* Flashcard principal */}
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <FlashCardWithImage
                  flashcard={currentCard}
                  index={currentIndex}
                  onImageUpdate={() => {}} // Não permitir upload no modo estudo
                  showImageUpload={false}
                />
              </div>
            </div>

            {/* Controles de navegação */}
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                onClick={previousCard}
                disabled={currentIndex === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{currentIndex + 1}</span>
                <span>/</span>
                <span>{filteredFlashcards.length}</span>
              </div>

              <Button 
                variant="outline" 
                onClick={nextCard}
                disabled={currentIndex === filteredFlashcards.length - 1}
                className="flex items-center gap-2"
              >
                Próximo
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Botões de avaliação rápida */}
            {studySession.sessionActive && (
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-3">
                      Como foi sua performance neste flashcard?
                    </p>
                    <div className="flex justify-center gap-3">
                      <Button 
                        onClick={() => handleDifficultyRating('easy')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        😊 Fácil
                      </Button>
                      <Button 
                        onClick={() => handleDifficultyRating('medium')}
                        className="bg-yellow-600 hover:bg-yellow-700"
                      >
                        🤔 Médio
                      </Button>
                      <Button 
                        onClick={() => handleDifficultyRating('hard')}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        😰 Difícil
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

