// Dados mockados para versão offline do ProMD
// Baseado em UWorld, Step 1, AnkiHub

export const mockDisciplines = [
  {
    id: '1',
    name: 'Cardiologia',
    description: 'Estudo do coração e sistema cardiovascular',
    color: '#ef4444',
    icon: 'Heart'
  },
  {
    id: '2',
    name: 'Pneumologia',
    description: 'Estudo do sistema respiratório',
    color: '#3b82f6',
    icon: 'Lungs'
  },
  {
    id: '3',
    name: 'Neurologia',
    description: 'Estudo do sistema nervoso',
    color: '#8b5cf6',
    icon: 'Brain'
  },
  {
    id: '4',
    name: 'Gastroenterologia',
    description: 'Estudo do sistema digestivo',
    color: '#f59e0b',
    icon: 'Stomach'
  },
  {
    id: '5',
    name: 'Endocrinologia',
    description: 'Estudo do sistema endócrino',
    color: '#10b981',
    icon: 'Zap'
  },
  {
    id: '6',
    name: 'Infectologia',
    description: 'Estudo de doenças infecciosas',
    color: '#dc2626',
    icon: 'Shield'
  },
  {
    id: '7',
    name: 'Nefrologia',
    description: 'Estudo dos rins e sistema urinário',
    color: '#06b6d4',
    icon: 'Droplets'
  },
  {
    id: '8',
    name: 'Hematologia',
    description: 'Estudo do sangue e órgãos hematopoiéticos',
    color: '#e11d48',
    icon: 'Activity'
  },
  {
    id: '9',
    name: 'Reumatologia',
    description: 'Estudo de doenças reumáticas',
    color: '#f97316',
    icon: 'Bone'
  },
  {
    id: '10',
    name: 'Dermatologia',
    description: 'Estudo da pele e anexos',
    color: '#84cc16',
    icon: 'Scan'
  },
  {
    id: '11',
    name: 'Psiquiatria',
    description: 'Estudo da mente e comportamento',
    color: '#6366f1',
    icon: 'Brain'
  },
  {
    id: '12',
    name: 'Ortopedia',
    description: 'Estudo do sistema musculoesquelético',
    color: '#64748b',
    icon: 'Bone'
  },
  {
    id: '13',
    name: 'Ginecologia',
    description: 'Estudo do sistema reprodutor feminino',
    color: '#ec4899',
    icon: 'User'
  },
  {
    id: '14',
    name: 'Pediatria',
    description: 'Medicina infantil',
    color: '#22d3ee',
    icon: 'Baby'
  },
  {
    id: '15',
    name: 'Radiologia',
    description: 'Diagnóstico por imagem',
    color: '#71717a',
    icon: 'Scan'
  }
]

