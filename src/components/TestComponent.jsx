import React from 'react';

const TestComponent = () => {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f0f8ff',
      border: '2px solid #0066cc',
      borderRadius: '10px',
      margin: '20px',
      textAlign: 'center'
    }}>
      <h1 style={{ color: '#0066cc' }}>🎉 PROMD FUNCIONANDO!</h1>
      <p>React está carregando corretamente</p>
      <p>Timestamp: {new Date().toLocaleString()}</p>
      
      <div style={{ marginTop: '20px' }}>
        <h2>🔧 Status dos Componentes:</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginTop: '10px' }}>
          <div style={{ padding: '10px', backgroundColor: '#e8f5e8', borderRadius: '5px' }}>
            ✅ React: OK
          </div>
          <div style={{ padding: '10px', backgroundColor: '#e8f5e8', borderRadius: '5px' }}>
            ✅ JavaScript: OK
          </div>
          <div style={{ padding: '10px', backgroundColor: '#e8f5e8', borderRadius: '5px' }}>
            ✅ CSS: OK
          </div>
          <div style={{ padding: '10px', backgroundColor: '#fff3cd', borderRadius: '5px' }}>
            ⚠️ Supabase: Testando...
          </div>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>🚀 Próximos Passos:</h3>
        <ol style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
          <li>Testar navegação entre páginas</li>
          <li>Verificar carregamento de dados</li>
          <li>Testar flashcards e questões</li>
          <li>Verificar imagens médicas</li>
        </ol>
      </div>
    </div>
  );
};

export default TestComponent;

