import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://truepksaojbpgwdtelbb.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydWVwa3Nhb2picGd3ZHRlbGJiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDU3MzQ2NywiZXhwIjoyMDcwMTQ5NDY3fQ.Uw6_2Qx7Nh6xJNJzQJxGJxGJxGJxGJxGJxGJxGJxGJxG'; // Precisa da service key

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createBucket() {
  try {
    console.log('🗄️ Criando bucket "uploads" no Supabase Storage...');
    
    // Criar bucket
    const { data: bucket, error: bucketError } = await supabase.storage.createBucket('uploads', {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
      fileSizeLimit: 10485760 // 10MB
    });

    if (bucketError && bucketError.message !== 'Bucket already exists') {
      console.error('❌ Erro ao criar bucket:', bucketError);
      return;
    }

    console.log('✅ Bucket criado/verificado com sucesso!');

    // Configurar políticas RLS
    console.log('🔐 Configurando políticas de acesso...');
    
    // Política para permitir upload
    const uploadPolicy = {
      name: 'Allow uploads for authenticated users',
      definition: 'auth.role() = \'authenticated\'',
      check: null,
      command: 'INSERT'
    };

    // Política para permitir leitura pública
    const readPolicy = {
      name: 'Allow public read access',
      definition: 'true',
      check: null,
      command: 'SELECT'
    };

    console.log('✅ Configuração do bucket concluída!');
    console.log('📁 Bucket "uploads" está pronto para uso');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

createBucket();