export const mockContents = [
  // Cardiologia
  {
    id: '1',
    title: 'Eletrocardiografia',
    description: 'Interpretação de ECG normal e patológico',
    discipline_id: '1'
  },
  {
    id: '2',
    title: 'Arritmias Cardíacas',
    description: 'Diagnóstico e tratamento de arritmias',
    discipline_id: '1'
  },
  {
    id: '3',
    title: 'Insuficiência Cardíaca',
    description: 'Fisiopatologia e manejo da IC',
    discipline_id: '1'
  },
  {
    id: '4',
    title: 'Infarto Agudo do Miocárdio',
    description: 'Diagnóstico e tratamento do IAM',
    discipline_id: '1'
  },
  {
    id: '5',
    title: 'Hipertensão Arterial',
    description: 'Manejo da hipertensão arterial',
    discipline_id: '1'
  },

  // Pneumologia
  {
    id: '6',
    title: 'Asma Brônquica',
    description: 'Diagnóstico e tratamento da asma',
    discipline_id: '2'
  },
  {
    id: '7',
    title: 'DPOC',
    description: 'Doença pulmonar obstrutiva crônica',
    discipline_id: '2'
  },
  {
    id: '8',
    title: 'Pneumonia',
    description: 'Pneumonias comunitárias e hospitalares',
    discipline_id: '2'
  },
  {
    id: '9',
    title: 'Radiologia Torácica',
    description: 'Interpretação de raio-X de tórax',
    discipline_id: '2'
  },

  // Neurologia
  {
    id: '10',
    title: 'AVC Isquêmico',
    description: 'Diagnóstico e tratamento do AVC',
    discipline_id: '3'
  },
  {
    id: '11',
    title: 'Epilepsia',
    description: 'Crises epilépticas e anticonvulsivantes',
    discipline_id: '3'
  },
  {
    id: '12',
    title: 'Cefaleia',
    description: 'Diagnóstico diferencial de cefaleias',
    discipline_id: '3'
  },
  {
    id: '13',
    title: 'Demências',
    description: 'Alzheimer e outras demências',
    discipline_id: '3'
  },

  // Gastroenterologia
  {
    id: '14',
    title: 'Doença Péptica',
    description: 'Úlcera péptica e H. pylori',
    discipline_id: '4'
  },
  {
    id: '15',
    title: 'Doença Inflamatória Intestinal',
    description: 'Crohn e retocolite ulcerativa',
    discipline_id: '4'
  },
  {
    id: '16',
    title: 'Hepatites Virais',
    description: 'Hepatites A, B, C, D e E',
    discipline_id: '4'
  },
  {
    id: '17',
    title: 'Cirrose Hepática',
    description: 'Complicações da cirrose',
    discipline_id: '4'
  },

  // Endocrinologia
  {
    id: '18',
    title: 'Diabetes Mellitus',
    description: 'DM tipo 1 e 2, complicações',
    discipline_id: '5'
  },
  {
    id: '19',
    title: 'Tireoidopatias',
    description: 'Hiper e hipotireoidismo',
    discipline_id: '5'
  },
  {
    id: '20',
    title: 'Distúrbios Adrenais',
    description: 'Síndrome de Cushing e Addison',
    discipline_id: '5'
  },

  // Infectologia
  {
    id: '21',
    title: 'HIV/AIDS',
    description: 'Diagnóstico e tratamento do HIV',
    discipline_id: '6'
  },
  {
    id: '22',
    title: 'Tuberculose',
    description: 'TB pulmonar e extrapulmonar',
    discipline_id: '6'
  },
  {
    id: '23',
    title: 'Sepse',
    description: 'Diagnóstico e manejo da sepse',
    discipline_id: '6'
  },
  {
    id: '24',
    title: 'Meningites',
    description: 'Meningites bacterianas e virais',
    discipline_id: '6'
  },

  // Nefrologia
  {
    id: '25',
    title: 'Insuficiência Renal Aguda',
    description: 'Causas e manejo da IRA',
    discipline_id: '7'
  },
  {
    id: '26',
    title: 'Doença Renal Crônica',
    description: 'Estágios e complicações da DRC',
    discipline_id: '7'
  },
  {
    id: '27',
    title: 'Glomerulonefrites',
    description: 'Síndromes glomerulares',
    discipline_id: '7'
  },

  // Hematologia
  {
    id: '28',
    title: 'Anemias',
    description: 'Classificação e diagnóstico das anemias',
    discipline_id: '8'
  },
  {
    id: '29',
    title: 'Leucemias',
    description: 'Leucemias agudas e crônicas',
    discipline_id: '8'
  },
  {
    id: '30',
    title: 'Distúrbios da Coagulação',
    description: 'Hemofilia e trombocitopenias',
    discipline_id: '8'
  }
]

export const mockFlashcards = [
  {
    id: '1',
    title: 'Interpretação de ECG - Fibrilação Atrial',
    description: 'Caso clínico sobre fibrilação atrial',
    question: 'Paciente de 65 anos apresenta o seguinte traçado de ECG. Qual é o diagnóstico mais provável?\n\nA) Fibrilação atrial\nB) Flutter atrial\nC) Taquicardia supraventricular\nD) Bloqueio AV de 2º grau',
    answer: 'A) Fibrilação atrial',
    justification: 'Características da fibrilação atrial:\n• Ausência de ondas P definidas\n• Intervalos RR irregulares\n• Ondas fibrilatórias na linha de base\n• Frequência ventricular irregular entre 80-120 bpm\n\nPontos importantes:\n• Fibrilação atrial é a arritmia sustentada mais comum\n• Aumenta risco de AVC em 5x\n• Tratamento: controle de frequência + anticoagulação',
    content_id: '1',
    difficulty: 'intermediario',
    type: 'text',
    tags: ['ECG', 'Arritmia', 'Cardiologia'],
    is_public: true,
    created_at: new Date().toISOString()
  }
]

// Função para buscar disciplinas
export const getDisciplines = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDisciplines)
    }, 100)
  })
}

// Função para buscar conteúdos por disciplina
export const getContentsByDiscipline = (disciplineId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const contents = mockContents.filter(content => content.discipline_id === disciplineId)
      resolve(contents)
    }, 100)
  })
}

// Função para salvar flashcard
export const saveFlashcard = (flashcardData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newFlashcard = {
        ...flashcardData,
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      }
      mockFlashcards.push(newFlashcard)
      resolve(newFlashcard)
    }, 500)
  })
}

// Função para upload de arquivo (simulado)
export const uploadFile = (file) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const fileUrl = URL.createObjectURL(file)
      resolve({
        id: Date.now().toString(),
        name: file.name,
        url: fileUrl,
        size: file.size,
        type: file.type
      })
    }, 1000)
  })
}

