import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://truepksaojbpgwdtelbb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydWVwa3Nhb2picGd3ZHRlbGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzM0NjcsImV4cCI6MjA3MDE0OTQ2N30.UO0hdlI6IAvJeWDEbrnicMMLNn9ExAV7zPQlEc3DgTk';

const supabase = createClient(supabaseUrl, supabaseKey);

const zollingerFlashcards = [
  {
    title: "Zollinger-Ellison Syndrome - Primary Cause",
    question: "What is the primary cause of Zollinger-Ellison Syndrome (ZES)?",
    answer: "Gastrin-secreting tumors (gastrinomas) in the pancreas or duodenum, which cause excess gastric acid production.",
    description: "ZES pathophysiology",
    tags: ["gastroenterology", "zollinger-ellison", "gastrinoma"],
    difficulty: "medium",
    type: "text",
    justification: "ZES is caused by gastrinomas that secrete excessive gastrin, leading to hypergastrinemia and gastric acid hypersecretion."
  },
  {
    title: "Zollinger-Ellison Syndrome - Ulcer Location",
    question: "Why do patients with Zollinger-Ellison Syndrome often develop peptic ulcers beyond the duodenal bulb?",
    answer: "Because gastrinomas cause high levels of gastric acid, leading to ulcer formation in distal areas of the GI tract.",
    description: "ZES ulcer patterns", 
    tags: ["gastroenterology", "zollinger-ellison", "peptic-ulcer"],
    difficulty: "medium",
    type: "text",
    justification: "The excessive acid production overwhelms normal protective mechanisms, causing ulcers in unusual locations like the jejunum."
  },
  {
    title: "Zollinger-Ellison Syndrome - Diarrhea Mechanism",
    question: "How does Zollinger-Ellison Syndrome lead to diarrhea and steatorrhea?",
    answer: "Excess acid inactivates pancreatic enzymes, causing malabsorption and fatty stools (steatorrhea).",
    description: "ZES complications",
    tags: ["gastroenterology", "zollinger-ellison", "malabsorption"],
    difficulty: "hard",
    type: "text",
    justification: "High gastric acid levels denature pancreatic lipase and other digestive enzymes, leading to fat malabsorption."
  },
  {
    title: "Zollinger-Ellison Syndrome - Secretin Test",
    question: "Which diagnostic test confirms Zollinger-Ellison Syndrome when gastrin levels are equivocal?",
    answer: "The secretin stimulation test—gastrin increases by >120 pg/mL in patients with gastrinoma.",
    description: "ZES diagnosis",
    tags: ["gastroenterology", "zollinger-ellison", "diagnosis"],
    difficulty: "hard",
    type: "text",
    justification: "Secretin normally inhibits gastrin release, but in ZES, it paradoxically stimulates gastrin secretion from gastrinomas."
  },
  {
    title: "Zollinger-Ellison Syndrome - Treatment",
    question: "What is the first-line treatment to control acid hypersecretion in Zollinger-Ellison Syndrome?",
    answer: "High-dose proton pump inhibitors (PPIs) like omeprazole.",
    description: "ZES management",
    tags: ["gastroenterology", "zollinger-ellison", "treatment"],
    difficulty: "easy",
    type: "text",
    justification: "PPIs effectively block gastric acid production and are the mainstay of medical management for ZES."
  },
  {
    title: "Zollinger-Ellison Syndrome - MEN1 Association",
    question: "Which genetic syndrome is strongly associated with Zollinger-Ellison Syndrome?",
    answer: "Multiple Endocrine Neoplasia type 1 (MEN1).",
    description: "ZES genetics",
    tags: ["gastroenterology", "zollinger-ellison", "men1"],
    difficulty: "medium",
    type: "text",
    justification: "About 25% of ZES cases are associated with MEN1, which involves tumors of the pituitary, parathyroid, and pancreas."
  },
  {
    title: "Zollinger-Ellison Syndrome - Endoscopic Findings",
    question: "What key endoscopic finding supports the diagnosis of Zollinger-Ellison Syndrome?",
    answer: "Multiple ulcers and thickened gastric folds on EGD (esophagogastroduodenoscopy).",
    description: "ZES endoscopy",
    tags: ["gastroenterology", "zollinger-ellison", "endoscopy"],
    difficulty: "medium",
    type: "text",
    justification: "The chronic acid hypersecretion causes characteristic mucosal changes including fold thickening and multiple ulcerations."
  },
  {
    title: "Zollinger-Ellison Syndrome - Imaging",
    question: "What imaging is used to localize gastrinomas in Zollinger-Ellison Syndrome?",
    answer: "Somatostatin receptor scintigraphy, CT, MRI, or EUS (endoscopic ultrasound).",
    description: "ZES imaging",
    tags: ["gastroenterology", "zollinger-ellison", "imaging"],
    difficulty: "medium",
    type: "text",
    justification: "Gastrinomas express somatostatin receptors, making somatostatin receptor scintigraphy highly sensitive for localization."
  },
  {
    title: "Zollinger-Ellison Syndrome - Laboratory Criteria",
    question: "What laboratory criteria confirm Zollinger-Ellison Syndrome?",
    answer: "FSG > 1000 pg/mL and gastric pH < 2.",
    description: "ZES lab values",
    tags: ["gastroenterology", "zollinger-ellison", "laboratory"],
    difficulty: "easy",
    type: "text",
    justification: "Fasting serum gastrin (FSG) >1000 pg/mL with acidic gastric pH is diagnostic of ZES."
  },
  {
    title: "Zollinger-Ellison Syndrome - Gastrin Hormone",
    question: "What is the primary hormone secreted by gastrinomas in ZES?",
    answer: "Gastrin, which stimulates parietal cells to secrete gastric acid.",
    description: "ZES hormones",
    tags: ["gastroenterology", "zollinger-ellison", "gastrin"],
    difficulty: "easy",
    type: "text",
    justification: "Gastrin is the key hormone that drives the pathophysiology of ZES by stimulating excessive acid production."
  },
  {
    title: "Zollinger-Ellison Syndrome - Tumor Type",
    question: "What type of tumor is a gastrinoma in Zollinger-Ellison Syndrome?",
    answer: "A neuroendocrine tumor.",
    description: "ZES pathology",
    tags: ["gastroenterology", "zollinger-ellison", "neuroendocrine"],
    difficulty: "medium",
    type: "text",
    justification: "Gastrinomas are neuroendocrine tumors that can be benign or malignant, with about 60% being malignant."
  },
  {
    title: "Zollinger-Ellison Syndrome - Lipase Inactivation",
    question: "What complication of ZES is due to acid inactivation of lipase?",
    answer: "Malabsorption and steatorrhea.",
    description: "ZES complications",
    tags: ["gastroenterology", "zollinger-ellison", "complications"],
    difficulty: "medium",
    type: "text",
    justification: "Pancreatic lipase is inactivated by the acidic environment, preventing proper fat digestion and absorption."
  }
];

