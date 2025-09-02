import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadFile } from '../lib/supabase';

const ImageUpload = ({ onImageUploaded, currentImage, className = "" }) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    // Verificar tamanho (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Arquivo muito grande. Máximo 10MB.');
      return;
    }

    setUploading(true);
    try {
      console.log('🖼️ Fazendo upload de imagem...');
      const result = await uploadFile(file, 'uploads', 'images');
      console.log('✅ Upload concluído:', result.url);
      onImageUploaded(result.url);
    } catch (error) {
      console.error('❌ Erro no upload:', error);
      alert(`Erro ao fazer upload da imagem: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = () => {
    onImageUploaded(null);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {currentImage ? (
        <div className="relative">
          <img 
            src={currentImage} 
            alt="Imagem carregada" 
            className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
          />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {uploading ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="text-sm text-gray-600">Fazendo upload...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <ImageIcon className="h-12 w-12 text-gray-400" />
              <div>
                <label className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Selecionar Imagem
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

