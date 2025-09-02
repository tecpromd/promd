import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://truepksaojbpgwdtelbb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydWVwa3Nhb2picGd3ZHRlbGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzM0NjcsImV4cCI6MjA3MDE0OTQ2N30.UO0hdlI6IAvJeWDEbrnicMMLNn9ExAV7zPQlEc3DgTk';

const supabase = createClient(supabaseUrl, supabaseKey);

const sampleQuestions = [
  {
    title: "Infarto Agudo do Miocárdio - Diagnóstico",
    question: "Um paciente de 55 anos apresenta dor torácica súbita, irradiada para o braço esquerdo, com duração de 2 horas. O ECG mostra elevação do segmento ST em DII, DIII e aVF. Qual é o diagnóstico mais provável?",
    explanation: "A elevação do segmento ST em DII, DIII e aVF indica infarto da parede inferior do ventrículo esquerdo, geralmente causado por oclusão da artéria coronária direita ou circunflexa.",
    difficulty: "medium",
    question_image_url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
    options: [
      { option_text: "Infarto anterior do miocárdio", is_correct: false },
      { option_text: "Infarto inferior do miocárdio", is_correct: true },
      { option_text: "Angina instável", is_correct: false },
      { option_text: "Pericardite aguda", is_correct: false },
      { option_text: "Embolia pulmonar", is_correct: false }
    ]
  },
  {
    title: "Diabetes Mellitus - Complicações",
    question: "Paciente diabético tipo 2, com 15 anos de diagnóstico, apresenta proteinúria persistente e creatinina elevada. Qual é a complicação mais provável?",
    explanation: "A nefropatia diabética é uma das principais complicações microvasculares do diabetes, caracterizada por proteinúria progressiva e deterioração da função renal.",
    difficulty: "easy",
    options: [
      { option_text: "Retinopatia diabética", is_correct: false },
      { option_text: "Neuropatia diabética", is_correct: false },
      { option_text: "Nefropatia diabética", is_correct: true },
      { option_text: "Pé diabético", is_correct: false },
      { option_text: "Cetoacidose diabética", is_correct: false }
    ]
  },
  {
    title: "Hipertensão Arterial - Tratamento",
    question: "Paciente de 45 anos, hipertenso estágio 1, sem outras comorbidades. Qual é a primeira linha de tratamento farmacológico recomendada?",
    explanation: "Para hipertensão estágio 1 sem comorbidades, os inibidores da ECA ou bloqueadores dos receptores da angiotensina (BRA) são considerados primeira linha, junto com diuréticos tiazídicos.",
    difficulty: "easy",
    options: [
      { option_text: "Beta-bloqueadores", is_correct: false },
      { option_text: "Bloqueadores de canal de cálcio", is_correct: false },
      { option_text: "Inibidores da ECA ou BRA", is_correct: true },
      { option_text: "Diuréticos de alça", is_correct: false },
      { option_text: "Alfabloqueadores", is_correct: false }
    ]
  }
];

async function addSampleQuestions() {
  console.log('🔄 Adicionando questões de exemplo...');

  try {
    // Buscar disciplina de Cardiologia
    const { data: disciplines, error: discError } = await supabase
      .from('disciplines')
      .select('id, name')
      .ilike('name', '%cardiolog%')
      .limit(1);

    if (discError) {
      console.error('❌ Erro ao buscar disciplinas:', discError);
      return;
    }

    const disciplineId = disciplines[0]?.id;
    if (!disciplineId) {
      console.log('⚠️ Disciplina de Cardiologia não encontrada, usando primeira disciplina disponível...');
      
      const { data: firstDisc } = await supabase
        .from('disciplines')
        .select('id')
        .limit(1);
      
      if (!firstDisc || firstDisc.length === 0) {
        console.error('❌ Nenhuma disciplina encontrada no banco');
        return;
      }
      
      disciplineId = firstDisc[0].id;
    }

    for (const questionData of sampleQuestions) {
      console.log(`📝 Adicionando: ${questionData.title}`);

      // Inserir questão
      const { data: question, error: qError } = await supabase
        .from('questions')
        .insert({
          question_text: `${questionData.title}\n\n${questionData.question}`,
          explanation: questionData.explanation,
          difficulty: questionData.difficulty,
          question_image_url: questionData.question_image_url,
          question_type: 'multiple_choice',
          is_active: true,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (qError) {
        console.error(`❌ Erro ao inserir questão "${questionData.title}":`, qError);
        continue;
      }

      // Inserir opções
      const optionsToInsert = questionData.options.map((option, index) => ({
        question_id: question.id,
        option_letter: String.fromCharCode(65 + index), // A, B, C, D, E
        option_text: option.option_text,
        is_correct: option.is_correct
      }));

      const { error: optError } = await supabase
        .from('question_options')
        .insert(optionsToInsert);

      if (optError) {
        console.error(`❌ Erro ao inserir opções para "${questionData.title}":`, optError);
      } else {
        console.log(`✅ Questão "${questionData.title}" adicionada com sucesso!`);
      }
    }

    console.log('🎉 Todas as questões de exemplo foram adicionadas!');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

addSampleQuestions();

