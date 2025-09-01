import React from 'react';

const TestPage = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: 'white', color: 'black' }}>
      <h1>🔍 TESTE DE FUNCIONAMENTO</h1>
      <p>Se você está vendo esta página, o React está funcionando!</p>
      <div style={{ border: '2px solid green', padding: '10px', margin: '10px 0' }}>
        <h2>✅ Status dos Componentes:</h2>
        <ul>
          <li>✅ React carregando</li>
          <li>✅ Roteamento funcionando</li>
          <li>✅ CSS aplicado</li>
        </ul>
      </div>
      <button 
        onClick={() => alert('JavaScript funcionando!')}
        style={{ padding: '10px 20px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        Testar JavaScript
      </button>
    </div>
  );
};

export default TestPage;

