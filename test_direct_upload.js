import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://truepksaojbpgwdtelbb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydWVwa3Nhb2picGd3ZHRlbGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzM0NjcsImV4cCI6MjA3MDE0OTQ2N30.UO0hdlI6IAvJeWDEbrnicMMLNn9ExAV7zPQlEc3DgTk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDirectUpload() {
  console.log('🧪 Testando upload direto no bucket "uploads"...');

  try {
    // Criar um arquivo de teste simples (1x1 pixel PNG)
    const testContent = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const buffer = Buffer.from(testContent.split(',')[1], 'base64');
    
    const fileName = `test-upload-${Date.now()}.png`;
    const filePath = `images/${fileName}`;

    console.log('📤 Tentando upload:', filePath);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(filePath, buffer, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('❌ Erro no upload:', uploadError);
      console.error('📋 Detalhes:', {
        message: uploadError.message,
        statusCode: uploadError.statusCode,
        error: uploadError.error
      });
      return;
    }

    console.log('✅ Upload realizado com sucesso!');
    console.log('📁 Dados do upload:', uploadData);

    // Obter URL pública
    const { data: urlData } = supabase.storage
      .from('uploads')
      .getPublicUrl(filePath);

    console.log('🔗 URL pública:', urlData.publicUrl);

    // Testar acesso à URL
    try {
      const response = await fetch(urlData.publicUrl);
      console.log('🌐 Status da URL:', response.status, response.statusText);
      
      if (response.ok) {
        console.log('🎉 UPLOAD FUNCIONANDO PERFEITAMENTE!');
      }
    } catch (fetchError) {
      console.error('❌ Erro ao acessar URL:', fetchError);
    }

    // Limpar arquivo de teste
    const { error: deleteError } = await supabase.storage
      .from('uploads')
      .remove([filePath]);

    if (deleteError) {
      console.error('⚠️ Erro ao deletar:', deleteError);
    } else {
      console.log('🗑️ Arquivo de teste removido');
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testDirectUpload();

