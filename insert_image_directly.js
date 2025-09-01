import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://truepksaojbpgwdtelbb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydWVwa3Nhb2picGd3ZHRlbGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzM0NjcsImV4cCI6MjA3MDE0OTQ2N30.UO0hdlI6IAvJeWDEbrnicMMLNn9ExAV7zPQlEc3DgTk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function insertImageExample() {
  try {
    console.log('🔄 Buscando primeira questão...');
    
    // 1. Buscar primeira questão
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(1);

    if (questionsError) {
      console.error('❌ Erro ao buscar questões:', questionsError);
      return;
    }

    if (questions.length === 0) {
      console.log('❌ Nenhuma questão encontrada');
      return;
    }

    console.log('📋 Primeira questão encontrada:', questions[0].question_text);

    // 2. URL de imagem ECG de exemplo (usando uma URL pública)
    const imageUrl = 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop';

    // 3. Atualizar primeira questão com a imagem
    const { data: updateData, error: updateError } = await supabase
      .from('questions')
      .update({ question_image_url: imageUrl })
      .eq('id', questions[0].id)
      .select();

    if (updateError) {
      console.error('❌ Erro ao atualizar questão:', updateError);
      return;
    }

    console.log('✅ Questão atualizada com imagem de exemplo!');
    console.log('📊 Questão:', updateData[0].question_text);
    console.log('🖼️ URL da imagem:', updateData[0].question_image_url);

    // 4. Verificar se a atualização funcionou
    const { data: verifyData, error: verifyError } = await supabase
      .from('questions')
      .select('id, question_text, question_image_url')
      .eq('id', questions[0].id)
      .single();

    if (verifyError) {
      console.error('❌ Erro na verificação:', verifyError);
      return;
    }

    console.log('🔍 Verificação:', verifyData);

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

insertImageExample();

