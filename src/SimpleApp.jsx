import React from 'react';

const SimpleApp = () => {
  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: 'red', fontSize: '32px' }}>🚨 TESTE DE EMERGÊNCIA PROMD</h1>
      <p style={{ fontSize: '18px', color: 'blue' }}>Se você está vendo isso, o React está funcionando!</p>
      
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        border: '2px solid black',
        marginTop: '20px'
      }}>
        <h2>Status dos Componentes:</h2>
        <ul>
          <li>✅ HTML: Carregando</li>
          <li>✅ JavaScript: Executando</li>
          <li>✅ React: Renderizando</li>
          <li>✅ CSS Inline: Funcionando</li>
        </ul>
      </div>

      <div style={{
        backgroundColor: 'yellow',
        padding: '15px',
        marginTop: '20px',
        border: '1px solid orange'
      }}>
        <h3>Próximos Testes:</h3>
        <p>1. Testar CSS externo</p>
        <p>2. Testar componentes complexos</p>
        <p>3. Testar roteamento</p>
      </div>

      <button 
        onClick={() => alert('JavaScript funcionando!')}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: 'green',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          marginTop: '20px',
          cursor: 'pointer'
        }}
      >
        Testar JavaScript
      </button>
    </div>
  );
};

export default SimpleApp;

