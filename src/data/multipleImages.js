// Sistema de Múltiplas Imagens por Questão - ProMD
// Suporte para várias imagens médicas por questão com diferentes tipos

export const multipleImages = {
  // Questão de Anatomia - Neuropatia Pós-operatória
  "090001": [
    {
      id: "lumbar_plexus_main",
      src: "/images/medical/lumbar_plexus_anatomy_high_quality.png",
      type: "anatomy",
      title: "Plexo Lombar - Visão Geral",
      caption: "Anatomia completa do plexo lombar mostrando todos os nervos principais",
      description: "Diagrama anatômico detalhado do plexo lombar com identificação dos nervos ilioinguinal, genitofemoral, lateral femoral cutâneo, femoral e obturador",
      tags: ["anatomia", "plexo lombar", "nervos"],
      zoomLevel: 10
    }
  ],

  // Questão de Cardiologia - Insuficiência Cardíaca
  "090002": [
    {
      id: "spirometry_normal_results",
      src: "/images/medical/pulmonary_spirometry_chart.webp",
      type: "diagnostic_test",
      title: "Espirometria - Valores Normais", 
      caption: "Resultados espirométricos normais: FVC, FEV1 e FEV1/FVC",
      description: "Gráfico de espirometria mostrando valores normais de capacidade vital forçada e volume expiratório forçado",
      tags: ["espirometria", "função pulmonar", "diagnóstico"],
      zoomLevel: 8
    }
  ],

  // Questão de Infectologia - Meningite Bacteriana
  "130001": [
    {
      id: "csf_analysis_table",
      src: "/images/medical/csf_analysis_comparison.png",
      type: "laboratory",
      title: "Análise do LCR - Comparação",
      caption: "Comparação dos achados do LCR em diferentes tipos de meningite",
      description: "Tabela comparativa mostrando os valores típicos de glicose, proteína e células no LCR para meningite bacteriana, viral e fúngica",
      tags: ["LCR", "meningite", "laboratório"],
      zoomLevel: 8
    },
    {
      id: "gram_stain_pneumococcus",
      src: "/images/medical/gram_stain_strep_pneumoniae.png",
      type: "microscopy",
      title: "Coloração de Gram - S. pneumoniae",
      caption: "Cocos gram-positivos em pares (diplococos) característicos do S. pneumoniae",
      description: "Microscopia mostrando a morfologia típica do Streptococcus pneumoniae na coloração de Gram",
      tags: ["gram", "pneumococo", "microscopia"],
      zoomLevel: 12
    },
    {
      id: "meningeal_signs_examination",
      src: "/images/medical/kernig_brudzinski_signs.png",
      type: "clinical_examination",
      title: "Sinais Meníngeos - Exame Físico",
      caption: "Demonstração dos sinais de Kernig e Brudzinski",
      description: "Ilustração dos testes clínicos para avaliação de irritação meníngea",
      tags: ["exame físico", "sinais meníngeos", "neurologia"],
      zoomLevel: 6
    }
  ],

  // Questão de Reumatologia - Esclerose Sistêmica
  "160001": [
    {
      id: "scleroderma_face_progression",
      src: "/images/medical/scleroderma_facial_changes.png",
      type: "clinical_progression",
      title: "Esclerodermia - Alterações Faciais",
      caption: "Progressão das alterações faciais na esclerose sistêmica",
      description: "Sequência fotográfica mostrando a evolução das alterações cutâneas faciais na esclerose sistêmica",
      tags: ["esclerodermia", "face", "progressão"],
      zoomLevel: 8
    },
    {
      id: "interstitial_lung_disease_hrct",
      src: "/images/medical/ild_hrct_scan.png",
      type: "radiology",
      title: "TCAR - Doença Pulmonar Intersticial",
      caption: "Tomografia de alta resolução mostrando fibrose pulmonar",
      description: "TCAR de tórax demonstrando padrão de fibrose pulmonar típico da esclerose sistêmica",
      tags: ["TCAR", "fibrose pulmonar", "intersticial"],
      zoomLevel: 9
    },
    {
      id: "raynaud_phenomenon_phases",
      src: "/images/medical/raynaud_color_changes.png",
      type: "clinical_photo",
      title: "Fenômeno de Raynaud - Fases",
      caption: "Mudanças de coloração características do fenômeno de Raynaud",
      description: "Fotografia mostrando as três fases do fenômeno de Raynaud: palidez, cianose e hiperemia",
      tags: ["Raynaud", "vascular", "dedos"],
      zoomLevel: 10
    }
  ],

  // Questão de Endocrinologia - Doença de Graves
  "120001": [
    {
      id: "graves_ophthalmopathy_clinical",
      src: "/images/medical/graves_eye_disease.png",
      type: "clinical_photo",
      title: "Oftalmopatia de Graves",
      caption: "Exoftalmia bilateral e retração palpebral em paciente com Graves",
      description: "Fotografia clínica mostrando as alterações oculares características da doença de Graves",
      tags: ["Graves", "olhos", "exoftalmia"],
      zoomLevel: 9
    },
    {
      id: "thyroid_function_graph",
      src: "/images/medical/thyroid_hormone_levels.png",
      type: "laboratory",
      title: "Função Tireoidiana - Gráfico",
      caption: "Níveis hormonais no hipertireoidismo: TSH suprimido, T3 e T4 elevados",
      description: "Gráfico mostrando os padrões típicos dos hormônios tireoidianos no hipertireoidismo",
      tags: ["tireoide", "hormônios", "laboratório"],
      zoomLevel: 7
    },
    {
      id: "thyroid_ultrasound_graves",
      src: "/images/medical/thyroid_us_graves.png",
      type: "ultrasound",
      title: "Ultrassom da Tireoide - Graves",
      caption: "Ultrassom mostrando aumento difuso da tireoide com hipoecogenicidade",
      description: "Imagem ultrassonográfica da tireoide em paciente com doença de Graves",
      tags: ["ultrassom", "tireoide", "Graves"],
      zoomLevel: 8
    }
  ]
};

