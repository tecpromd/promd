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
  'Medicina Geral': 99
};

async function addQuestionNumbers() {
  console.log('🔄 Adicionando números às questões...');

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

    console.log(`📊 Encontradas ${questions.length} questões`);

    // 2. Agrupar questões por disciplina e atribuir números
    const questionsByDiscipline = {};
    
    for (const question of questions) {
      // Identificar disciplina pelo conteúdo
      let discipline = 'Medicina Geral';
      
      const questionText = question.question_text.toLowerCase();
      if (questionText.includes('infarto') || questionText.includes('cardio') || questionText.includes('miocárdio')) {
        discipline = 'Cardiologia';
      } else if (questionText.includes('diabetes') || questionText.includes('endocrin')) {
        discipline = 'Endocrinologia';
      } else if (questionText.includes('hipertensão') || questionText.includes('pressão arterial')) {
        discipline = 'Cardiologia';
      } else if (questionText.includes('meningit') || questionText.includes('neuro')) {
        discipline = 'Neurologia';
      } else if (questionText.includes('pneumonia') || questionText.includes('respirat')) {
        discipline = 'Pneumologia';
      } else if (questionText.includes('depres') || questionText.includes('psiquiat')) {
        discipline = 'Psiquiatria';
      } else if (questionText.includes('crohn') || questionText.includes('gastro')) {
        discipline = 'Gastroenterologia';
      } else if (questionText.includes('graves') || questionText.includes('tireoid')) {
        discipline = 'Endocrinologia';
      }

      if (!questionsByDiscipline[discipline]) {
        questionsByDiscipline[discipline] = [];
      }
      questionsByDiscipline[discipline].push(question);
    }

    // 3. Atualizar questões com números
    let totalUpdated = 0;
    
    for (const [discipline, disciplineQuestions] of Object.entries(questionsByDiscipline)) {
      const disciplineId = disciplineMapping[discipline] || 99;
      console.log(`\n📚 ${discipline} (ID: ${disciplineId}) - ${disciplineQuestions.length} questões`);

      for (let i = 0; i < disciplineQuestions.length; i++) {
        const question = disciplineQuestions[i];
        const questionNumber = i + 1;
        const numericId = parseInt(`${disciplineId}${questionNumber.toString().padStart(2, '0')}`);

        console.log(`  📝 ${question.id.slice(0, 8)}... → ${numericId}`);

        // Atualizar questão apenas com número
        const { error: updateError } = await supabase
          .from('questions')
          .update({ 
            question_number: numericId
          })
          .eq('id', question.id);

        if (updateError) {
          console.error(`❌ Erro ao atualizar questão ${question.id}:`, updateError);
        } else {
          totalUpdated++;
        }
      }
    }

    console.log(`\n🎉 Atualização concluída! ${totalUpdated} questões numeradas.`);
    
    // 4. Verificar resultado
    const { data: numberedQuestions, error: verifyError } = await supabase
      .from('questions')
      .select('question_number, question_text')
      .order('question_number', { ascending: true });

    if (!verifyError && numberedQuestions) {
      console.log('\n✅ Questões numeradas:');
      numberedQuestions.forEach(q => {
        if (q.question_number) {
          const title = q.question_text.split('\n')[0].substring(0, 50) + '...';
          console.log(`  ${q.question_number}: ${title}`);
        }
      });
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

addQuestionNumbers();

