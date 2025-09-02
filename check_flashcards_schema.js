import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://truepksaojbpgwdtelbb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydWVwa3Nhb2picGd3ZHRlbGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzM0NjcsImV4cCI6MjA3MDE0OTQ2N30.UO0hdlI6IAvJeWDEbrnicMMLNn9ExAV7zPQlEc3DgTk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkFlashcardsSchema() {
  console.log('🔍 Verificando schema da tabela flashcards...');

  try {
    // Tentar obter um flashcard para ver os campos disponíveis
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Erro ao consultar flashcards:', error);
      return;
    }

    if (data && data.length > 0) {
      console.log('📋 Campos disponíveis na tabela flashcards:');
      console.log(Object.keys(data[0]));
      console.log('\n📄 Exemplo de flashcard:');
      console.log(data[0]);
    } else {
      console.log('📋 Tabela flashcards está vazia');
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

checkFlashcardsSchema();

