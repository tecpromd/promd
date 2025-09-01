import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar questões do Supabase com JOIN das alternativas
  const loadQuestions = async () => {
    try {
      console.log('🔍 Carregando questões do Supabase...');
      setLoading(true);
      setError(null);

      // Query com JOIN para pegar questões e suas alternativas
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select(`
          *,
          question_options (
            id,
            option_letter,
            option_text,
            is_correct,
            explanation
          )
        `)
        .order('created_at', { ascending: true });

      if (questionsError) {
        console.error('❌ Erro ao carregar questões:', questionsError);
        throw questionsError;
      }

      console.log('✅ Questões carregadas:', questionsData?.length || 0);
      
      // Transformar dados para formato esperado pelo frontend
      const formattedQuestions = questionsData?.map(question => ({
        id: question.id,
        title: question.title || `Questão ${question.id.slice(0, 8)}`,
        question: question.question_text,
        question_image_url: question.question_image_url, // Campo correto
        image: question.question_image_url, // Manter compatibilidade
        options: question.question_options?.map(opt => ({
          id: opt.id,
          letter: opt.option_letter,
          text: opt.option_text,
          isCorrect: opt.is_correct,
          explanation: opt.explanation
        })) || [],
        category: question.category || 'Medicina Geral',
        difficulty: question.difficulty || 'medium',
        source: question.source || 'ProMD',
        tags: question.tags || [],
        created_at: question.created_at,
        updated_at: question.updated_at
      })) || [];

      setQuestions(formattedQuestions);
      console.log('✅ Questões formatadas:', formattedQuestions.length);
      
    } catch (err) {
      console.error('❌ Erro ao carregar questões:', err);
      setError(err.message);
      
      // NÃO usar localStorage - apenas dados reais do Supabase
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Criar nova questão
  const createQuestion = async (questionData) => {
    try {
      console.log('➕ Criando nova questão...');
      
      // Inserir questão principal
      const { data: newQuestion, error: questionError } = await supabase
        .from('questions')
        .insert([{
          title: questionData.title,
          question_text: questionData.question,
          question_image_url: questionData.image,
          category: questionData.category,
          difficulty: questionData.difficulty,
          source: questionData.source,
          tags: questionData.tags
        }])
        .select()
        .single();

      if (questionError) throw questionError;

      // Inserir alternativas
      if (questionData.options && questionData.options.length > 0) {
        const optionsToInsert = questionData.options.map(option => ({
          question_id: newQuestion.id,
          option_letter: option.letter,
          option_text: option.text,
          is_correct: option.isCorrect,
          explanation: option.explanation
        }));

        const { error: optionsError } = await supabase
          .from('question_options')
          .insert(optionsToInsert);

        if (optionsError) throw optionsError;
      }

      console.log('✅ Questão criada com sucesso');
      await loadQuestions(); // Recarregar lista
      
      return newQuestion;
    } catch (err) {
      console.error('❌ Erro ao criar questão:', err);
      throw err;
    }
  };

  // Atualizar questão
  const updateQuestion = async (id, questionData) => {
    try {
      console.log('📝 Atualizando questão:', id);
      
      const { error } = await supabase
        .from('questions')
        .update({
          title: questionData.title,
          question_text: questionData.question,
          question_image_url: questionData.image,
          category: questionData.category,
          difficulty: questionData.difficulty,
          source: questionData.source,
          tags: questionData.tags,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      console.log('✅ Questão atualizada com sucesso');
      await loadQuestions(); // Recarregar lista
      
    } catch (err) {
      console.error('❌ Erro ao atualizar questão:', err);
      throw err;
    }
  };

  // Deletar questão
  const deleteQuestion = async (id) => {
    try {
      console.log('🗑️ Deletando questão:', id);
      
      // Deletar alternativas primeiro (devido à foreign key)
      await supabase
        .from('question_options')
        .delete()
        .eq('question_id', id);

      // Deletar questão
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      console.log('✅ Questão deletada com sucesso');
      await loadQuestions(); // Recarregar lista
      
    } catch (err) {
      console.error('❌ Erro ao deletar questão:', err);
      throw err;
    }
  };

  // Atualizar imagem da questão
  const updateQuestionImage = async (questionId, imageUrl) => {
    try {
      console.log('🖼️ Atualizando imagem da questão:', questionId);
      
      const { data, error } = await supabase
        .from('questions')
        .update({ question_image_url: imageUrl })
        .eq('id', questionId)
        .select()
        .single();

      if (error) throw error;

      // Atualizar na lista local
      setQuestions(prev => 
        prev.map(question => 
          question.id === questionId 
            ? { ...question, image: imageUrl }
            : question
        )
      );

      console.log('✅ Imagem da questão atualizada');
      return { data, error: null };
    } catch (err) {
      console.error('❌ Erro ao atualizar imagem da questão:', err);
      return { data: null, error: err };
    }
  };

  // Carregar questões ao montar o componente
  useEffect(() => {
    loadQuestions();
  }, []);

  return {
    questions,
    loading,
    error,
    loadQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    updateQuestionImage
  };
}

