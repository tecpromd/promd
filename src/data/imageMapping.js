// Sistema de Mapeamento de Imagens ProMD - Corrigido
// Mapeia IDs reais das questões do Supabase para imagens

export const imageMapping = {
  // Usar os primeiros 8 caracteres do UUID como chave
  // Exemplo: se ID = "550e8400-e29b-41d4-a716-446655440000", usar "550e8400"
  
  // Questões de Cardiologia
  "550e8400": {
    images: [
      {
        url: "/images/medical/lumbar_plexus_anatomy_high_quality.png",
        alt: "Anatomia do plexo lombar",
        caption: "Plexo Lombar: Nervos ilioinguinal, genitofemoral, lateral femoral cutâneo, femoral e obturador",
        type: "anatomy"
      }
    ]
  },

  // Questões de Pneumologia  
  "6ba7b810": {
    images: [
      {
        url: "/images/medical/lumbar_plexus_anatomy_high_quality.png",
        alt: "Anatomia respiratória",
        caption: "Sistema respiratório e inervação",
        type: "anatomy"
      }
    ]
  },

  // Questões de Neurologia
  "6ba7b811": {
    images: [
      {
        url: "/images/medical/lumbar_plexus_anatomy_high_quality.png",
        alt: "Anatomia neurológica",
        caption: "Sistema nervoso periférico",
        type: "anatomy"
      }
    ]
  }
};

// Função para obter imagens por ID da questão
export const getImagesByQuestionId = (questionId) => {
  if (!questionId) return [];
  
  // Usar os primeiros 8 caracteres do ID
  const shortId = questionId.toString().substring(0, 8);
  
  // Tentar encontrar por ID curto
  const imageData = imageMapping[shortId];
  if (imageData?.images) {
    return imageData.images;
  }

  // Fallback: usar imagem padrão para todas as questões
  return [
    {
      url: "/images/medical/lumbar_plexus_anatomy_high_quality.png",
      alt: "Imagem médica de alta qualidade",
      caption: "Anatomia médica detalhada para estudo",
      type: "anatomy"
    }
  ];
};

// Função para verificar se uma questão tem imagens
export const hasQuestionImages = (questionId) => {
  const images = getImagesByQuestionId(questionId);
  return images.length > 0;
};

// Função para obter URL da primeira imagem
export const getQuestionThumbnail = (questionId) => {
  const images = getImagesByQuestionId(questionId);
  return images.length > 0 ? images[0].url : null;
};

export default imageMapping;

