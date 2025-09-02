import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://truepksaojbpgwdtelbb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydWVwa3Nhb2picGd3ZHRlbGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzM0NjcsImV4cCI6MjA3MDE0OTQ2N30.UO0hdlI6IAvJeWDEbrnicMMLNn9ExAV7zPQlEc3DgTk';

const supabase = createClient(supabaseUrl, supabaseKey);

const embryologyFlashcards = [
  {
    question: "What is the first visible structure to appear in the embryonic disc during gastrulation?",
    answer: "Primitive streak, which marks the beginning of gastrulation and defines the body axes.",
    category: "Embryology",
    difficulty: "Medium"
  },
  {
    question: "Which germ layer gives rise to the central and peripheral nervous systems?",
    answer: "Ectoderm\n• Neuroectoderm → CNS (Central Nervous System)\n• Neural crest → PNS (Peripheral Nervous System)",
    category: "Embryology", 
    difficulty: "Easy"
  },
  {
    question: "What key embryonic structure induces formation of the neural plate?",
    answer: "The notochord from the axial mesoderm, which induces overlying ectoderm to form the neural plate.",
    category: "Embryology",
    difficulty: "Medium"
  },
  {
    question: "Which process results in formation of the trilaminar embryonic disc?",
    answer: "Gastrulation, which transforms the bilaminar disc into ectoderm, mesoderm, and endoderm.",
    category: "Embryology",
    difficulty: "Easy"
  },
  {
    question: "A newborn is diagnosed with a neural tube defect. Which embryologic event failed?",
    answer: "Neurulation, specifically failure of neural tube closure during week 4.\nMnemonic: Neuropores close by day 25 (anterior) and day 27 (posterior).",
    category: "Embryology",
    difficulty: "Hard"
  },
  {
    question: "What germ layer forms the gastrointestinal tract epithelium?",
    answer: "Endoderm forms the lining of the GI tract, respiratory tract, bladder, and some endocrine glands.",
    category: "Embryology",
    difficulty: "Easy"
  },
  {
    question: "Why are neural crest cells considered pluripotent in development?",
    answer: "They give rise to PNS, melanocytes, adrenal medulla, craniofacial cartilage, and more.\nMnemonic: CALMEST POSE (C cells, Adrenal medulla, Leptomeninges, Melanocytes, Enterochromaffin, Septum, Teeth, PNS, Odontoblasts, Spiral septum, Endocardial cushions).",
    category: "Embryology",
    difficulty: "Hard"
  },
  {
    question: "Which mesodermal subdivision gives rise to the kidneys and gonads?",
    answer: "Intermediate mesoderm forms urogenital structures.",
    category: "Embryology",
    difficulty: "Medium"
  },
  {
    question: "Which embryonic layer forms the spleen and adrenal cortex?",
    answer: "Lateral plate mesoderm (splanchnic) — also forms heart, blood vessels, and gut smooth muscle.",
    category: "Embryology",
    difficulty: "Medium"
  },
  {
    question: "A patient with DiGeorge syndrome has heart outflow tract defects. What is the embryologic origin?",
    answer: "Neural crest cells, which contribute to the aorticopulmonary septum.\nCommon Mistake Alert: This is not derived from mesoderm.",
    category: "Embryology",
    difficulty: "Hard"
  },
  {
    question: "What embryonic germ layer forms the adrenal cortex?",
    answer: "Mesoderm (splanchnic lateral plate).\nCommon Mistake Alert: Adrenal medulla is neural crest-derived.",
    category: "Embryology",
    difficulty: "Medium"
  },
  {
    question: "What structure connects the yolk sac to the midgut in early development?",
    answer: "Vitelline duct (aka omphalomesenteric duct) — persistence can lead to Meckel diverticulum.",
    category: "Embryology",
    difficulty: "Medium"
  },
  {
    question: "Which week of development does the neural tube close?",
    answer: "Week 4\n• Anterior neuropore closes ~day 25\n• Posterior neuropore closes ~day 27",
    category: "Embryology",
    difficulty: "Easy"
  },
  {
    question: "What is the embryologic origin of the anterior pituitary?",
    answer: "Surface ectoderm, specifically Rathke's pouch.",
    category: "Embryology",
    difficulty: "Medium"
  },
  {
    question: "A newborn has a cleft lip. Failure of which embryonic process most likely occurred?",
    answer: "Failure of fusion between maxillary and medial nasal processes.\nMnemonic: \"M&M fail → cleft lip\"",
    category: "Embryology",
    difficulty: "Medium"
  },
  {
    question: "Which cells secrete beta-hCG in early pregnancy?",
    answer: "Syncytiotrophoblasts, which invade the endometrium and support corpus luteum function.",
    category: "Embryology",
    difficulty: "Medium"
  },
  {
    question: "What embryonic structure gives rise to melanocytes?",
    answer: "Neural crest cells, which migrate to the epidermis and form melanocytes.",
    category: "Embryology",
    difficulty: "Easy"
  },
  {
    question: "Which embryonic germ layer gives rise to the bladder epithelium?",
    answer: "Endoderm forms bladder, urethra, and lower urogenital tract epithelium.",
    category: "Embryology",
    difficulty: "Easy"
  },
  {
    question: "What is the fate of the notochord in the adult?",
    answer: "Forms the nucleus pulposus of the intervertebral disc.\nMnemonic: \"Noto = Nucleus\"",
    category: "Embryology",
    difficulty: "Medium"
  },
  {
    question: "A child has a midline neck mass that moves with swallowing. What is the likely diagnosis?",
    answer: "Thyroglossal duct cyst, derived from thyroid primordium (endoderm).\nCommon Mistake Alert: Not a branchial cleft cyst, which is lateral.",
    category: "Embryology",
    difficulty: "Hard"
  },
  {
    question: "What embryonic layer forms the parathyroid glands?",
    answer: "Endoderm — from the 3rd and 4th pharyngeal pouches.\nMnemonic: \"3 = inferior, 4 = superior\" parathyroids.",
    category: "Embryology",
    difficulty: "Medium"
  },
  {
    question: "Which germ layer gives rise to both bone and muscle tissue?",
    answer: "Mesoderm, particularly the paraxial mesoderm → somites → sclerotome (bone) and myotome (muscle).",
    category: "Embryology",
    difficulty: "Easy"
  },
  {
    question: "What is the embryologic origin of the lens of the eye?",
    answer: "Surface ectoderm → lens placode → lens.",
    category: "Embryology",
    difficulty: "Medium"
  },
  {
    question: "Why is the period between weeks 3–8 of gestation most vulnerable to teratogens?",
    answer: "This is the organogenesis phase, including gastrulation, neurulation, and folding.\nMnemonic: 3 = 3 layers, 4 = 4 limbs.",
    category: "Embryology",
    difficulty: "Medium"
  },
  {
    question: "A newborn presents with a lateral neck sinus tract. What is the most likely embryologic error?",
    answer: "Failure of obliteration of 2nd–4th pharyngeal grooves (ectoderm).\nCommon Mistake Alert: Not to be confused with thyroglossal duct cyst (midline).",
    category: "Embryology",
    difficulty: "Hard"
  },
  {
    question: "Which cells give rise to the adrenal medulla?",
    answer: "Neural crest cells, which differentiate into chromaffin cells.",
    category: "Embryology",
    difficulty: "Medium"
  },
  {
    question: "How is the neural crest formed during neurulation?",
    answer: "From cells that migrate and detach from the neural folds as the neural tube closes.",
    category: "Embryology",
    difficulty: "Medium"
  },
  {
    question: "What structure gives rise to the primitive gut tube?",
    answer: "Endoderm, following embryonic folding (lateral and craniocaudal).",
    category: "Embryology",
    difficulty: "Easy"
  },
  {
    question: "Which embryonic structure is responsible for secreting hCG (human chorionic gonadotropin)?",
    answer: "Syncytiotrophoblasts, essential for maintaining progesterone production in early pregnancy.",
    category: "Embryology",
    difficulty: "Medium"
  },
  {
    question: "What is the embryologic origin of the retina?",
    answer: "Neuroectoderm (neural tube) — the retina is part of the CNS.\nMnemonic: \"Retina = Brain = Neuroectoderm\"",
    category: "Embryology",
    difficulty: "Medium"
  }
];

