import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://truepksaojbpgwdtelbb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydWVwa3Nhb2picGd3ZHRlbGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzM0NjcsImV4cCI6MjA3MDE0OTQ2N30.UO0hdlI6IAvJeWDEbrnicMMLNn9ExAV7zPQlEc3DgTk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpload() {
  console.log('🧪 Testando upload de imagem...');

  try {
    // 1. Verificar se o bucket existe
    console.log('1️⃣ Verificando bucket "uploads"...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Erro ao listar buckets:', bucketsError);
      return;
    }
    
    console.log('📁 Buckets disponíveis:', buckets.map(b => b.name));
    
    const uploadsBucket = buckets.find(b => b.name === 'uploads');
    if (!uploadsBucket) {
      console.error('❌ Bucket "uploads" não encontrado!');
      return;
    }
    
    console.log('✅ Bucket "uploads" encontrado:', uploadsBucket);

    // 2. Verificar políticas do bucket
    console.log('2️⃣ Verificando políticas...');
    const { data: policies, error: policiesError } = await supabase
      .from('storage.policies')
      .select('*')
      .eq('bucket_id', 'uploads');
    
    if (policiesError) {
      console.log('⚠️ Não foi possível verificar políticas:', policiesError);
    } else {
      console.log('🔐 Políticas do bucket:', policies);
    }

    // 3. Tentar fazer upload de um arquivo de teste
    console.log('3️⃣ Testando upload...');
    
    // Criar um arquivo de teste simples
    const testContent = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const buffer = Buffer.from(testContent.split(',')[1], 'base64');
    
    const fileName = `test-${Date.now()}.png`;
    const filePath = `images/${fileName}`;

    console.log('📤 Fazendo upload:', filePath);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(filePath, buffer, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('❌ Erro no upload:', uploadError);
      console.error('📋 Detalhes do erro:', {
        message: uploadError.message,
        statusCode: uploadError.statusCode,
        error: uploadError.error
      });
      return;
    }

    console.log('✅ Upload realizado com sucesso:', uploadData);

    // 4. Obter URL pública
    console.log('4️⃣ Obtendo URL pública...');
    const { data: urlData } = supabase.storage
      .from('uploads')
      .getPublicUrl(filePath);

    console.log('🔗 URL pública:', urlData.publicUrl);

    // 5. Testar acesso à URL
    console.log('5️⃣ Testando acesso à URL...');
    try {
      const response = await fetch(urlData.publicUrl);
      console.log('🌐 Status da URL:', response.status, response.statusText);
    } catch (fetchError) {
      console.error('❌ Erro ao acessar URL:', fetchError);
    }

    // 6. Limpar arquivo de teste
    console.log('6️⃣ Limpando arquivo de teste...');
    const { error: deleteError } = await supabase.storage
      .from('uploads')
      .remove([filePath]);

    if (deleteError) {
      console.error('⚠️ Erro ao deletar arquivo de teste:', deleteError);
    } else {
      console.log('🗑️ Arquivo de teste removido');
    }

    console.log('🎉 Teste concluído com sucesso!');

  } catch (error) {
    console.error('❌ Erro geral no teste:', error);
  }
}

testUpload();

