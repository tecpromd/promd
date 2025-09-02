// Sistema Completo de Justificativas Médicas ProMD
// Baseado no padrão USMLE Step 1 com explicações detalhadas

export const completeExplanations = {
  // Questão 1: Postoperative Neuropathy Symptoms (Anatomia)
  "090001": {
    question: "A 40-year-old man presents with stabbing pain in his left groin area following an inguinal hernia repair performed three weeks ago. During the examination, lightly touching the upper medial thigh elicits a sharp pain response. Which nerve is most likely injured in this patient?",
    options: {
      "A": {
        text: "Femoral",
        explanation: "INCORRETO. O nervo femoral inerva a parte anterior da coxa e não seria afetado por uma cirurgia de hérnia inguinal. A lesão do nervo femoral causaria fraqueza na extensão do joelho e perda sensorial na parte anterior da coxa.",
        isCorrect: false
      },
      "B": {
        text: "Genital branch of the genitofemoral",
        explanation: "INCORRETO. O ramo genital do nervo genitofemoral inerva o escroto e não a coxa medial superior. Sua lesão causaria perda sensorial no escroto, não na área descrita.",
        isCorrect: false
      },
      "C": {
        text: "Iliohypogastric",
        explanation: "INCORRETO. O nervo ílio-hipogástrico inerva a pele sobre a região suprapúbica e não a coxa medial superior. Sua lesão causaria dormência na região suprapúbica.",
        isCorrect: false
      },
      "D": {
        text: "Ilioinguinal",
        explanation: "CORRETO. O nervo ilioinguinal passa através do canal inguinal e inerva a coxa medial superior. Durante a cirurgia de hérnia inguinal, este nervo pode ser lesionado, causando dor neuropática e hipersensibilidade na distribuição do nervo, que inclui a coxa medial superior.",
        isCorrect: true
      },
      "E": {
        text: "Obturator",
        explanation: "INCORRETO. O nervo obturador inerva a coxa medial, mas passa pelo forame obturador e não seria afetado por uma cirurgia de hérnia inguinal. Sua lesão causaria fraqueza na adução da coxa.",
        isCorrect: false
      }
    },
    clinicalPearls: [
      "A lesão do nervo ilioinguinal é uma complicação conhecida da cirurgia de hérnia inguinal",
      "O teste de Tinel pode ser positivo sobre o nervo lesionado",
      "O tratamento pode incluir bloqueios nervosos ou neurólise"
    ],
    imageIds: ["lumbar_plexus_anatomy"],
    difficulty: "medium",
    discipline: "Anatomia",
    tags: ["neurologia", "cirurgia", "dor neuropática"]
  },

  // Questão 2: Pulmonary/Cardiac (Cardiologia)
  "090002": {
    question: "A 52-year-old man presents to the clinic with complaints of increasing fatigue and shortness of breath while walking. He mentions that he often experiences numbness and a tingling sensation in his fingers during colder weather, which resolves with warming. His medical history includes rheumatoid arthritis, and he reports difficulty swallowing. On physical examination, there are subcutaneous nodules over the elbows and tightness of the skin on the hands. Auscultation of the heart reveals a prominent S2. He has mild hepatomegaly and exhibits bilateral lower extremity edema. Spirometry results are as follows: Forced vital capacity (FVC): Normal, Forced expiratory volume in 1 second (FEV1): Normal, FEV1/FVC ratio: Normal. Which of the following is the most likely cause of this patient's dyspnea?",
    options: {
      "A": {
        text: "Pulmonary fibrosis",
        explanation: "INCORRETO. Embora a fibrose pulmonar possa ocorrer na esclerose sistêmica, a espirometria normal torna este diagnóstico menos provável. Na fibrose pulmonar, esperaríamos uma redução da capacidade vital forçada (FVC).",
        isCorrect: false
      },
      "B": {
        text: "Pulmonary hypertension",
        explanation: "INCORRETO. A hipertensão pulmonar pode ocorrer na esclerose sistêmica, mas os achados de hepatomegalia e edema bilateral sugerem mais insuficiência cardíaca direita secundária à doença cardíaca primária.",
        isCorrect: false
      },
      "C": {
        text: "Congestive heart failure",
        explanation: "CORRETO. A combinação de dispneia aos esforços, edema bilateral de membros inferiores, hepatomegalia e S2 proeminente são achados clássicos de insuficiência cardíaca congestiva. Na esclerose sistêmica, o envolvimento cardíaco pode causar cardiomiopatia e insuficiência cardíaca.",
        isCorrect: true
      },
      "D": {
        text: "Restrictive lung disease",
        explanation: "INCORRETO. A doença pulmonar restritiva causaria redução da FVC na espirometria, o que não é observado neste caso. Os valores espirométricos normais tornam este diagnóstico improvável.",
        isCorrect: false
      },
      "E": {
        text: "Asthma",
        explanation: "INCORRETO. A asma causaria obstrução das vias aéreas com redução da relação FEV1/FVC, o que não é observado. Além disso, os achados sistêmicos não são consistentes com asma.",
        isCorrect: false
      }
    },
    clinicalPearls: [
      "A esclerose sistêmica pode afetar múltiplos órgãos, incluindo coração, pulmões, rins e trato gastrointestinal",
      "O fenômeno de Raynaud é comum na esclerose sistêmica",
      "A espirometria normal não exclui doença pulmonar precoce na esclerose sistêmica"
    ],
    imageIds: ["spirometry_normal", "heart_failure_signs"],
    difficulty: "hard",
    discipline: "Cardiologia",
    tags: ["insuficiência cardíaca", "esclerose sistêmica", "dispneia"]
  },

  // Questão 3: Bacterial Meningitis (Infectologia)
  "130001": {
    question: "A 25-year-old college student presents to the emergency department with a 6-hour history of severe headache, fever, and neck stiffness. Physical examination reveals positive Kernig's and Brudzinski's signs. Lumbar puncture shows: Opening pressure: 350 mmH2O (normal: 70-180), CSF glucose: 25 mg/dL (serum glucose: 120 mg/dL), CSF protein: 180 mg/dL (normal: 15-45), WBC count: 2,500/μL with 85% neutrophils. Gram stain shows gram-positive diplococci. What is the most likely causative organism?",
    options: {
      "A": {
        text: "Neisseria meningitidis",
        explanation: "INCORRETO. Neisseria meningitidis são cocos gram-negativos, não gram-positivos. Embora seja uma causa comum de meningite em adultos jovens, a coloração de Gram não é consistente.",
        isCorrect: false
      },
      "B": {
        text: "Streptococcus pneumoniae",
        explanation: "CORRETO. Streptococcus pneumoniae são cocos gram-positivos que frequentemente aparecem em pares (diplococos). É a causa mais comum de meningite bacteriana em adultos e os achados do LCR são consistentes com meningite bacteriana.",
        isCorrect: true
      },
      "C": {
        text: "Haemophilus influenzae",
        explanation: "INCORRETO. Haemophilus influenzae são bacilos gram-negativos pequenos, não cocos gram-positivos. Além disso, é mais comum em crianças não vacinadas.",
        isCorrect: false
      },
      "D": {
        text: "Listeria monocytogenes",
        explanation: "INCORRETO. Listeria monocytogenes são bacilos gram-positivos, não cocos. É mais comum em neonatos, idosos e imunocomprometidos.",
        isCorrect: false
      },
      "E": {
        text: "Enterococcus faecalis",
        explanation: "INCORRETO. Embora sejam cocos gram-positivos, Enterococcus raramente causa meningite em adultos jovens saudáveis. É mais comum em pacientes com fatores de risco específicos.",
        isCorrect: false
      }
    },
    clinicalPearls: [
      "A tríade clássica da meningite inclui febre, cefaleia e rigidez nucal",
      "O LCR na meningite bacteriana mostra pleocitose neutrofílica, proteína elevada e glicose baixa",
      "S. pneumoniae é a causa mais comum de meningite bacteriana em adultos"
    ],
    imageIds: ["csf_analysis", "gram_stain_pneumococcus"],
    difficulty: "medium",
    discipline: "Infectologia",
    tags: ["meningite", "LCR", "gram-positivos"]
  },

  // Questão 4: Systemic Sclerosis (Reumatologia)
  "160001": {
    question: "A 45-year-old woman presents with a 2-year history of progressive skin thickening on her hands and face. She reports difficulty opening her mouth fully and has noticed that her fingers turn white and blue in cold weather. Laboratory tests reveal positive ANA with a nucleolar pattern and positive anti-Scl-70 antibodies. Which of the following complications is she at highest risk for developing?",
    options: {
      "A": {
        text: "Pulmonary arterial hypertension",
        explanation: "POSSÍVEL. A hipertensão arterial pulmonar pode ocorrer na esclerose sistêmica, especialmente na forma limitada. No entanto, a presença de anti-Scl-70 sugere forma difusa.",
        isCorrect: false
      },
      "B": {
        text: "Interstitial lung disease",
        explanation: "CORRETO. A presença de anticorpos anti-Scl-70 (anti-topoisomerase I) está fortemente associada ao desenvolvimento de doença pulmonar intersticial na esclerose sistêmica difusa. Este é o principal fator de risco para esta complicação.",
        isCorrect: true
      },
      "C": {
        text: "Renal crisis",
        explanation: "POSSÍVEL. A crise renal esclerodérmica pode ocorrer, especialmente na forma difusa, mas é menos comum que a doença pulmonar intersticial em pacientes com anti-Scl-70.",
        isCorrect: false
      },
      "D": {
        text: "Cardiac arrhythmias",
        explanation: "INCORRETO. Embora o envolvimento cardíaco possa ocorrer, não é a complicação mais comum associada aos anticorpos anti-Scl-70.",
        isCorrect: false
      },
      "E": {
        text: "Gastrointestinal bleeding",
        explanation: "INCORRETO. O sangramento gastrointestinal pode ocorrer devido à gastropatia vascular, mas não é a principal complicação associada aos anti-Scl-70.",
        isCorrect: false
      }
    },
    clinicalPearls: [
      "Anti-Scl-70 está associado à esclerose sistêmica difusa e doença pulmonar intersticial",
      "Anti-centrômero está mais associado à forma limitada e hipertensão pulmonar",
      "O fenômeno de Raynaud é frequentemente o primeiro sintoma"
    ],
    imageIds: ["scleroderma_hands", "interstitial_lung_disease"],
    difficulty: "hard",
    discipline: "Reumatologia",
    tags: ["esclerose sistêmica", "anticorpos", "doença pulmonar"]
  },

  // Questão 5: Graves Disease (Endocrinologia)
  "120001": {
    question: "A 28-year-old woman presents with a 3-month history of weight loss, palpitations, heat intolerance, and tremor. Physical examination reveals tachycardia, warm moist skin, and bilateral exophthalmos. Laboratory tests show: TSH < 0.01 mU/L (normal: 0.4-4.0), Free T4: 4.2 ng/dL (normal: 0.8-1.8), Free T3: 650 pg/dL (normal: 230-420). Which of the following is the most appropriate initial treatment?",
    options: {
      "A": {
        text: "Radioactive iodine therapy",
        explanation: "INCORRETO como tratamento inicial. O iodo radioativo é uma opção de tratamento definitivo, mas não é apropriado como terapia inicial, especialmente em mulheres jovens em idade reprodutiva.",
        isCorrect: false
      },
      "B": {
        text: "Methimazole",
        explanation: "CORRETO. Methimazole é um medicamento antitireoidiano que bloqueia a síntese de hormônios tireoidianos. É o tratamento inicial de escolha para hipertireoidismo, especialmente em mulheres jovens.",
        isCorrect: true
      },
      "C": {
        text: "Propylthiouracil",
        explanation: "POSSÍVEL, mas não a primeira escolha. PTU é reservado para situações específicas como gravidez no primeiro trimestre ou intolerância ao methimazole devido ao maior risco de hepatotoxicidade.",
        isCorrect: false
      },
      "D": {
        text: "Thyroidectomy",
        explanation: "INCORRETO como tratamento inicial. A cirurgia é considerada quando há contraindicações ou falha do tratamento médico, mas não é a primeira linha de tratamento.",
        isCorrect: false
      },
      "E": {
        text: "Beta-blockers only",
        explanation: "INCORRETO. Beta-bloqueadores ajudam com sintomas como taquicardia e tremor, mas não tratam a causa subjacente do hipertireoidismo. Devem ser usados como terapia adjuvante.",
        isCorrect: false
      }
    },
    clinicalPearls: [
      "Methimazole é preferido ao PTU devido ao menor risco de hepatotoxicidade",
      "Beta-bloqueadores devem ser adicionados para controle sintomático",
      "A oftalmopatia de Graves pode piorar com iodo radioativo"
    ],
    imageIds: ["graves_ophthalmopathy", "thyroid_function_tests"],
    difficulty: "medium",
    discipline: "Endocrinologia",
    tags: ["hipertireoidismo", "Graves", "antitireoidianos"]
  }
};

