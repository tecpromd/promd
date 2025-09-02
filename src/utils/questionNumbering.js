// Sistema de Numeração Lógica ProMD
// Formato: DDNNNN (2 dígitos disciplina + 4 dígitos sequencial)

export const disciplineCodes = {
  // Disciplinas principais ordenadas logicamente
  'Gastroenterologia': '01',
  'Radiologia': '02', 
  'Behavioral Science': '03',
  'Renal': '04',
  'Anatomy, Musculoskeletal & Rheumatology': '05',
  'Dermatology': '06',
  'Ginecologia': '07',
  'Pathology': '08',
  'Cardiologia': '09',
  'Pneumologia': '10',
  'Neurologia': '11',
  'Endocrinologia': '12',
  'Infectologia': '13',
  'Nefrologia': '14',
  'Hematologia': '15',
  'Reumatologia': '16',
  'Dermatologia': '17',
  'Psiquiatria': '18',
  'Ortopedia': '19',
  'Ginecologia': '20',
  
  // Disciplinas complementares
  'Medicina Geral': '21',
  'Emergência': '22',
  'Pediatria': '23',
  'Geriatria': '24',
  'Oncologia': '25',
  'Cirurgia Geral': '26',
  'Anestesiologia': '27',
  'Oftalmologia': '28',
  'Otorrinolaringologia': '29',
  'Urologia': '30',
  'Medicina do Trabalho': '31',
  'Medicina Preventiva': '32',
  'Bioética': '33',
  'Farmacologia': '34',
  'Fisiologia': '35',
  'Anatomia': '36',
  'Histologia': '37',
  'Embriologia': '38',
  'Genética': '39',
  'Imunologia': '40',
  'Microbiologia': '41',
  'Parasitologia': '42',
  'Epidemiologia': '43',
  'Estatística Médica': '44'
};

// Mapeamento reverso (código para disciplina)
export const codeToDiscipine = Object.fromEntries(
  Object.entries(disciplineCodes).map(([discipline, code]) => [code, discipline])
);

/**
 * Gera número de questão baseado na disciplina
 * @param {string} disciplineName - Nome da disciplina
 * @param {number} sequentialNumber - Número sequencial da questão
 * @returns {string} - Número formatado (ex: "090001")
 */
export const generateQuestionNumber = (disciplineName, sequentialNumber) => {
  const disciplineCode = disciplineCodes[disciplineName] || '99'; // 99 para disciplinas não mapeadas
  const paddedSequential = sequentialNumber.toString().padStart(4, '0');
  return `${disciplineCode}${paddedSequential}`;
};

/**
 * Gera número de flashcard baseado na disciplina
 * @param {string} disciplineName - Nome da disciplina
 * @param {number} sequentialNumber - Número sequencial do flashcard
 * @returns {string} - Número formatado (ex: "090001F")
 */
export const generateFlashcardNumber = (disciplineName, sequentialNumber) => {
  const questionNumber = generateQuestionNumber(disciplineName, sequentialNumber);
  return `${questionNumber}F`;
};

/**
 * Extrai informações do número da questão
 * @param {string} questionNumber - Número da questão (ex: "090001")
 * @returns {object} - {disciplineCode, disciplineName, sequentialNumber}
 */
export const parseQuestionNumber = (questionNumber) => {
  if (!questionNumber || questionNumber.length < 6) {
    return { disciplineCode: '99', disciplineName: 'Não identificada', sequentialNumber: 0 };
  }
  
  const disciplineCode = questionNumber.substring(0, 2);
  const sequentialNumber = parseInt(questionNumber.substring(2, 6));
  const disciplineName = codeToDiscipine[disciplineCode] || 'Não identificada';
  
  return {
    disciplineCode,
    disciplineName,
    sequentialNumber
  };
};

/**
 * Valida formato do número da questão
 * @param {string} questionNumber - Número a ser validado
 * @returns {boolean} - True se válido
 */
export const isValidQuestionNumber = (questionNumber) => {
  const regex = /^\d{6}F?$/; // 6 dígitos, opcionalmente seguido de F para flashcards
  return regex.test(questionNumber);
};

/**
 * Gera próximo número disponível para uma disciplina
 * @param {string} disciplineName - Nome da disciplina
 * @param {Array} existingNumbers - Array de números já existentes
 * @returns {string} - Próximo número disponível
 */
export const getNextAvailableNumber = (disciplineName, existingNumbers = []) => {
  const disciplineCode = disciplineCodes[disciplineName] || '99';
  
  // Filtrar números da mesma disciplina
  const disciplineNumbers = existingNumbers
    .filter(num => num.startsWith(disciplineCode))
    .map(num => parseInt(num.substring(2, 6)))
    .sort((a, b) => a - b);
  
  // Encontrar próximo número disponível
  let nextNumber = 1;
  for (const num of disciplineNumbers) {
    if (num === nextNumber) {
      nextNumber++;
    } else {
      break;
    }
  }
  
  return generateQuestionNumber(disciplineName, nextNumber);
};

/**
 * Migra questões existentes para novo sistema de numeração
 * @param {Array} questions - Array de questões existentes
 * @returns {Array} - Questões com novos números
 */
export const migrateQuestionsToNewNumbering = (questions) => {
  const disciplineCounters = {};
  
  return questions.map(question => {
    const disciplineName = question.discipline || 'Medicina Geral';
    
    // Incrementar contador da disciplina
    if (!disciplineCounters[disciplineName]) {
      disciplineCounters[disciplineName] = 1;
    } else {
      disciplineCounters[disciplineName]++;
    }
    
    const newNumber = generateQuestionNumber(disciplineName, disciplineCounters[disciplineName]);
    
    return {
      ...question,
      questionNumber: newNumber,
      oldId: question.id, // Manter referência ao ID antigo
      displayNumber: newNumber
    };
  });
};

/**
 * Formata número para exibição
 * @param {string} questionNumber - Número da questão
 * @returns {string} - Número formatado para exibição
 */
export const formatQuestionNumberForDisplay = (questionNumber) => {
  const parsed = parseQuestionNumber(questionNumber);
  return `${parsed.disciplineCode}.${parsed.sequentialNumber.toString().padStart(4, '0')}`;
};

// Exportar lista de disciplinas ordenadas
export const orderedDisciplines = Object.keys(disciplineCodes).sort((a, b) => {
  return disciplineCodes[a].localeCompare(disciplineCodes[b]);
});

// Estatísticas por disciplina
export const getDisciplineStats = (questions) => {
  const stats = {};
  
  questions.forEach(question => {
    const parsed = parseQuestionNumber(question.questionNumber || question.id);
    const disciplineName = parsed.disciplineName;
    
    if (!stats[disciplineName]) {
      stats[disciplineName] = {
        code: parsed.disciplineCode,
        name: disciplineName,
        count: 0,
        questions: []
      };
    }
    
    stats[disciplineName].count++;
    stats[disciplineName].questions.push(question);
  });
  
  return stats;
};

