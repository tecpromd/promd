import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://truepksaojbpgwdtelbb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydWVwa3Nhb2picGd3ZHRlbGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzM0NjcsImV4cCI6MjA3MDE0OTQ2N30.UO0hdlI6IAvJeWDEbrnicMMLNn9ExAV7zPQlEc3DgTk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUpload() {
  try {
    console.log('🧪 Testando upload no Supabase Storage...');
    
    // Criar um arquivo de teste
    const testContent = 'Teste de upload - ' + new Date().toISOString();
    const fileName = `test-${Date.now()}.txt`;
    
    console.log('📝 Criando arquivo de teste:', fileName);
    
    // Fazer upload
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(fileName, testContent, {
        contentType: 'text/plain'
      });

    if (error) {
      console.error('❌ Erro no upload:', error);
      return;
    }

    console.log('✅ Upload realizado com sucesso:', data);

    // Obter URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(fileName);

    console.log('🔗 URL pública:', publicUrl);

    // Listar arquivos no bucket
    const { data: files, error: listError } = await supabase.storage
      .from('uploads')
      .list('', {
        limit: 10,
        offset: 0
      });

    if (listError) {
      console.error('❌ Erro ao listar arquivos:', listError);
    } else {
      console.log('📁 Arquivos no bucket:', files.length);
      files.forEach(file => {
        console.log(`  - ${file.name} (${file.metadata?.size || 'N/A'} bytes)`);
      });
    }

    // Limpar arquivo de teste
    const { error: deleteError } = await supabase.storage
      .from('uploads')
      .remove([fileName]);

    if (deleteError) {
      console.error('❌ Erro ao deletar arquivo de teste:', deleteError);
    } else {
      console.log('🗑️ Arquivo de teste removido');
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testUpload();

