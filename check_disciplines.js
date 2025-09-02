import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://truepksaojbpgwdtelbb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydWVwa3Nhb2picGd3ZHRlbGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzM0NjcsImV4cCI6MjA3MDE0OTQ2N30.UO0hdlI6IAvJeWDEbrnicMMLNn9ExAV7zPQlEc3DgTk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDisciplines() {
  console.log('🔍 Verificando disciplinas no banco...');
  
  try {
    const { data: disciplines, error } = await supabase
      .from('disciplines')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('❌ Erro ao buscar disciplinas:', error);
      return;
    }
    
    console.log(`✅ Encontradas ${disciplines.length} disciplinas:`);
    disciplines.forEach((disc, index) => {
      console.log(`${index + 1}. ${disc.name} (${disc.code}) - ${disc.description || 'Sem descrição'}`);
    });
    
    // Verificar questões por disciplina
    console.log('\n📊 Questões por disciplina:');
    for (const disc of disciplines) {
      const { data: questions, error: qError } = await supabase
        .from('questions')
        .select('id')
        .eq('discipline_id', disc.id);
      
      if (!qError) {
        console.log(`${disc.name}: ${questions.length} questões`);
      }
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

checkDisciplines();

