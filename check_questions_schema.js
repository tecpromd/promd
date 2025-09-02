import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://truepksaojbpgwdtelbb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydWVwa3Nhb2picGd3ZHRlbGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzM0NjcsImV4cCI6MjA3MDE0OTQ2N30.UO0hdlI6IAvJeWDEbrnicMMLNn9ExAV7zPQlEc3DgTk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log('🔍 Verificando schema da tabela questions...');

  try {
    // Buscar uma questão existente para ver os campos
    const { data: questions, error } = await supabase
      .from('questions')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Erro ao buscar questões:', error);
      return;
    }

    if (questions && questions.length > 0) {
      console.log('✅ Campos disponíveis na tabela questions:');
      console.log(Object.keys(questions[0]));
      console.log('\n📄 Exemplo de questão:');
      console.log(JSON.stringify(questions[0], null, 2));
    } else {
      console.log('⚠️ Nenhuma questão encontrada na tabela');
    }

    // Verificar opções
    console.log('\n🔍 Verificando tabela question_options...');
    const { data: options, error: optError } = await supabase
      .from('question_options')
      .select('*')
      .limit(1);

    if (optError) {
      console.error('❌ Erro ao buscar opções:', optError);
    } else if (options && options.length > 0) {
      console.log('✅ Campos disponíveis na tabela question_options:');
      console.log(Object.keys(options[0]));
    } else {
      console.log('⚠️ Nenhuma opção encontrada na tabela');
    }

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

checkSchema();

