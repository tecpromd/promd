import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://truepksaojbpgwdtelbb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydWVwa3Nhb2picGd3ZHRlbGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzM0NjcsImV4cCI6MjA3MDE0OTQ2N30.UO0hdlI6IAvJeWDEbrnicMMLNn9ExAV7zPQlEc3DgTk';

const supabase = createClient(supabaseUrl, supabaseKey);

// Mapeamento de disciplinas para IDs numéricos
const disciplineMapping = {
  'Cardiologia': 1,
  'Neurologia': 2,
  'Dermatologia': 3,
  'Farmacologia': 4,
  'Bioquímica': 5,
  'Pediatria': 6,
  'Ortopedia': 7,
  'Oftalmologia': 8,
  'Pneumologia': 9,
  'Gastroenterologia': 10,
  'Endocrinologia': 11,
  'Psiquiatria': 12,
  'Ginecologia': 13,
  'Urologia': 14,
  'Medicina Geral': 99 // Padrão para questões gerais
};

async function updateQuestionIds() {
  console.log('🔄 Atualizando IDs das questões para formato numérico...');

  try {
    // 1. Buscar todas as questões
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: true });

    if (questionsError) {
      console.error('❌ Erro ao buscar questões:', questionsError);
      return;
    }

    console.log(`📊 Encontradas ${questions.length} questões para atualizar`);

    // 2. Agrupar questões por disciplina
    const questionsByDiscipline = {};
    
    for (const question of questions) {
      // Extrair disciplina do texto da questão ou usar padrão
      let discipline = 'Medicina Geral';
      
      // Tentar identificar disciplina pelo conteúdo
      const questionText = question.question_text.toLowerCase();
      if (questionText.includes('infarto') || questionText.includes('cardio')) {
        discipline = 'Cardiologia';
      } else if (questionText.includes('diabetes') || questionText.includes('endocrin')) {
        discipline = 'Endocrinologia';
      } else if (questionText.includes('hipertensão') || questionText.includes('pressão')) {
        discipline = 'Cardiologia';
      } else if (questionText.includes('meningit') || questionText.includes('neuro')) {
        discipline = 'Neurologia';
      }

      if (!questionsByDiscipline[discipline]) {
        questionsByDiscipline[discipline] = [];
      }
      questionsByDiscipline[discipline].push(question);
    }

    // 3. Atualizar IDs das questões
    let totalUpdated = 0;
    
    for (const [discipline, disciplineQuestions] of Object.entries(questionsByDiscipline)) {
      const disciplineId = disciplineMapping[discipline] || 99;
      console.log(`\n📚 Processando ${discipline} (ID: ${disciplineId}) - ${disciplineQuestions.length} questões`);

      for (let i = 0; i < disciplineQuestions.length; i++) {
        const question = disciplineQuestions[i];
        const questionNumber = i + 1;
        const newId = `${disciplineId}${questionNumber.toString().padStart(2, '0')}`; // Ex: 101, 102, 201, etc.

        console.log(`  📝 ${question.id} → ${newId}`);

        // Atualizar questão com novo ID
        const { error: updateError } = await supabase
          .from('questions')
          .update({ 
            id: newId,
            question_text: `Questão ${newId} - ${discipline}\n\n${question.question_text.split('\n\n').slice(1).join('\n\n')}`
          })
          .eq('id', question.id);

        if (updateError) {
          console.error(`❌ Erro ao atualizar questão ${question.id}:`, updateError);
        } else {
          totalUpdated++;
        }

        // Atualizar opções da questão
        const { error: optionsError } = await supabase
          .from('question_options')
          .update({ question_id: newId })
          .eq('question_id', question.id);

        if (optionsError) {
          console.error(`❌ Erro ao atualizar opções da questão ${question.id}:`, optionsError);
        }
      }
    }

    console.log(`\n🎉 Atualização concluída! ${totalUpdated} questões atualizadas.`);
    
    // 4. Verificar resultado
    const { data: updatedQuestions, error: verifyError } = await supabase
      .from('questions')
      .select('id, question_text')
      .order('id', { ascending: true });

    if (!verifyError) {
      console.log('\n✅ Questões com novos IDs:');
      updatedQuestions.forEach(q => {
        const title = q.question_text.split('\n')[0];
        console.log(`  ${q.id}: ${title}`);
      });
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

updateQuestionIds();