async function addEmbryologyFlashcards() {
  console.log('🧬 Adicionando 30 flashcards de embriologia...');

  try {
    // Verificar disciplina Embryology
    let { data: discipline } = await supabase
      .from('disciplines')
      .select('id')
      .eq('name', 'Embryology')
      .single();

    if (!discipline) {
      console.log('📚 Criando disciplina Embryology...');
      const { data: newDiscipline, error: disciplineError } = await supabase
        .from('disciplines')
        .insert([{
          name: 'Embryology',
          description: 'Embryogenesis, Derivatives, and Gastrulation',
          color: '#9333ea'
        }])
        .select()
        .single();

      if (disciplineError) throw disciplineError;
      discipline = newDiscipline;
    }

    console.log('📚 Disciplina Embryology ID:', discipline.id);

    // Adicionar flashcards
    for (let i = 0; i < embryologyFlashcards.length; i++) {
      const flashcard = embryologyFlashcards[i];
      const flashcardNumber = (discipline.id * 100) + (i + 1); // Ex: 1301, 1302, etc.

      console.log(`📝 Adicionando flashcard ${i + 1}/30: ${flashcardNumber}`);

      const { error } = await supabase
        .from('flashcards')
        .insert([{
          title: `Embryology ${i + 1}`,
          question: flashcard.question,
          answer: flashcard.answer,
          difficulty: flashcard.difficulty.toLowerCase(),
          type: 'text',
          tags: ['embryology', flashcard.category.toLowerCase()],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (error) {
        console.error(`❌ Erro ao adicionar flashcard ${i + 1}:`, error);
      } else {
        console.log(`✅ Flashcard ${flashcardNumber} adicionado com sucesso`);
      }
    }

    console.log('🎉 Todos os 30 flashcards de embriologia foram adicionados!');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

addEmbryologyFlashcards();

