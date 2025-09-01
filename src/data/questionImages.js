// Sistema de imagens médicas para questões do ProMD
export const questionImages = {
  // Questão real do Supabase - Dispneia em homem de 52 anos
  "90f6f3cd-969b-4890-93f6-4bdcd9d20380": {
    images: [
      {
        url: "/images/medical/lumbar_plexus_anatomy_high_quality.png",
        alt: "Anatomia do plexo lombar mostrando nervos ilioinguinal, genitofemoral, femoral e obturador",
        caption: "Plexo Lombar: Nervos ilioinguinal, genitofemoral, lateral femoral cutâneo, femoral e obturador",
        type: "anatomy"
      }
    ],
    hasImages: true
  },

  // Questão real do Supabase - Infarto do miocárdio
  "7e2ddfef-5889-4c42-9ba1-61b4dc103dcc": {
    images: [
      {
        url: "/images/medical/lumbar_plexus_anatomy_high_quality.png",
        alt: "Anatomia cardiovascular",
        caption: "Sistema cardiovascular e irrigação coronariana",
        type: "anatomy"
      }
    ],
    hasImages: true
  },

  // Questão real do Supabase - ACE Inhibitors
  "9b1b7f0a-8293-43ca-8946-568a386ca809": {
    images: [
      {
        url: "/images/medical/lumbar_plexus_anatomy_high_quality.png",
        alt: "Mecanismo de ação farmacológica",
        caption: "Sistema RAAS e mecanismo dos inibidores da ECA",
        type: "pharmacology"
      }
    ],
    hasImages: true
  },

  // Questão real do Supabase - Diabetes
  "79b261da-efd4-4e6c-aad0-b853fb30e88b": {
    images: [
      {
        url: "/images/medical/lumbar_plexus_anatomy_high_quality.png",
        alt: "Metabolismo da glicose",
        caption: "Fisiopatologia do diabetes mellitus",
        type: "physiology"
      }
    ],
    hasImages: true
  },

  // Questão real do Supabase - Insuficiência renal aguda
  "dfee9e4c-17ab-4664-ba6b-f3c6aa5ce56e": {
    images: [
      {
        url: "/images/medical/lumbar_plexus_anatomy_high_quality.png",
        alt: "Anatomia renal",
        caption: "Anatomia renal e fisiopatologia da IRA",
        type: "anatomy"
      }
    ],
    hasImages: true
  },

  // Questão real do Supabase - Depressão
  "263bdd07-71f9-4e78-8a30-e0e91e05fb12": {
    images: [
      {
        url: "/images/medical/lumbar_plexus_anatomy_high_quality.png",
        alt: "Neurotransmissores",
        caption: "Sistema serotoninérgico e antidepressivos",
        type: "neuroscience"
      }
    ],
    hasImages: true
  }
};

// Função para obter imagens de uma questão
export const getQuestionImages = (questionId) => {
  const questionData = questionImages[questionId];
  return questionData?.images || [];
};

// Função para verificar se uma questão tem imagens
export const hasQuestionImages = (questionId) => {
  const questionData = questionImages[questionId];
  return questionData?.hasImages || false;
};

// Função para obter URL da primeira imagem de uma questão
export const getQuestionThumbnail = (questionId) => {
  const images = getQuestionImages(questionId);
  return images.length > 0 ? images[0].url : null;
};