/**
 * Busca explicação por ID da questão
 * @param {string} questionId - ID da questão
 * @returns {object|null} - Explicação completa ou null
 */
export const getExplanationById = (questionId) => {
  return completeExplanations[questionId] || null;
};

/**
 * Busca explicação por disciplina
 * @param {string} discipline - Nome da disciplina
 * @returns {Array} - Array de explicações da disciplina
 */
export const getExplanationsByDiscipline = (discipline) => {
  return Object.entries(completeExplanations)
    .filter(([id, explanation]) => explanation.discipline === discipline)
    .map(([id, explanation]) => ({ id, ...explanation }));
};

/**
 * Busca explicação por dificuldade
 * @param {string} difficulty - Nível de dificuldade (easy, medium, hard)
 * @returns {Array} - Array de explicações do nível especificado
 */
export const getExplanationsByDifficulty = (difficulty) => {
  return Object.entries(completeExplanations)
    .filter(([id, explanation]) => explanation.difficulty === difficulty)
    .map(([id, explanation]) => ({ id, ...explanation }));
};

/**
 * Busca explicação por tags
 * @param {Array} tags - Array de tags para buscar
 * @returns {Array} - Array de explicações que contêm as tags
 */
export const getExplanationsByTags = (tags) => {
  return Object.entries(completeExplanations)
    .filter(([id, explanation]) => 
      tags.some(tag => explanation.tags.includes(tag))
    )
    .map(([id, explanation]) => ({ id, ...explanation }));
};

/**
 * Obtém estatísticas das explicações
 * @returns {object} - Estatísticas gerais
 */
export const getExplanationsStats = () => {
  const explanations = Object.values(completeExplanations);
  
  return {
    total: explanations.length,
    byDiscipline: explanations.reduce((acc, exp) => {
      acc[exp.discipline] = (acc[exp.discipline] || 0) + 1;
      return acc;
    }, {}),
    byDifficulty: explanations.reduce((acc, exp) => {
      acc[exp.difficulty] = (acc[exp.difficulty] || 0) + 1;
      return acc;
    }, {}),
    totalTags: [...new Set(explanations.flatMap(exp => exp.tags))].length
  };
};

// Exportar lista de todas as explicações
export const allExplanations = Object.entries(completeExplanations)
  .map(([id, explanation]) => ({ id, ...explanation }));

