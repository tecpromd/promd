// Justificativas médicas para as questões do ProMD
export const questionExplanations = {
  // Questão sobre dispneia em homem de 52 anos
  "90f6f3cd-969b-4890-93f6-4bdcd9d20380": {
    "A": {
      text: "Pulmonary fibrosis",
      explanation: "Embora a fibrose pulmonar possa causar dispneia, os achados de edema bilateral de membros inferiores e hepatomegalia sugerem mais uma causa cardíaca.",
      isCorrect: false
    },
    "B": {
      text: "Pulmonary hypertension", 
      explanation: "A hipertensão pulmonar pode causar dispneia e edema, mas geralmente não apresenta hepatomegalia significativa como achado inicial.",
      isCorrect: false
    },
    "C": {
      text: "Congestive heart failure",
      explanation: "CORRETO. A combinação de dispneia aos esforços, edema bilateral de membros inferiores, hepatomegalia e S2 proeminente são achados clássicos de insuficiência cardíaca congestiva.",
      isCorrect: true
    },
    "D": {
      text: "Chronic obstructive pulmonary disease",
      explanation: "DPOC tipicamente não causa edema bilateral significativo ou hepatomegalia, sendo mais associada a alterações pulmonares específicas.",
      isCorrect: false
    },
    "E": {
      text: "Restrictive lung disease",
      explanation: "Doenças restritivas pulmonares não explicam os achados sistêmicos como edema e hepatomegalia presentes neste caso.",
      isCorrect: false
    }
  },

  // Questão sobre dor torácica - IAM
  "7e2ddfef-8899-4c42-9baf-61b4dc6a4e91": {
    "A": {
      text: "Immediate thrombolytic therapy",
      explanation: "Trombolíticos são indicados quando a ICP primária não está disponível em tempo hábil (<90 min). Neste caso, a ICP deve ser a primeira escolha.",
      isCorrect: false
    },
    "B": {
      text: "Primary percutaneous coronary intervention (PCI)",
      explanation: "CORRETO. Para IAMCSST, a ICP primária é o tratamento de escolha quando disponível em <90 minutos do primeiro contato médico.",
      isCorrect: true
    },
    "C": {
      text: "High-dose aspirin and observation",
      explanation: "Apenas AAS e observação são inadequados para IAMCSST, que requer reperfusão imediata para salvar miocárdio.",
      isCorrect: false
    },
    "D": {
      text: "Coronary artery bypass surgery",
      explanation: "Cirurgia de revascularização não é o tratamento de primeira linha para IAMCSST agudo. ICP primária é preferível.",
      isCorrect: false
    },
    "E": {
      text: "Beta-blocker therapy only",
      explanation: "Beta-bloqueadores são adjuvantes importantes, mas não substituem a necessidade de reperfusão imediata no IAMCSST.",
      isCorrect: false
    }
  },

  // Questão sobre tosse seca com lisinopril
  "9b1b7f0a-8293-43ca-8946-568a386ca809": {
    "A": {
      text: "Increased angiotensin II levels",
      explanation: "Os IECAs reduzem os níveis de angiotensina II, não os aumentam. Este não é o mecanismo da tosse.",
      isCorrect: false
    },
    "B": {
      text: "Accumulation of bradykinin",
      explanation: "CORRETO. IECAs inibem a enzima conversora que degrada bradicinina, levando ao seu acúmulo e causando tosse seca em 10-15% dos pacientes.",
      isCorrect: true
    },
    "C": {
      text: "Decreased aldosterone production",
      explanation: "A redução da aldosterona é um efeito benéfico dos IECAs, não relacionado ao efeito colateral da tosse.",
      isCorrect: false
    },
    "D": {
      text: "Electrolyte imbalance",
      explanation: "Desequilíbrios eletrolíticos não são a causa da tosse seca associada aos IECAs.",
      isCorrect: false
    },
    "E": {
      text: "Allergic reaction",
      explanation: "A tosse por IECA não é uma reação alérgica, mas sim um efeito farmacológico relacionado à bradicinina.",
      isCorrect: false
    }
  }
};

// Função para obter explicações de uma questão
export const getQuestionExplanations = (questionId) => {
  return questionExplanations[questionId] || null;
};

// Função para obter explicação de uma alternativa específica
export const getOptionExplanation = (questionId, optionLetter) => {
  const explanations = questionExplanations[questionId];
  return explanations?.[optionLetter] || null;
};

