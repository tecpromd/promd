import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://truepksaojbpgwdtelbb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydWVwa3Nhb2picGd3ZHRlbGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzM0NjcsImV4cCI6MjA3MDE0OTQ2N30.UO0hdlI6IAvJeWDEbrnicMMLNn9ExAV7zPQlEc3DgTk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixDisciplineIcons() {
  console.log('🔧 Corrigindo ícones das disciplinas...');

  // Mapeamento de ícones corretos
  const iconFixes = {
    'BookOpen': '📚',
    'Heart': '❤️', 
    'Stethoscope': '🩺',
    'Scan': '🔍',
    'Zap': '⚡',
    'Stomach': '🫄',
    'User': '👤',
    'Activity': '📈',
    'Shield': '🛡️',
    'Droplets': '💧',
    'Brain': '🧠',
    'Eye': '👁️',
    'Bone': '🦴',
    'Baby': '👶',
    'Lungs': '🫁',
    'medical': '⚕️',
    'card': '🃏'
  };

  try {
    // Buscar todas as disciplinas
    const { data: disciplines, error: fetchError } = await supabase
      .from('disciplines')
      .select('*');

    if (fetchError) throw fetchError;

    console.log(`📋 Encontradas ${disciplines.length} disciplinas`);

    // Corrigir ícones
    for (const discipline of disciplines) {
      if (iconFixes[discipline.icon]) {
        console.log(`🔄 Corrigindo ${discipline.name}: ${discipline.icon} → ${iconFixes[discipline.icon]}`);
        
        const { error: updateError } = await supabase
          .from('disciplines')
          .update({ icon: iconFixes[discipline.icon] })
          .eq('id', discipline.id);

        if (updateError) {
          console.error(`❌ Erro ao atualizar ${discipline.name}:`, updateError);
        } else {
          console.log(`✅ ${discipline.name} atualizada`);
        }
      }
    }

    console.log('🎉 Correção de ícones concluída!');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

fixDisciplineIcons();

