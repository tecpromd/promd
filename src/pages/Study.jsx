import React, { useState, useEffect } from 'react';
import FlashcardViewerProMD from '../components/flashcards/FlashcardViewerProMD';
import QuestionStudyViewerModern from '../components/questions/QuestionStudyViewerModern';
import { useSupabaseFlashcards } from '../hooks/useSupabaseFlashcards';
import { useSupabaseQuestions } from '../hooks/useSupabaseQuestions';
import { supabase } from '../lib/supabase';

const Study = () => {
  const { flashcards } = useSupabaseFlashcards();
  const { questions } = useSupabaseQuestions();
  const [studyMode, setStudyMode] = useState(null);
  const [studyType, setStudyType] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });
  const [isComplete, setIsComplete] = useState(false);

  const startStudy = (mode, type) => {
    setStudyMode(mode);
    setStudyType(type);
    setCurrentIndex(0);
    setStats({ correct: 0, incorrect: 0 });
    setIsComplete(false);
  };

  const handleCorrect = () => {
    setStats(prev => ({ ...prev, correct: prev.correct + 1 }));
  };

  const handleIncorrect = () => {
    setStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
  };

  const handleNext = () => {
    const totalItems = studyType === 'flashcards' ? flashcards.length : questions.length;
    
    if (currentIndex + 1 >= totalItems) {
      setIsComplete(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const resetStudy = () => {
    setStudyMode(null);
    setStudyType(null);
    setCurrentIndex(0);
    setStats({ correct: 0, incorrect: 0 });
    setIsComplete(false);
  };

  // Função para salvar avaliação de dificuldade
  const saveDifficultyRating = async (flashcardId, difficultyLevel) => {
    try {
      // Primeiro, verificar se já existe uma avaliação para este flashcard
      const { data: existingRating, error: fetchError } = await supabase
        .from('flashcard_ratings')
        .select('id')
        .eq('flashcard_id', flashcardId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Erro ao verificar avaliação existente:', fetchError);
        return;
      }

      if (existingRating) {
        // Atualizar avaliação existente
        const { error: updateError } = await supabase
          .from('flashcard_ratings')
          .update({ 
            difficulty_level: difficultyLevel,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingRating.id);

        if (updateError) {
          console.error('Erro ao atualizar avaliação:', updateError);
        } else {
          console.log(`Avaliação atualizada: Flashcard ${flashcardId} - Dificuldade ${difficultyLevel}`);
        }
      } else {
        // Criar nova avaliação
        const { error: insertError } = await supabase
          .from('flashcard_ratings')
          .insert({
            flashcard_id: flashcardId,
            difficulty_level: difficultyLevel,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (insertError) {
          console.error('Erro ao criar avaliação:', insertError);
        } else {
          console.log(`Nova avaliação criada: Flashcard ${flashcardId} - Dificuldade ${difficultyLevel}`);
        }
      }
    } catch (error) {
      console.error('Erro ao salvar avaliação de dificuldade:', error);
    }
  };

  // Tela inicial - seleção de modo
  if (!studyMode) {
    return (
      <div style={{ 
        padding: '40px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        minHeight: '100vh'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ 
            fontSize: '36px', 
            fontWeight: '800',
            color: '#1e293b', 
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            📚 Estudar
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: '#64748b',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Continue sua jornada de preparação para a validação médica
          </p>
        </div>

        {/* Estatísticas */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '50px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
            border: '1px solid #93c5fd'
          }}>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#1e40af', marginBottom: '8px' }}>
              {flashcards.length}
            </div>
            <div style={{ fontSize: '14px', color: '#1e40af', fontWeight: '600' }}>
              Total de Flashcards
            </div>
            <div style={{ fontSize: '12px', color: '#3730a3', marginTop: '4px' }}>
              +2 novos esta semana
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
            border: '1px solid #86efac'
          }}>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#166534', marginBottom: '8px' }}>
              {questions.length}
            </div>
            <div style={{ fontSize: '14px', color: '#166534', fontWeight: '600' }}>
              Questões Importadas
            </div>
            <div style={{ fontSize: '12px', color: '#14532d', marginTop: '4px' }}>
              Banco atualizado
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
            border: '1px solid #fcd34d'
          }}>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#92400e', marginBottom: '8px' }}>
              89%
            </div>
            <div style={{ fontSize: '14px', color: '#92400e', fontWeight: '600' }}>
              Precisão Geral
            </div>
            <div style={{ fontSize: '12px', color: '#78350f', marginTop: '4px' }}>
              Última semana
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
            border: '1px solid #f9a8d4'
          }}>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#be185d', marginBottom: '8px' }}>
              45 min
            </div>
            <div style={{ fontSize: '14px', color: '#be185d', fontWeight: '600' }}>
              Tempo Hoje
            </div>
            <div style={{ fontSize: '12px', color: '#9d174d', marginTop: '4px' }}>
              Meta: 60 min
            </div>
          </div>
        </div>

        {/* Modos de Estudo */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '700',
            color: '#1e293b', 
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            Escolha seu modo de estudo
          </h2>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {/* Flashcards */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e2e8f0',
              transition: 'all 0.2s ease'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                marginBottom: '20px'
              }}>
                🃏
              </div>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: '700',
                color: '#1e293b', 
                marginBottom: '12px'
              }}>
                Flashcards
              </h3>
              <p style={{ 
                fontSize: '14px', 
                color: '#64748b', 
                lineHeight: '1.6',
                marginBottom: '20px'
              }}>
                Estudo rápido com cartas que viram. Ideal para memorização e revisão de conceitos.
              </p>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                  {flashcards.length} flashcards • 10-15 min
                </div>
              </div>
              <button
                onClick={() => startStudy('flashcards', 'flashcards')}
                disabled={flashcards.length === 0}
                style={{
                  width: '100%',
                  background: flashcards.length > 0 ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : '#94a3b8',
                  color: 'white',
                  border: 'none',
                  padding: '14px 20px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: flashcards.length > 0 ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease'
                }}
              >
                {flashcards.length > 0 ? '🚀 Iniciar' : 'Nenhum flashcard'}
              </button>
            </div>

            {/* Questões */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e2e8f0',
              transition: 'all 0.2s ease'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                marginBottom: '20px'
              }}>
                📋
              </div>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: '700',
                color: '#1e293b', 
                marginBottom: '12px'
              }}>
                Questões Médicas
              </h3>
              <p style={{ 
                fontSize: '14px', 
                color: '#64748b', 
                lineHeight: '1.6',
                marginBottom: '20px'
              }}>
                Estudos de caso complexos com múltiplas alternativas e justificativas detalhadas.
              </p>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                  {questions.length} questões • 15-25 min
                </div>
              </div>
              <button
                onClick={() => startStudy('questions', 'questions')}
                disabled={questions.length === 0}
                style={{
                  width: '100%',
                  background: questions.length > 0 ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' : '#94a3b8',
                  color: 'white',
                  border: 'none',
                  padding: '14px 20px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: questions.length > 0 ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease'
                }}
              >
                {questions.length > 0 ? '🚀 Iniciar' : 'Importe questões primeiro'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tela de conclusão
  if (isComplete) {
    const totalQuestions = studyType === 'flashcards' ? flashcards.length : questions.length;
    const accuracy = totalQuestions > 0 ? Math.round((stats.correct / totalQuestions) * 100) : 0;

    return (
      <div style={{ 
        padding: '40px 20px',
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 auto',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: '700',
            color: '#1e293b', 
            marginBottom: '16px'
          }}>
            Parabéns! Estudo concluído!
          </h2>
          <p style={{ 
            fontSize: '16px', 
            color: '#64748b', 
            marginBottom: '30px'
          }}>
            Você completou {totalQuestions} {studyType === 'flashcards' ? 'flashcards' : 'questões'}
          </p>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={{
              padding: '20px',
              background: '#f0fdf4',
              borderRadius: '12px',
              border: '1px solid #bbf7d0'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#166534' }}>
                {stats.correct}
              </div>
              <div style={{ fontSize: '12px', color: '#166534' }}>Acertos</div>
            </div>
            <div style={{
              padding: '20px',
              background: '#fef2f2',
              borderRadius: '12px',
              border: '1px solid #fecaca'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#dc2626' }}>
                {stats.incorrect}
              </div>
              <div style={{ fontSize: '12px', color: '#dc2626' }}>Erros</div>
            </div>
            <div style={{
              padding: '20px',
              background: '#f0f9ff',
              borderRadius: '12px',
              border: '1px solid #bae6fd'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#0369a1' }}>
                {accuracy}%
              </div>
              <div style={{ fontSize: '12px', color: '#0369a1' }}>Precisão</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button
              onClick={resetStudy}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              🔄 Estudar Novamente
            </button>
            <button
              onClick={() => setStudyMode(null)}
              style={{
                background: '#f1f5f9',
                color: '#64748b',
                border: '1px solid #e2e8f0',
                padding: '14px 28px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              🏠 Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentItem = studyType === 'flashcards' ? flashcards[currentIndex] : questions[currentIndex];

  if (!currentItem) {
    return (
      <div style={{ 
        padding: '40px',
        textAlign: 'center',
        color: '#64748b'
      }}>
        <h2>Nenhum item encontrado para estudar</h2>
        <button
          onClick={() => setStudyMode(null)}
          style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Voltar
        </button>
      </div>
    );
  }

  // Renderizar flashcard
  if (studyType === 'flashcards') {
    return (
      <FlashcardViewerProMD
        flashcard={currentItem}
        onCorrect={handleCorrect}
        onIncorrect={handleIncorrect}
        onNext={handleNext}
        onDifficultyRate={(level) => {
          // Salvar avaliação de dificuldade no Supabase
          saveDifficultyRating(currentItem.id, level);
        }}
      />
    );
  }

  // Renderizar questão com novo componente
  if (studyType === 'questions') {
    return (
      <QuestionStudyViewerModern
        question={currentItem}
        onCorrect={handleCorrect}
        onIncorrect={handleIncorrect}
        onNext={handleNext}
      />
    );
  }
};

export default Study;

