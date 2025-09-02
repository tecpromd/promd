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
  Eye
} from 'lucide-react';

export const StudyMode = () => {
  const { flashcards, loading, updateProgress } = useFlashcards();
  const { t } = useLanguage();
  
  // Estados do modo estudo
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filteredFlashcards, setFilteredFlashcards] = useState([]);
  const [viewMode, setViewMode] = useState('study'); // 'grid', 'list', 'study'
  const [cardFlipped, setCardFlipped] = useState(false); // Controlar se o card atual está virado
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
      setCardFlipped(false); // Resetar para mostrar pergunta primeiro
    }
  };

  // Navegar para flashcard anterior
  const previousCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCardFlipped(false); // Resetar para mostrar pergunta primeiro
    }
  };

  // Função para virar o card atual
  const flipCard = () => {
    setCardFlipped(!cardFlipped);
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
              Flashcards
            </h1>
            
            <div className="flex items-center gap-3">
              {/* Botões de modo de visualização */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 px-3"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'study' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('study')}
                  className="h-8 px-3"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>

              {viewMode === 'study' && !studySession.sessionActive ? (
                <Button onClick={startStudySession} className="bg-green-600 hover:bg-green-700">
                  <Clock className="h-4 w-4 mr-2" />
                  Iniciar Sessão
                </Button>
              ) : viewMode === 'study' && studySession.sessionActive ? (
                <Button onClick={endStudySession} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Finalizar Sessão
                </Button>
              ) : null}
            </div>
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

        {/* Área principal - diferentes modos de visualização */}
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
        ) : (
          <>
            {/* Modo Grid */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFlashcards.map((flashcard, index) => (
                  <div key={flashcard.id} className="h-80">
                    <FlashCardWithImage
                      flashcard={flashcard}
                      index={index}
                      onImageUpdate={() => {}}
                      showImageUpload={false}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Modo Lista */}
            {viewMode === 'list' && (
              <div className="space-y-4">
                {filteredFlashcards.map((flashcard, index) => (
                  <Card key={flashcard.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">#{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {flashcard.title || 'Flashcard'}
                          </h3>
                          <p className="text-gray-600 mb-2">
                            {flashcard.question || flashcard.content || 'Pergunta do flashcard'}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{flashcard.discipline || 'Medicina Geral'}</span>
                            {flashcard.difficulty && (
                              <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                                Nível {flashcard.difficulty}
                              </span>
                            )}
                          </div>
                        </div>
                        {flashcard.image_url && (
                          <div className="flex-shrink-0">
                            <img 
                              src={flashcard.image_url} 
                              alt={flashcard.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Modo Estudo Individual */}
            {viewMode === 'study' && currentCard && (
              <div className="space-y-6">
                {/* Flashcard principal */}
                <div className="flex justify-center">
                  <div className="w-full max-w-md">
                    <div 
                      className="w-full h-80 cursor-pointer"
                      style={{ perspective: '1000px' }}
                      onClick={flipCard}
                    >
                      <div 
                        className="relative w-full h-full transition-transform duration-600"
                        style={{ 
                          transformStyle: 'preserve-3d',
                          transform: cardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                          transitionDuration: '0.6s'
                        }}
                      >
                        {/* Frente do Card - Pergunta */}
                        <div 
                          className="absolute inset-0 w-full h-full rounded-lg p-4 bg-gradient-to-br from-blue-600 to-blue-800 text-white flex flex-col"
                          style={{ backfaceVisibility: 'hidden' }}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-xs opacity-80">#{(currentIndex + 1).toString().padStart(2, '0')}</span>
                            <div className="text-xs opacity-80">📚</div>
                          </div>
                          
                          <div className="flex-1 flex flex-col justify-center">
                            <h3 className="text-lg font-semibold mb-2 text-center">
                              {currentCard.title || 'Flashcard'}
                            </h3>
                            <p className="text-sm opacity-90 text-center mb-3">
                              {currentCard.question || currentCard.content || 'Pergunta do flashcard'}
                            </p>
                            
                            {currentCard.image_url && (
                              <div className="flex-shrink-0 flex justify-center">
                                <img 
                                  src={currentCard.image_url} 
                                  alt={currentCard.title || 'Imagem do flashcard'}
                                  className="max-h-32 w-auto object-contain rounded"
                                />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex justify-between items-end mt-3">
                            <span className="text-xs opacity-70">
                              {currentCard.discipline || 'Medicina Geral'}
                            </span>
                            <span className="text-xs opacity-70">Clique para ver resposta</span>
                          </div>
                        </div>

                        {/* Verso do Card - Resposta */}
                        <div 
                          className="absolute inset-0 w-full h-full rounded-lg p-4 bg-white border-2 border-blue-200 flex flex-col"
                          style={{ 
                            transform: 'rotateY(180deg)',
                            backfaceVisibility: 'hidden'
                          }}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-xs text-gray-500">#{(currentIndex + 1).toString().padStart(2, '0')}</span>
                            <div className="text-xs text-gray-500">💡</div>
                          </div>
                          
                          <div className="flex-1 flex flex-col justify-center">
                            <h3 className="text-lg font-semibold mb-2 text-center text-gray-900">
                              Resposta
                            </h3>
                            <p className="text-sm text-gray-700 text-center mb-4">
                              {currentCard.answer || currentCard.back_content || 'Resposta do flashcard'}
                            </p>
                          </div>
                          
                          <div className="flex justify-between items-end mt-3">
                            <span className="text-xs text-gray-500">
                              {currentCard.discipline || 'Medicina Geral'}
                            </span>
                            <span className="text-xs text-gray-500">Clique para voltar</span>
                          </div>
                        </div>
                      </div>
                    </div>
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

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{currentIndex + 1}</span>
                      <span>/</span>
                      <span>{filteredFlashcards.length}</span>
                    </div>
                    
                    <Button 
                      variant="secondary" 
                      onClick={flipCard}
                      className="px-6"
                    >
                      {cardFlipped ? 'Ver Pergunta' : 'Ver Resposta'}
                    </Button>
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
                {studySession.sessionActive && cardFlipped && (
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
        )}
        </>
        )}
      </div>
    </div>
  );
};

