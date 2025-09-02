#!/bin/bash

# Script para fazer upload dos arquivos via GitHub web interface
# Como a autenticação por senha não funciona mais, vamos usar a interface web

echo "🚀 PREPARANDO ARQUIVOS PARA UPLOAD NO GITHUB..."

# Criar arquivo ZIP com todas as alterações
cd /home/ubuntu/promd-repo
zip -r promd-cms-update.zip . -x "*.git*" "node_modules/*" "dist/*" "*.zip"

echo "✅ Arquivo ZIP criado: promd-cms-update.zip"
echo ""
echo "📋 INSTRUÇÕES PARA UPLOAD MANUAL:"
echo "1. Acesse: https://github.com/tecpromd/promd"
echo "2. Clique em 'Add file' > 'Upload files'"
echo "3. Faça upload do arquivo: promd-cms-update.zip"
echo "4. Ou copie os arquivos individuais:"
echo ""
echo "🔧 PRINCIPAIS ARQUIVOS ALTERADOS:"
echo "- src/App.jsx (rotas do CMS)"
echo "- src/components/Layout.jsx (botão CMS no menu)"
echo "- src/pages/admin/AdminDashboard.jsx (dashboard CMS)"
echo "- src/pages/admin/QuestionManager.jsx (gerenciar questões)"
echo "- src/pages/admin/FlashcardManager.jsx (gerenciar flashcards)"
echo "- src/pages/TestConfiguration.jsx (configuração de testes)"
echo "- src/pages/TestExecution.jsx (execução de testes)"
echo ""
echo "💡 COMMIT MESSAGE SUGERIDA:"
echo "feat: Implementar CMS completo com interface melhorada"
echo ""
echo "🎯 APÓS O UPLOAD, O VERCEL FARÁ DEPLOY AUTOMÁTICO!"

