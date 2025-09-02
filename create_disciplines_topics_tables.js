import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://truepksaojbpgwdtelbb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydWVwa3Nhb2picGd3ZHRlbGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzM0NjcsImV4cCI6MjA3MDE0OTQ2N30.UO0hdlI6IAvJeWDEbrnicMMLNn9ExAV7zPQlEc3DgTk'
);

async function createTables() {
  console.log('🚀 Criando tabelas de disciplinas e temas...');

  try {
    // Verificar se as tabelas já existem
    const { data: disciplinesExists } = await supabase
      .from('disciplines')
      .select('id')
      .limit(1);

    const { data: topicsExists } = await supabase
      .from('topics')
      .select('id')
      .limit(1);

    if (disciplinesExists !== null) {
      console.log('✅ Tabela disciplines já existe');
    } else {
      console.log('❌ Tabela disciplines não existe - precisa ser criada via SQL');
    }

    if (topicsExists !== null) {
      console.log('✅ Tabela topics já existe');
    } else {
      console.log('❌ Tabela topics não existe - precisa ser criada via SQL');
    }

    // Inserir disciplinas padrão se não existirem
    if (disciplinesExists !== null && disciplinesExists.length === 0) {
      console.log('📚 Inserindo disciplinas padrão...');
      
      const defaultDisciplines = [
        { name: 'Anatomia', description: 'Estudo da estrutura do corpo humano', color: '#3B82F6', icon: '🦴', order_index: 1 },
        { name: 'Fisiologia', description: 'Estudo das funções do corpo humano', color: '#10B981', icon: '🫀', order_index: 2 },
        { name: 'Patologia', description: 'Estudo das doenças', color: '#EF4444', icon: '🔬', order_index: 3 },
        { name: 'Farmacologia', description: 'Estudo dos medicamentos', color: '#8B5CF6', icon: '💊', order_index: 4 },
        { name: 'Cardiologia', description: 'Doenças do coração e sistema cardiovascular', color: '#DC2626', icon: '🫀', order_index: 5 },
        { name: 'Neurologia', description: 'Doenças do sistema nervoso', color: '#7C3AED', icon: '🧠', order_index: 6 },
        { name: 'Gastroenterologia', description: 'Doenças do sistema digestivo', color: '#059669', icon: '🫃', order_index: 7 },
        { name: 'Pneumologia', description: 'Doenças do sistema respiratório', color: '#0EA5E9', icon: '🫁', order_index: 8 },
        { name: 'Endocrinologia', description: 'Doenças do sistema endócrino', color: '#F59E0B', icon: '⚗️', order_index: 9 },
        { name: 'Hematologia', description: 'Doenças do sangue', color: '#DC2626', icon: '🩸', order_index: 10 },
        { name: 'Oncologia', description: 'Estudo e tratamento do câncer', color: '#7C2D12', icon: '🎗️', order_index: 11 },
        { name: 'Infectologia', description: 'Doenças infecciosas', color: '#16A34A', icon: '🦠', order_index: 12 },
        { name: 'Dermatologia', description: 'Doenças da pele', color: '#EA580C', icon: '🫱', order_index: 13 },
        { name: 'Oftalmologia', description: 'Doenças dos olhos', color: '#0284C7', icon: '👁️', order_index: 14 },
        { name: 'Otorrinolaringologia', description: 'Doenças do ouvido, nariz e garganta', color: '#7C3AED', icon: '👂', order_index: 15 },
        { name: 'Urologia', description: 'Doenças do sistema urinário', color: '#0891B2', icon: '🫘', order_index: 16 },
        { name: 'Ginecologia', description: 'Saúde da mulher', color: '#EC4899', icon: '🌸', order_index: 17 },
        { name: 'Pediatria', description: 'Medicina infantil', color: '#F97316', icon: '👶', order_index: 18 },
        { name: 'Geriatria', description: 'Medicina do idoso', color: '#6B7280', icon: '👴', order_index: 19 },
        { name: 'Psiquiatria', description: 'Doenças mentais', color: '#8B5CF6', icon: '🧠', order_index: 20 },
        { name: 'Ortopedia', description: 'Doenças dos ossos e articulações', color: '#78716C', icon: '🦴', order_index: 21 },
        { name: 'Radiologia', description: 'Diagnóstico por imagem', color: '#374151', icon: '📡', order_index: 22 },
        { name: 'Anestesiologia', description: 'Anestesia e dor', color: '#6B7280', icon: '💉', order_index: 23 },
        { name: 'Medicina de Emergência', description: 'Atendimento de urgência', color: '#DC2626', icon: '🚨', order_index: 24 },
        { name: 'Medicina Preventiva', description: 'Prevenção de doenças', color: '#16A34A', icon: '🛡️', order_index: 25 },
        { name: 'Imunologia', description: 'Sistema imunológico', color: '#0EA5E9', icon: '🛡️', order_index: 26 }
      ];

      const { data, error } = await supabase
        .from('disciplines')
        .insert(defaultDisciplines);

      if (error) {
        console.error('❌ Erro ao inserir disciplinas:', error);
      } else {
        console.log('✅ Disciplinas padrão inseridas com sucesso!');
      }
    }

    console.log('🎉 Processo concluído!');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar o script
createTables();

