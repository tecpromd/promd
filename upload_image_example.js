import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://truepksaojbpgwdtelbb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydWVwa3Nhb2picGd3ZHRlbGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzM0NjcsImV4cCI6MjA3MDE0OTQ2N30.UO0hdlI6IAvJeWDEbrnicMMLNn9ExAV7zPQlEc3DgTk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function uploadImageAndUpdateQuestion() {
  try {
    console.log('🔄 Iniciando upload da imagem...');
    
    // 1. Fazer upload da imagem
    const imageFile = fs.readFileSync('/home/ubuntu/upload/search_images/BV2YeqLm0ZOn.jpg');
    const fileName = `ecg_example_${Date.now()}.jpg`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(`medical/${fileName}`, imageFile, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('❌ Erro no upload:', uploadError);
      return;
    }

    // 2. Obter URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(`medical/${fileName}`);

    console.log('✅ Imagem enviada:', publicUrl);

    // 3. Buscar primeira questão
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

    console.log('📋 Primeira questão encontrada:', questions[0].title);

    // 4. Atualizar primeira questão com a imagem
    const { data: updateData, error: updateError } = await supabase
      .from('questions')
      .update({ question_image_url: publicUrl })
      .eq('id', questions[0].id)
      .select();

    if (updateError) {
      console.error('❌ Erro ao atualizar questão:', updateError);
      return;
    }

    console.log('✅ Questão atualizada com imagem ECG!');
    console.log('📊 Questão:', updateData[0].title);
    console.log('🖼️ URL da imagem:', updateData[0].question_image_url);

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

uploadImageAndUpdateQuestion();

