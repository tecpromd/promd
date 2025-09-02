// Estrutura das 19 disciplinas médicas em ordem alfabética
// Cada disciplina tem ícone, cor e descrição

export const disciplinesData = {
  anatomy: {
    id: 'anatomy',
    icon: '🦴',
    color: '#8B5CF6', // Purple
    colorLight: '#EDE9FE',
    description: {
      pt: 'Anatomia, sistema musculoesquelético e reumatologia',
      en: 'Anatomy, musculoskeletal system and rheumatology',
      es: 'Anatomía, sistema musculoesquelético y reumatología'
    }
  },
  
  behavioral: {
    id: 'behavioral',
    icon: '🧠',
    color: '#06B6D4', // Cyan
    colorLight: '#CFFAFE',
    description: {
      pt: 'Ciências comportamentais e psicologia médica',
      en: 'Behavioral sciences and medical psychology',
      es: 'Ciencias del comportamiento y psicología médica'
    }
  },
  
  biochemistry: {
    id: 'biochemistry',
    icon: '🧪',
    color: '#10B981', // Emerald
    colorLight: '#D1FAE5',
    description: {
      pt: 'Bioquímica e metabolismo celular',
      en: 'Biochemistry and cellular metabolism',
      es: 'Bioquímica y metabolismo celular'
    }
  },
  
  biostatistics: {
    id: 'biostatistics',
    icon: '📊',
    color: '#F59E0B', // Amber
    colorLight: '#FEF3C7',
    description: {
      pt: 'Bioestatística, epidemiologia e medicina baseada em evidências',
      en: 'Biostatistics, epidemiology and evidence-based medicine',
      es: 'Bioestadística, epidemiología y medicina basada en evidencia'
    }
  },
  
  cardiology: {
    id: 'cardiology',
    icon: '❤️',
    color: '#EF4444', // Red
    colorLight: '#FEE2E2',
    description: {
      pt: 'Cardiologia e sistema cardiovascular',
      en: 'Cardiology and cardiovascular system',
      es: 'Cardiología y sistema cardiovascular'
    }
  },
  
  dermatology: {
    id: 'dermatology',
    icon: '🌟',
    color: '#F97316', // Orange
    colorLight: '#FED7AA',
    description: {
      pt: 'Dermatologia e doenças da pele',
      en: 'Dermatology and skin diseases',
      es: 'Dermatología y enfermedades de la piel'
    }
  },
  
  endocrinology: {
    id: 'endocrinology',
    icon: '⚖️',
    color: '#8B5CF6', // Purple
    colorLight: '#EDE9FE',
    description: {
      pt: 'Endocrinologia e sistema hormonal',
      en: 'Endocrinology and hormonal system',
      es: 'Endocrinología y sistema hormonal'
    }
  },
  
  female: {
    id: 'female',
    icon: '👩‍⚕️',
    color: '#EC4899', // Pink
    colorLight: '#FCE7F3',
    description: {
      pt: 'Ginecologia, obstetrícia e patologia mamária',
      en: 'Gynecology, obstetrics and breast pathology',
      es: 'Ginecología, obstetricia y patología mamaria'
    }
  },
  
  gastroenterology: {
    id: 'gastroenterology',
    icon: '🫃',
    color: '#84CC16', // Lime
    colorLight: '#ECFCCB',
    description: {
      pt: 'Gastroenterologia e sistema digestivo',
      en: 'Gastroenterology and digestive system',
      es: 'Gastroenterología y sistema digestivo'
    }
  },
  
  hematology: {
    id: 'hematology',
    icon: '🩸',
    color: '#DC2626', // Red-600
    colorLight: '#FEE2E2',
    description: {
      pt: 'Hematologia e distúrbios sanguíneos',
      en: 'Hematology and blood disorders',
      es: 'Hematología y trastornos sanguíneos'
    }
  },
  
  immunology: {
    id: 'immunology',
    icon: '🛡️',
    color: '#7C3AED', // Violet
    colorLight: '#EDE9FE',
    description: {
      pt: 'Imunologia e sistema imune',
      en: 'Immunology and immune system',
      es: 'Inmunología y sistema inmune'
    }
  },
  
  infectious: {
    id: 'infectious',
    icon: '🦠',
    color: '#059669', // Emerald-600
    colorLight: '#D1FAE5',
    description: {
      pt: 'Doenças infecciosas e microbiologia',
      en: 'Infectious diseases and microbiology',
      es: 'Enfermedades infecciosas y microbiología'
    }
  },
  
  male: {
    id: 'male',
    icon: '👨‍⚕️',
    color: '#2563EB', // Blue
    colorLight: '#DBEAFE',
    description: {
      pt: 'Urologia e patologia masculina',
      en: 'Urology and male pathology',
      es: 'Urología y patología masculina'
    }
  },
  
  neurology: {
    id: 'neurology',
    icon: '🧠',
    color: '#7C2D12', // Orange-900
    colorLight: '#FED7AA',
    description: {
      pt: 'Neurologia e sistema nervoso',
      en: 'Neurology and nervous system',
      es: 'Neurología y sistema nervioso'
    }
  },
  
  pathology: {
    id: 'pathology',
    icon: '🔬',
    color: '#374151', // Gray-700
    colorLight: '#F3F4F6',
    description: {
      pt: 'Patologia geral e anatomia patológica',
      en: 'General pathology and anatomical pathology',
      es: 'Patología general y anatomía patológica'
    }
  },
  
  pharmacology: {
    id: 'pharmacology',
    icon: '💊',
    color: '#16A34A', // Green
    colorLight: '#DCFCE7',
    description: {
      pt: 'Farmacologia e terapêutica medicamentosa',
      en: 'Pharmacology and drug therapy',
      es: 'Farmacología y terapia farmacológica'
    }
  },
  
  psychiatry: {
    id: 'psychiatry',
    icon: '🧘‍♀️',
    color: '#9333EA', // Purple-600
    colorLight: '#F3E8FF',
    description: {
      pt: 'Psiquiatria e saúde mental',
      en: 'Psychiatry and mental health',
      es: 'Psiquiatría y salud mental'
    }
  },
  
  pulmonary: {
    id: 'pulmonary',
    icon: '🫁',
    color: '#0EA5E9', // Sky
    colorLight: '#E0F2FE',
    description: {
      pt: 'Pneumologia e sistema respiratório',
      en: 'Pulmonology and respiratory system',
      es: 'Neumología y sistema respiratorio'
    }
  },
  
  renal: {
    id: 'renal',
    icon: '🫘',
    color: '#0D9488', // Teal
    colorLight: '#CCFBF1',
    description: {
      pt: 'Nefrologia e sistema renal',
      en: 'Nephrology and renal system',
      es: 'Nefrología y sistema renal'
    }
  }
};

// Lista ordenada das disciplinas
export const disciplinesList = [
  'anatomy',
  'behavioral', 
  'biochemistry',
  'biostatistics',
  'cardiology',
  'dermatology',
  'endocrinology',
  'female',
  'gastroenterology',
  'hematology',
  'immunology',
  'infectious',
  'male',
  'neurology',
  'pathology',
  'pharmacology',
  'psychiatry',
  'pulmonary',
  'renal'
];

// Função para obter dados de uma disciplina
export const getDisciplineData = (disciplineId) => {
  return disciplinesData[disciplineId] || null;
};

// Função para obter todas as disciplinas
export const getAllDisciplines = () => {
  return disciplinesList.map(id => ({
    id,
    ...disciplinesData[id]
  }));
};

