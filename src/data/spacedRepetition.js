// Sistema de Repetição Espaçada para o ProMD
// Baseado no algoritmo SM-2 (SuperMemo)

export class SpacedRepetitionSystem {
  constructor() {
    this.defaultEaseFactor = 2.5;
    this.minEaseFactor = 1.3;
    this.maxEaseFactor = 4.0;
  }

  // Calcular próxima revisão baseada na performance
  calculateNextReview(performance, currentInterval = 1, easeFactor = 2.5, repetitions = 0) {
    let newInterval;
    let newEaseFactor = easeFactor;
    let newRepetitions = repetitions;

    // Performance: 0 = erro, 1 = difícil, 2 = normal, 3 = fácil, 4 = muito fácil
    if (performance < 2) {
      // Resposta incorreta ou muito difícil - reiniciar
      newInterval = 1;
      newRepetitions = 0;
    } else {
      // Resposta correta
      newRepetitions += 1;
      
      if (newRepetitions === 1) {
        newInterval = 1;
      } else if (newRepetitions === 2) {
        newInterval = 6;
      } else {
        newInterval = Math.round(currentInterval * easeFactor);
      }
    }

    // Ajustar ease factor baseado na performance
    newEaseFactor = easeFactor + (0.1 - (5 - performance) * (0.08 + (5 - performance) * 0.02));
    
    // Limitar ease factor
    if (newEaseFactor < this.minEaseFactor) {
      newEaseFactor = this.minEaseFactor;
    } else if (newEaseFactor > this.maxEaseFactor) {
      newEaseFactor = this.maxEaseFactor;
    }

    // Calcular data da próxima revisão
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

    return {
      interval: newInterval,
      easeFactor: newEaseFactor,
      repetitions: newRepetitions,
      nextReviewDate: nextReviewDate.toISOString(),
      dueToday: newInterval <= 1
    };
  }

  // Obter questões devido para revisão hoje
  getQuestionsForReview(userProgress) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return Object.entries(userProgress)
      .filter(([questionId, progress]) => {
        if (!progress.nextReviewDate) return true; // Primeira vez
        
        const reviewDate = new Date(progress.nextReviewDate);
        reviewDate.setHours(0, 0, 0, 0);
        
        return reviewDate <= today;
      })
      .map(([questionId, progress]) => ({
        questionId,
        ...progress,
        priority: this.calculatePriority(progress, today)
      }))
      .sort((a, b) => b.priority - a.priority);
  }

  // Calcular prioridade da questão (maior = mais urgente)
  calculatePriority(progress, today) {
    if (!progress.nextReviewDate) return 100; // Primeira vez = alta prioridade
    
    const reviewDate = new Date(progress.nextReviewDate);
    const daysOverdue = Math.floor((today - reviewDate) / (1000 * 60 * 60 * 24));
    
    // Prioridade baseada em: dias atrasados + dificuldade + frequência de erros
    const difficultyScore = (this.defaultEaseFactor - (progress.easeFactor || this.defaultEaseFactor)) * 10;
    const errorRate = (progress.totalAttempts > 0) ? (progress.incorrectAttempts / progress.totalAttempts) * 50 : 0;
    
    return Math.max(0, daysOverdue * 5 + difficultyScore + errorRate);
  }

  // Atualizar progresso do usuário
  updateUserProgress(questionId, performance, currentProgress = {}) {
    const existing = currentProgress[questionId] || {
      interval: 1,
      easeFactor: this.defaultEaseFactor,
      repetitions: 0,
      totalAttempts: 0,
      correctAttempts: 0,
      incorrectAttempts: 0,
      lastReviewed: null,
      nextReviewDate: null,
      averagePerformance: 0
    };

    // Atualizar estatísticas
    existing.totalAttempts += 1;
    if (performance >= 2) {
      existing.correctAttempts += 1;
    } else {
      existing.incorrectAttempts += 1;
    }

    // Calcular performance média
    existing.averagePerformance = existing.correctAttempts / existing.totalAttempts;

    // Calcular próxima revisão
    const nextReview = this.calculateNextReview(
      performance,
      existing.interval,
      existing.easeFactor,
      existing.repetitions
    );

    // Atualizar dados
    const updated = {
      ...existing,
      ...nextReview,
      lastReviewed: new Date().toISOString(),
      lastPerformance: performance
    };

    return {
      ...currentProgress,
      [questionId]: updated
    };
  }

  // Obter estatísticas de progresso
  getProgressStats(userProgress) {
    const questions = Object.values(userProgress);
    const total = questions.length;
    
    if (total === 0) {
      return {
        total: 0,
        mastered: 0,
        learning: 0,
        new: 0,
        dueToday: 0,
        averageAccuracy: 0,
        totalReviews: 0
      };
    }

    const mastered = questions.filter(q => q.repetitions >= 3 && q.averagePerformance >= 0.8).length;
    const learning = questions.filter(q => q.repetitions > 0 && q.repetitions < 3).length;
    const newQuestions = questions.filter(q => q.repetitions === 0).length;
    const dueToday = this.getQuestionsForReview(userProgress).length;
    
    const totalAttempts = questions.reduce((sum, q) => sum + q.totalAttempts, 0);
    const totalCorrect = questions.reduce((sum, q) => sum + q.correctAttempts, 0);
    const averageAccuracy = totalAttempts > 0 ? (totalCorrect / totalAttempts) : 0;

    return {
      total,
      mastered,
      learning,
      new: newQuestions,
      dueToday,
      averageAccuracy: Math.round(averageAccuracy * 100),
      totalReviews: totalAttempts
    };
  }
}

// Instância global do sistema
export const spacedRepetition = new SpacedRepetitionSystem();

// Funções utilitárias
export const getPerformanceLevel = (isCorrect, difficulty) => {
  if (!isCorrect) return 0; // Erro
  
  switch (difficulty) {
    case 'very_easy': return 4;
    case 'easy': return 3;
    case 'normal': return 2;
    case 'hard': return 1;
    default: return 2;
  }
};

export const formatNextReviewDate = (dateString) => {
  if (!dateString) return 'Não agendado';
  
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = date - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'Atrasado';
  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Amanhã';
  if (diffDays < 7) return `Em ${diffDays} dias`;
  if (diffDays < 30) return `Em ${Math.ceil(diffDays / 7)} semanas`;
  return `Em ${Math.ceil(diffDays / 30)} meses`;
};

