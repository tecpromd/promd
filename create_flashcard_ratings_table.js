const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://hnqnqgqwjgqjqgqwjgqj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhucW5xZ3F3amdxanFncXdqZ3FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUzMDI0MDAsImV4cCI6MjA0MDg3ODQwMH0.abc123def456ghi789jkl012mno345pqr678stu901vwx234yz';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createFlashcardRatingsTable() {
  try {
    console.log('Criando tabela flashcard_ratings...');

    // SQL para criar a tabela
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS flashcard_ratings (
        id SERIAL PRIMARY KEY,
        flashcard_id INTEGER NOT NULL,
        difficulty_level INTEGER NOT NULL CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(flashcard_id)
      );

      -- Criar índice para melhor performance
      CREATE INDEX IF NOT EXISTS idx_flashcard_ratings_flashcard_id ON flashcard_ratings(flashcard_id);

      -- Comentários para documentação
      COMMENT ON TABLE flashcard_ratings IS 'Armazena as avaliações de dificuldade dos flashcards pelos usuários';
      COMMENT ON COLUMN flashcard_ratings.flashcard_id IS 'ID do flashcard avaliado';
      COMMENT ON COLUMN flashcard_ratings.difficulty_level IS 'Nível de dificuldade de 1 (muito difícil) a 5 (muito fácil)';
    `;

    const { data, error } = await supabase.rpc('exec_sql', { sql: createTableSQL });

    if (error) {
      console.error('Erro ao criar tabela:', error);
      return;
    }

    console.log('✅ Tabela flashcard_ratings criada com sucesso!');

    // Verificar se a tabela foi criada
    const { data: tables, error: checkError } = await supabase
      .from('flashcard_ratings')
      .select('*')
      .limit(1);

    if (checkError) {
      console.log('⚠️  Tabela criada, mas pode precisar de configuração adicional no Supabase Dashboard');
      console.log('Erro de verificação:', checkError.message);
    } else {
      console.log('✅ Tabela verificada e funcionando corretamente!');
    }

  } catch (error) {
    console.error('Erro geral:', error);
  }
}

// Executar o script
createFlashcardRatingsTable();

