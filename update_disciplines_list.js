import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://truepksaojbpgwdtelbb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydWVwa3Nhb2picGd3ZHRlbGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzM0NjcsImV4cCI6MjA3MDE0OTQ2N30.UO0hdlI6IAvJeWDEbrnicMMLNn9ExAV7zPQlEc3DgTk'

const supabase = createClient(supabaseUrl, supabaseKey)

const newDisciplines = [
  {
    name: 'Anatomy, Musculoskeletal & Rheumatology',
    description: 'Anatomia, sistema musculoesquelético e reumatologia',
    icon: '🦴',
    color: '#3B82F6',
    order: 1
  },
  {
    name: 'Behavioral Science',
    description: 'Ciências comportamentais e psicologia médica',
    icon: '🧠',
    color: '#8B5CF6',
    order: 2
  },
  {
    name: 'Biochemistry',
    description: 'Bioquímica e metabolismo',
    icon: '🧪',
    color: '#10B981',
    order: 3
  },
  {
    name: 'Biostatistics & Epidemiology',
    description: 'Bioestatística e epidemiologia',
    icon: '📊',
    color: '#F59E0B',
    order: 4
  },
  {
    name: 'Cardiology',
    description: 'Cardiologia e sistema cardiovascular',
    icon: '❤️',
    color: '#EF4444',
    order: 5
  },
  {
    name: 'Dermatology',
    description: 'Dermatologia e doenças da pele',
    icon: '🪺',
    color: '#F97316',
    order: 6
  },
  {
    name: 'Endocrinology',
    description: 'Endocrinologia e sistema endócrino',
    icon: '⚖️',
    color: '#06B6D4',
    order: 7
  },
  {
    name: 'Female Genital, Reproductive & Breast',
    description: 'Sistema reprodutivo feminino e mama',
    icon: '🌸',
    color: '#EC4899',
    order: 8
  },
  {
    name: 'Gastroenterology',
    description: 'Gastroenterologia e sistema digestivo',
    icon: '🫁',
    color: '#84CC16',
    order: 9
  },
  {
    name: 'Hematology',
    description: 'Hematologia e doenças do sangue',
    icon: '🩸',
    color: '#DC2626',
    order: 10
  },
  {
    name: 'Immunology',
    description: 'Imunologia e sistema imune',
    icon: '🛡️',
    color: '#059669',
    order: 11
  },
  {
    name: 'Infectious Disease',
    description: 'Doenças infecciosas e microbiologia',
    icon: '🦠',
    color: '#7C2D12',
    order: 12
  },
  {
    name: 'Male Pathology',
    description: 'Patologia masculina e urologia',
    icon: '♂️',
    color: '#1E40AF',
    order: 13
  },
  {
    name: 'Neurology',
    description: 'Neurologia e sistema nervoso',
    icon: '🧠',
    color: '#7C3AED',
    order: 14
  },
  {
    name: 'Pathology',
    description: 'Patologia geral e anatomia patológica',
    icon: '🔬',
    color: '#374151',
    order: 15
  },
  {
    name: 'Pharmacology',
    description: 'Farmacologia e terapêutica',
    icon: '💊',
    color: '#0891B2',
    order: 16
  },
  {
    name: 'Psychiatry',
    description: 'Psiquiatria e saúde mental',
    icon: '🧘',
    color: '#BE185D',
    order: 17
  },
  {
    name: 'Pulmonary',
    description: 'Pneumologia e sistema respiratório',
    icon: '🫁',
    color: '#0D9488',
    order: 18
  },
  {
    name: 'Renal',
    description: 'Nefrologia e sistema renal',
    icon: '🫘',
    color: '#7C2D12',
    order: 19
  }
]

async function updateDisciplines() {
  try {
    console.log('🔄 Iniciando atualização das disciplinas...')

    // 1. Primeiro buscar todas as disciplinas existentes
    console.log('🔍 Buscando disciplinas existentes...')
    const { data: existingDisciplines } = await supabase
      .from('disciplines')
      .select('*')

    console.log(`📊 Encontradas ${existingDisciplines?.length || 0} disciplinas existentes`)

    // 2. Inserir apenas as novas disciplinas (que não existem)
    console.log('📝 Inserindo novas disciplinas...')
    
    for (const newDiscipline of newDisciplines) {
      // Verificar se já existe
      const exists = existingDisciplines?.find(d => d.name === newDiscipline.name)
      
      if (!exists) {
        console.log(`➕ Inserindo: ${newDiscipline.name}`)
        const { error } = await supabase
          .from('disciplines')
          .insert([newDiscipline])
        
        if (error) {
          console.error(`❌ Erro ao inserir ${newDiscipline.name}:`, error)
        } else {
          console.log(`✅ ${newDiscipline.name} inserida`)
        }
      } else {
        console.log(`⏭️ Já existe: ${newDiscipline.name}`)
      }
    }

    // 3. Listar todas as disciplinas atuais
    const { data: finalDisciplines } = await supabase
      .from('disciplines')
      .select('*')
      .order('order', { ascending: true })

    console.log('\n📋 DISCIPLINAS ATUAIS:')
    finalDisciplines?.forEach((discipline, index) => {
      console.log(`${index + 1}. ${discipline.icon} ${discipline.name}`)
    })

    console.log('\n🎉 Atualização concluída com sucesso!')

  } catch (error) {
    console.error('❌ Erro geral:', error)
  }
}

updateDisciplines()

