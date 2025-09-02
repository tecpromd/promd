import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://truepksaojbpgwdtelbb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydWVwa3Nhb2picGd3ZHRlbGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzM0NjcsImV4cCI6MjA3MDE0OTQ2N30.UO0hdlI6IAvJeWDEbrnicMMLNn9ExAV7zPQlEc3DgTk';

const supabase = createClient(supabaseUrl, supabaseKey);

// Questões de Zollinger-Ellison Syndrome (Gastroenterology - ID 10)
const zollingerQuestions = [
  {
    question_number: 100001,
    question_text: "A 45-year-old man presents with recurrent peptic ulcers beyond the duodenal bulb and chronic diarrhea. Laboratory tests show fasting serum gastrin (FSG) of 1200 pg/mL and gastric pH of 1.5. What is the most likely diagnosis?\n\nA) H. pylori-associated peptic ulcer disease\nB) Zollinger-Ellison Syndrome\nC) NSAID-induced ulcer\nD) Carcinoid syndrome\nE) VIPoma",
    explanation: "ZES is characterized by FSG >1000 pg/mL with gastric pH <2, recurrent distal ulcers, and diarrhea due to gastrinomas secreting excessive gastrin. The correct answer is B) Zollinger-Ellison Syndrome.",
    difficulty: "medium",
    question_type: "multiple_choice",
    tags: ["zollinger-ellison", "gastrinoma", "peptic-ulcer"]
  },
  {
    question_number: 100002,
    question_text: "Which diagnostic test is most useful when fasting serum gastrin levels are equivocal in suspected Zollinger-Ellison Syndrome?\n\nA) Chromogranin A level\nB) Secretin stimulation test\nC) Gastric acid analysis\nD) Somatostatin receptor scintigraphy\nE) Upper endoscopy",
    explanation: "In ZES, secretin paradoxically stimulates gastrin release from gastrinomas, causing an increase >120 pg/mL, unlike normal physiology where secretin inhibits gastrin. The correct answer is B) Secretin stimulation test.",
    difficulty: "hard",
    question_type: "multiple_choice",
    tags: ["zollinger-ellison", "secretin-test", "diagnosis"]
  },
  {
    question_number: 100003,
    question_text: "A patient with Zollinger-Ellison Syndrome develops steatorrhea and malabsorption. What is the underlying mechanism?\n\nA) Pancreatic enzyme deficiency\nB) Bile acid malabsorption\nC) Acid inactivation of pancreatic lipase\nD) Small bowel bacterial overgrowth\nE) Celiac disease",
    explanation: "Excessive gastric acid production in ZES denatures pancreatic lipase and other digestive enzymes, leading to fat malabsorption and steatorrhea. The correct answer is C) Acid inactivation of pancreatic lipase.",
    difficulty: "medium",
    question_type: "multiple_choice",
    tags: ["zollinger-ellison", "steatorrhea", "malabsorption"]
  },
  {
    question_number: 100004,
    question_text: "What percentage of Zollinger-Ellison Syndrome cases are associated with Multiple Endocrine Neoplasia type 1 (MEN1)?\n\nA) 10%\nB) 25%\nC) 50%\nD) 75%\nE) 90%",
    explanation: "About 25% of ZES cases are associated with MEN1 syndrome, which involves tumors of the pituitary, parathyroid, and pancreas. The correct answer is B) 25%.",
    difficulty: "easy",
    question_type: "multiple_choice",
    tags: ["zollinger-ellison", "men1", "genetics"]
  },
  {
    question_number: 100005,
    question_text: "What is the first-line treatment for acid hypersecretion in Zollinger-Ellison Syndrome?\n\nA) H2 receptor antagonists\nB) High-dose proton pump inhibitors\nC) Octreotide\nD) Surgical resection\nE) Antacids",
    explanation: "High-dose PPIs like omeprazole are the first-line treatment to control gastric acid hypersecretion in ZES, effectively blocking acid production. The correct answer is B) High-dose proton pump inhibitors.",
    difficulty: "easy",
    question_type: "multiple_choice",
    tags: ["zollinger-ellison", "treatment", "ppi"]
  }
];