/**
 * Obtém todas as imagens de uma questão
 * @param {string} questionId - ID da questão
 * @returns {Array} - Array de imagens da questão
 */
export const getImagesByQuestionId = (questionId) => {
  return multipleImages[questionId] || [];
};

/**
 * Obtém imagem específica por ID
 * @param {string} questionId - ID da questão
 * @param {string} imageId - ID da imagem
 * @returns {object|null} - Objeto da imagem ou null
 */
export const getImageById = (questionId, imageId) => {
  const images = multipleImages[questionId] || [];
  return images.find(img => img.id === imageId) || null;
};

/**
 * Obtém imagens por tipo
 * @param {string} questionId - ID da questão
 * @param {string} type - Tipo de imagem
 * @returns {Array} - Array de imagens do tipo especificado
 */
export const getImagesByType = (questionId, type) => {
  const images = multipleImages[questionId] || [];
  return images.filter(img => img.type === type);
};

/**
 * Obtém estatísticas das imagens
 * @returns {object} - Estatísticas das imagens
 */
export const getImagesStats = () => {
  const allImages = Object.values(multipleImages).flat();
  
  return {
    totalImages: allImages.length,
    totalQuestions: Object.keys(multipleImages).length,
    averageImagesPerQuestion: (allImages.length / Object.keys(multipleImages).length).toFixed(1),
    imageTypes: [...new Set(allImages.map(img => img.type))],
    byType: allImages.reduce((acc, img) => {
      acc[img.type] = (acc[img.type] || 0) + 1;
      return acc;
    }, {})
  };
};

/**
 * Valida se uma imagem existe
 * @param {string} questionId - ID da questão
 * @param {string} imageId - ID da imagem
 * @returns {boolean} - True se a imagem existe
 */
export const imageExists = (questionId, imageId) => {
  const images = multipleImages[questionId] || [];
  return images.some(img => img.id === imageId);
};

/**
 * Obtém próxima imagem na sequência
 * @param {string} questionId - ID da questão
 * @param {string} currentImageId - ID da imagem atual
 * @returns {object|null} - Próxima imagem ou null
 */
export const getNextImage = (questionId, currentImageId) => {
  const images = multipleImages[questionId] || [];
  const currentIndex = images.findIndex(img => img.id === currentImageId);
  
  if (currentIndex === -1 || currentIndex === images.length - 1) {
    return null;
  }
  
  return images[currentIndex + 1];
};

/**
 * Obtém imagem anterior na sequência
 * @param {string} questionId - ID da questão
 * @param {string} currentImageId - ID da imagem atual
 * @returns {object|null} - Imagem anterior ou null
 */
export const getPreviousImage = (questionId, currentImageId) => {
  const images = multipleImages[questionId] || [];
  const currentIndex = images.findIndex(img => img.id === currentImageId);
  
  if (currentIndex <= 0) {
    return null;
  }
  
  return images[currentIndex - 1];
};

// Tipos de imagem disponíveis
export const imageTypes = {
  anatomy: "Anatomia",
  radiology: "Radiologia", 
  microscopy: "Microscopia",
  clinical_photo: "Foto Clínica",
  laboratory: "Laboratório",
  diagnostic_test: "Teste Diagnóstico",
  cross_section: "Corte Transversal",
  innervation_map: "Mapa de Inervação",
  clinical_examination: "Exame Clínico",
  clinical_progression: "Progressão Clínica",
  ultrasound: "Ultrassom"
};

// Exportar todas as imagens organizadas
export const allImages = Object.entries(multipleImages)
  .map(([questionId, images]) => ({
    questionId,
    images: images.map(img => ({ questionId, ...img }))
  }))
  .reduce((acc, curr) => [...acc, ...curr.images], []);