const lymphadenopathyFlashcards = [
  {
    title: "Lymphadenopathy - Definition",
    question: "What is the definition of lymphadenopathy?",
    answer: "Lymphadenopathy is the enlargement and/or change in consistency of one or more lymph nodes.",
    description: "Basic lymphadenopathy concept",
    tags: ["immunology", "lymphadenopathy", "definition"],
    difficulty: "easy",
    type: "text",
    justification: "Lymphadenopathy refers to abnormal lymph nodes in size, consistency, or number."
  },
  {
    title: "Lymphadenopathy - Infectious Features",
    question: "Which features suggest an infectious cause of lymphadenopathy?",
    answer: "Tender, soft, and mobile nodes → usually infection (eg, bacterial or viral).",
    description: "Infectious lymphadenopathy characteristics",
    tags: ["immunology", "lymphadenopathy", "infection"],
    difficulty: "easy",
    type: "text",
    justification: "Infectious lymphadenopathy is typically characterized by tenderness and mobility due to acute inflammation."
  },
  {
    title: "Lymphadenopathy - Malignant Features",
    question: "Which features suggest a malignant cause of lymphadenopathy?",
    answer: "Firm, painless, hard, or fixed nodes → often lymphoma or metastatic cancer.",
    description: "Malignant lymphadenopathy characteristics",
    tags: ["immunology", "lymphadenopathy", "malignancy"],
    difficulty: "easy",
    type: "text",
    justification: "Malignant nodes are typically painless and fixed due to invasion of surrounding structures."
  },
  {
    title: "Lymphadenopathy - MIAMI Mnemonic",
    question: "What does the mnemonic MIAMI stand for in causes of lymphadenopathy?",
    answer: "Malignancy, Infection, Autoimmune, Miscellaneous, Iatrogenic.",
    description: "Lymphadenopathy causes mnemonic",
    tags: ["immunology", "lymphadenopathy", "mnemonic"],
    difficulty: "easy",
    type: "text",
    justification: "MIAMI is a useful mnemonic to remember the major categories of lymphadenopathy causes."
  },
  {
    title: "Lymphadenopathy vs Lymphadenitis",
    question: "What is the difference between lymphadenitis and lymphadenopathy?",
    answer: "Lymphadenitis = lymph node inflammation (usually infectious). Lymphadenopathy = lymph node enlargement (any cause).",
    description: "Terminology distinction",
    tags: ["immunology", "lymphadenopathy", "lymphadenitis"],
    difficulty: "medium",
    type: "text",
    justification: "Lymphadenitis is a specific type of lymphadenopathy caused by inflammation, usually infectious."
  },
  {
    title: "Lymphadenopathy - Autoimmune Diseases",
    question: "Which autoimmune diseases are commonly associated with generalized lymphadenopathy?",
    answer: "SLE (Systemic Lupus Erythematosus) and RA (Rheumatoid Arthritis).",
    description: "Autoimmune lymphadenopathy",
    tags: ["immunology", "lymphadenopathy", "autoimmune"],
    difficulty: "medium",
    type: "text",
    justification: "Autoimmune diseases cause chronic immune activation leading to generalized lymph node enlargement."
  },
  {
    title: "Lymphadenopathy - Systemic Infections",
    question: "Which infections typically cause generalized lymphadenopathy?",
    answer: "HIV (Human Immunodeficiency Virus), EBV, CMV, secondary syphilis, and toxoplasmosis.",
    description: "Systemic infectious causes",
    tags: ["immunology", "lymphadenopathy", "systemic-infection"],
    difficulty: "medium",
    type: "text",
    justification: "These systemic infections cause widespread immune activation and lymph node enlargement."
  },
  {
    title: "Lymphadenopathy - Tuberculosis",
    question: "Which condition is associated with caseating granulomas in lymph nodes?",
    answer: "Tuberculosis (TB).",
    description: "TB lymphadenopathy",
    tags: ["immunology", "lymphadenopathy", "tuberculosis"],
    difficulty: "medium",
    type: "text",
    justification: "TB characteristically causes caseating (cheese-like) granulomatous inflammation in lymph nodes."
  },
  {
    title: "Lymphadenopathy - Viral Histology",
    question: "Which histologic finding in lymph nodes suggests viral infection?",
    answer: "Paracortical hyperplasia due to T-cell activation.",
    description: "Viral infection histology",
    tags: ["immunology", "lymphadenopathy", "viral"],
    difficulty: "hard",
    type: "text",
    justification: "Viral infections primarily activate T-cells, leading to expansion of the paracortical (T-cell) zone."
  },
  {
    title: "Lymphadenopathy - Chronic Stimulation",
    question: "Which histologic finding in lymph nodes suggests chronic antigenic stimulation?",
    answer: "Multiple germinal centers from B-cell proliferation.",
    description: "Chronic stimulation histology",
    tags: ["immunology", "lymphadenopathy", "chronic-stimulation"],
    difficulty: "hard",
    type: "text",
    justification: "Chronic antigenic stimulation leads to B-cell activation and formation of multiple reactive germinal centers."
  }
];

