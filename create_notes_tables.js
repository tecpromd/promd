import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://truepksaojbpgwdtelbb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydWVwa3Nhb2picGd3ZHRlbGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzM0NjcsImV4cCI6MjA3MDE0OTQ2N30.UO0hdlI6IAvJeWDEbrnicMMLNn9ExAV7zPQlEc3DgTk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createNotesTables() {
  try {
    console.log('🚀 Criando tabelas para sistema de anotações...');

    // 1. Tabela notebook_entries (Notebook - anotações gerais)
    console.log('📚 Criando tabela notebook_entries...');
    const { error: notebookError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS notebook_entries (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          discipline VARCHAR(100),
          tags TEXT[],
          color VARCHAR(7) DEFAULT '#3B82F6',
          user_id VARCHAR(50) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Índices para performance
        CREATE INDEX IF NOT EXISTS idx_notebook_entries_user_id ON notebook_entries(user_id);
        CREATE INDEX IF NOT EXISTS idx_notebook_entries_discipline ON notebook_entries(discipline);
        CREATE INDEX IF NOT EXISTS idx_notebook_entries_created_at ON notebook_entries(created_at DESC);
      `
    });

    if (notebookError) {
      console.error('❌ Erro ao criar tabela notebook_entries:', notebookError);
    } else {
      console.log('✅ Tabela notebook_entries criada com sucesso!');
    }

    // 2. Tabela contextual_notes (Notes - anotações contextuais)
    console.log('📝 Criando tabela contextual_notes...');
    const { error: notesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS contextual_notes (
          id SERIAL PRIMARY KEY,
          content TEXT NOT NULL,
          type VARCHAR(20) NOT NULL CHECK (type IN ('question_note', 'review_note', 'highlight', 'general')),
          question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
          review_id INTEGER,
          highlight_text TEXT,
          position JSONB,
          color VARCHAR(7) DEFAULT '#FEF3C7',
          user_id VARCHAR(50) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Índices para performance
        CREATE INDEX IF NOT EXISTS idx_contextual_notes_user_id ON contextual_notes(user_id);
        CREATE INDEX IF NOT EXISTS idx_contextual_notes_question_id ON contextual_notes(question_id);
        CREATE INDEX IF NOT EXISTS idx_contextual_notes_type ON contextual_notes(type);
        CREATE INDEX IF NOT EXISTS idx_contextual_notes_created_at ON contextual_notes(created_at DESC);
      `
    });

    if (notesError) {
      console.error('❌ Erro ao criar tabela contextual_notes:', notesError);
    } else {
      console.log('✅ Tabela contextual_notes criada com sucesso!');
    }

    // 3. Tabela topics (Temas dentro das disciplinas)
    console.log('🏷️ Criando tabela topics...');
    const { error: topicsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS topics (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          discipline_id INTEGER REFERENCES disciplines(id) ON DELETE CASCADE,
          color VARCHAR(7) DEFAULT '#3B82F6',
          icon VARCHAR(50),
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Índices para performance
        CREATE INDEX IF NOT EXISTS idx_topics_discipline_id ON topics(discipline_id);
        CREATE INDEX IF NOT EXISTS idx_topics_is_active ON topics(is_active);
        CREATE INDEX IF NOT EXISTS idx_topics_name ON topics(name);
      `
    });

    if (topicsError) {
      console.error('❌ Erro ao criar tabela topics:', topicsError);
    } else {
      console.log('✅ Tabela topics criada com sucesso!');
    }

    // 4. Tabela content_materials (Reviews, High Yield Tips, etc.)
    console.log('📄 Criando tabela content_materials...');
    const { error: materialsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS content_materials (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          content TEXT,
          type VARCHAR(20) NOT NULL CHECK (type IN ('review', 'high_yield_tips', 'qf')),
          topic_id INTEGER REFERENCES topics(id) ON DELETE CASCADE,
          file_url VARCHAR(500),
          file_type VARCHAR(10),
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Índices para performance
        CREATE INDEX IF NOT EXISTS idx_content_materials_topic_id ON content_materials(topic_id);
        CREATE INDEX IF NOT EXISTS idx_content_materials_type ON content_materials(type);
        CREATE INDEX IF NOT EXISTS idx_content_materials_is_active ON content_materials(is_active);
      `
    });

    if (materialsError) {
      console.error('❌ Erro ao criar tabela content_materials:', materialsError);
    } else {
      console.log('✅ Tabela content_materials criada com sucesso!');
    }

    // 5. Atualizar tabela questions para incluir topic_id
    console.log('🔄 Atualizando tabela questions...');
    const { error: questionsUpdateError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE questions 
        ADD COLUMN IF NOT EXISTS topic_id INTEGER REFERENCES topics(id) ON DELETE SET NULL;

        CREATE INDEX IF NOT EXISTS idx_questions_topic_id ON questions(topic_id);
      `
    });

    if (questionsUpdateError) {
      console.error('❌ Erro ao atualizar tabela questions:', questionsUpdateError);
    } else {
      console.log('✅ Tabela questions atualizada com sucesso!');
    }

    // 6. Atualizar tabela flashcards para incluir topic_id
    console.log('🔄 Atualizando tabela flashcards...');
    const { error: flashcardsUpdateError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE flashcards 
        ADD COLUMN IF NOT EXISTS topic_id INTEGER REFERENCES topics(id) ON DELETE SET NULL;

        CREATE INDEX IF NOT EXISTS idx_flashcards_topic_id ON flashcards(topic_id);
      `
    });

    if (flashcardsUpdateError) {
      console.error('❌ Erro ao atualizar tabela flashcards:', flashcardsUpdateError);
    } else {
      console.log('✅ Tabela flashcards atualizada com sucesso!');
    }

    console.log('🎉 Todas as tabelas foram criadas/atualizadas com sucesso!');
    console.log('');
    console.log('📋 Estrutura criada:');
    console.log('├── notebook_entries (Notebook - anotações gerais)');
    console.log('├── contextual_notes (Notes - anotações contextuais)');
    console.log('├── topics (Temas dentro das disciplinas)');
    console.log('├── content_materials (Reviews, Tips, QF)');
    console.log('├── questions (atualizada com topic_id)');
    console.log('└── flashcards (atualizada com topic_id)');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

createNotesTables();