// Questões de Lymphadenopathy (Immunology - ID 21)
const lymphadenopathyQuestions = [
  {
    question_number: 210001,
    question_text: "A 20-year-old college student presents with fever, sore throat, and bilateral cervical lymphadenopathy. The lymph nodes are tender, soft, and mobile. What is the most likely cause?\n\nA) Hodgkin lymphoma\nB) Metastatic cancer\nC) Viral infection (EBV)\nD) Tuberculosis\nE) Sarcoidosis",
    explanation: "Tender, soft, and mobile lymph nodes typically indicate infectious causes. In a young adult with fever and sore throat, EBV (infectious mononucleosis) is most likely. The correct answer is C) Viral infection (EBV).",
    difficulty: "easy",
    question_type: "multiple_choice",
    tags: ["lymphadenopathy", "ebv", "infection"]
  },
  {
    question_number: 210002,
    question_text: "Which lymph node characteristics are most suggestive of malignancy?\n\nA) Tender, soft, and mobile\nB) Firm, painless, and fixed\nC) Fluctuant and warm\nD) Small and multiple\nE) Bilateral and symmetric",
    explanation: "Malignant lymph nodes are typically firm, painless, and fixed due to invasion of surrounding structures, unlike infectious nodes which are tender and mobile. The correct answer is B) Firm, painless, and fixed.",
    difficulty: "easy",
    question_type: "multiple_choice",
    tags: ["lymphadenopathy", "malignancy", "physical-exam"]
  },
  {
    question_number: 210003,
    question_text: "What does the mnemonic MIAMI represent in the differential diagnosis of lymphadenopathy?\n\nA) Metabolic, Infectious, Autoimmune, Malignant, Iatrogenic\nB) Malignancy, Infection, Autoimmune, Miscellaneous, Iatrogenic\nC) Malignancy, Inflammatory, Autoimmune, Metabolic, Infectious\nD) Metastatic, Infectious, Allergic, Malignant, Idiopathic\nE) Malignancy, Infection, Allergic, Miscellaneous, Inflammatory",
    explanation: "MIAMI is a useful mnemonic for remembering the major categories of lymphadenopathy causes: Malignancy, Infection, Autoimmune, Miscellaneous, Iatrogenic. The correct answer is B) Malignancy, Infection, Autoimmune, Miscellaneous, Iatrogenic.",
    difficulty: "easy",
    question_type: "multiple_choice",
    tags: ["lymphadenopathy", "mnemonic", "differential-diagnosis"]
  },
  {
    question_number: 210004,
    question_text: "Which histologic finding in lymph nodes is characteristic of viral infections?\n\nA) Caseating granulomas\nB) Reed-Sternberg cells\nC) Paracortical hyperplasia\nD) Plasma cell infiltration\nE) Neutrophilic infiltration",
    explanation: "Viral infections primarily activate T-cells, leading to expansion of the paracortical (T-cell) zone, resulting in paracortical hyperplasia. The correct answer is C) Paracortical hyperplasia.",
    difficulty: "hard",
    question_type: "multiple_choice",
    tags: ["lymphadenopathy", "histology", "viral-infection"]
  },
  {
    question_number: 210005,
    question_text: "Which condition is associated with caseating granulomas in lymph nodes?\n\nA) Sarcoidosis\nB) Tuberculosis\nC) Hodgkin lymphoma\nD) Systemic lupus erythematosus\nE) Infectious mononucleosis",
    explanation: "Tuberculosis characteristically causes caseating (cheese-like) granulomatous inflammation in lymph nodes, unlike sarcoidosis which causes non-caseating granulomas. The correct answer is B) Tuberculosis.",
    difficulty: "medium",
    question_type: "multiple_choice",
    tags: ["lymphadenopathy", "tuberculosis", "granulomas"]
  }
];

async function addQuestions() {
  try {
    console.log('🚀 Iniciando adição de questões dos PDFs...');

    // Verificar questões existentes
    const { data: existingQuestions, error: checkError } = await supabase
      .from('questions')
      .select('question_number, question_text');

    if (checkError) {
      console.error('❌ Erro ao verificar questões existentes:', checkError);
      return;
    }

    const existingNumbers = existingQuestions ? existingQuestions.map(q => q.question_number) : [];
    const existingTexts = existingQuestions ? existingQuestions.map(q => q.question_text.toLowerCase()) : [];

    // Filtrar questões que não existem
    const newZollingerQuestions = zollingerQuestions.filter(q => 
      !existingNumbers.includes(q.question_number) && 
      !existingTexts.includes(q.question_text.toLowerCase())
    );

    const newLymphadenopathyQuestions = lymphadenopathyQuestions.filter(q => 
      !existingNumbers.includes(q.question_number) && 
      !existingTexts.includes(q.question_text.toLowerCase())
    );

    console.log(`📊 Questões a adicionar: ${newZollingerQuestions.length} Zollinger + ${newLymphadenopathyQuestions.length} Lymphadenopathy`);

    // Adicionar questões de Zollinger-Ellison
    if (newZollingerQuestions.length > 0) {
      const { data: zollingerData, error: zollingerError } = await supabase
        .from('questions')
        .insert(newZollingerQuestions)
        .select();

      if (zollingerError) {
        console.error('❌ Erro ao adicionar questões Zollinger:', zollingerError);
      } else {
        console.log(`✅ ${zollingerData.length} questões Zollinger-Ellison adicionadas`);
      }
    }

    // Adicionar questões de Lymphadenopathy
    if (newLymphadenopathyQuestions.length > 0) {
      const { data: lymphData, error: lymphError } = await supabase
        .from('questions')
        .insert(newLymphadenopathyQuestions)
        .select();

      if (lymphError) {
        console.error('❌ Erro ao adicionar questões Lymphadenopathy:', lymphError);
      } else {
        console.log(`✅ ${lymphData.length} questões Lymphadenopathy adicionadas`);
      }
    }

    // Verificar total final
    const { data: finalCount, error: countError } = await supabase
      .from('questions')
      .select('id', { count: 'exact' });

    if (!countError) {
      console.log(`🎯 Total de questões no banco: ${finalCount.length}`);
    }

    console.log('🎉 Processo concluído com sucesso!');

  } catch (error) {
    console.error('💥 Erro geral:', error);
  }
}

addQuestions();