async function addFlashcards() {
  try {
    console.log('🚀 Iniciando adição de flashcards...');

    // Verificar se já existem flashcards similares
    const { data: existingCards, error: checkError } = await supabase
      .from('flashcards')
      .select('question, tags');

    if (checkError) {
      console.error('❌ Erro ao verificar flashcards existentes:', checkError);
      return;
    }

    const existingQuestions = existingCards ? existingCards.map(card => card.question.toLowerCase()) : [];

    // Filtrar flashcards que não existem
    const newZollingerCards = zollingerFlashcards.filter(card => 
      !existingQuestions.includes(card.question.toLowerCase())
    );

    const newLymphadenopathyCards = lymphadenopathyFlashcards.filter(card => 
      !existingQuestions.includes(card.question.toLowerCase())
    );

    console.log(`📊 Flashcards a adicionar: ${newZollingerCards.length} Zollinger + ${newLymphadenopathyCards.length} Lymphadenopathy`);

    // Adicionar flashcards de Zollinger-Ellison
    if (newZollingerCards.length > 0) {
      const { data: zollingerData, error: zollingerError } = await supabase
        .from('flashcards')
        .insert(newZollingerCards)
        .select();

      if (zollingerError) {
        console.error('❌ Erro ao adicionar flashcards Zollinger:', zollingerError);
      } else {
        console.log(`✅ ${zollingerData.length} flashcards Zollinger-Ellison adicionados`);
      }
    }

    // Adicionar flashcards de Lymphadenopathy
    if (newLymphadenopathyCards.length > 0) {
      const { data: lymphData, error: lymphError } = await supabase
        .from('flashcards')
        .insert(newLymphadenopathyCards)
        .select();

      if (lymphError) {
        console.error('❌ Erro ao adicionar flashcards Lymphadenopathy:', lymphError);
      } else {
        console.log(`✅ ${lymphData.length} flashcards Lymphadenopathy adicionados`);
      }
    }

    // Verificar total final
    const { data: finalCount, error: countError } = await supabase
      .from('flashcards')
      .select('id', { count: 'exact' });

    if (!countError) {
      console.log(`🎯 Total de flashcards no banco: ${finalCount.length}`);
    }

    console.log('🎉 Processo concluído com sucesso!');

  } catch (error) {
    console.error('💥 Erro geral:', error);
  }
}

addFlashcards();

