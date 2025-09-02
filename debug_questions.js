import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://truepksaojbpgwdtelbb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydWVwa3Nhb2picGd3ZHRlbGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzM0NjcsImV4cCI6MjA3MDE0OTQ2N30.UO0hdlI6IAvJeWDEbrnicMMLNn9ExAV7zPQlEc3DgTk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugQuestions() {
  try {
    console.log('🔍 Verificando questões no banco...');
    
    // 1. Verificar estrutura da tabela
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .limit(3);

    if (questionsError) {
      console.error('❌ Erro ao buscar questões:', questionsError);
      return;
    }

    console.log('📊 Total de questões encontradas:', questions.length);
    
    if (questions.length > 0) {
      console.log('📋 Primeira questão:');
      console.log('- ID:', questions[0].id);
      console.log('- Texto:', questions[0].question_text?.substring(0, 100) + '...');
      console.log('- Imagem URL:', questions[0].question_image_url);
      console.log('- Campos disponíveis:', Object.keys(questions[0]));
    }

    // 2. Verificar se há questões com imagens
    const { data: questionsWithImages, error: imagesError } = await supabase
      .from('questions')
      .select('id, question_text, question_image_url')
      .not('question_image_url', 'is', null);

    if (imagesError) {
      console.error('❌ Erro ao buscar questões com imagens:', imagesError);
    } else {
      console.log('🖼️ Questões com imagens:', questionsWithImages.length);
      questionsWithImages.forEach((q, i) => {
        console.log(`- Questão ${i+1}: ${q.question_image_url}`);
      });
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

debugQuestions();

