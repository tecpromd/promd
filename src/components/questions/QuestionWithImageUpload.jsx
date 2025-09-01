import React, { useState } from 'react';
import QuestionImage from './QuestionImage';
import ImageUpload from '../ImageUpload';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Upload, Image as ImageIcon } from 'lucide-react';

const QuestionWithImageUpload = ({ 
  question, 
  selectedAnswer, 
  onAnswerSelect, 
  showResult = false,
  onImageUpdate,
  showImageUpload = false 
}) => {
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUploaded = async (imageUrl) => {
    if (onImageUpdate) {
      setUploadingImage(true);
      try {
        await onImageUpdate(question.id, imageUrl);
      } catch (error) {
        console.error('Erro ao atualizar imagem:', error);
        alert('Erro ao atualizar imagem. Tente novamente.');
      } finally {
        setUploadingImage(false);
      }
    }
  };

  // Preparar imagens para o componente QuestionImage
  const images = question.image ? [{
    url: question.image,
    alt: question.title || 'Imagem da questão',
    caption: question.title || 'Imagem médica'
  }] : [];

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {/* Título da questão */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {question.title || `Questão ${question.id?.slice(0, 8)}`}
          </h3>
        </div>

        {/* Área de imagem */}
        <div className="mb-6">
          {images.length > 0 ? (
            <QuestionImage 
              images={images}
              className="mb-4"
            />
          ) : showImageUpload ? (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <ImageIcon className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Adicionar imagem à questão</span>
              </div>
              <ImageUpload 
                onImageUploaded={handleImageUploaded}
                currentImage={question.image}
                className="max-h-48"
              />
              {uploadingImage && (
                <div className="mt-2 text-sm text-blue-600">
                  Atualizando imagem...
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Nenhuma imagem disponível</p>
            </div>
          )}
        </div>

        {/* Texto da questão */}
        <div className="mb-6">
          <p className="text-gray-800 leading-relaxed">
            {question.question || 'Texto da questão não disponível'}
          </p>
        </div>

        {/* Alternativas */}
        <div className="space-y-3">
          {question.options?.map((option) => {
            const isSelected = selectedAnswer === option.letter;
            const isCorrect = option.isCorrect;
            
            let buttonClass = "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ";
            
            if (showResult) {
              if (isCorrect) {
                buttonClass += "border-green-500 bg-green-50 text-green-800";
              } else if (isSelected && !isCorrect) {
                buttonClass += "border-red-500 bg-red-50 text-red-800";
              } else {
                buttonClass += "border-gray-200 bg-gray-50 text-gray-600";
              }
            } else {
              if (isSelected) {
                buttonClass += "border-blue-500 bg-blue-50 text-blue-800";
              } else {
                buttonClass += "border-gray-200 hover:border-gray-300 hover:bg-gray-50";
              }
            }

            return (
              <button
                key={option.id || option.letter}
                onClick={() => !showResult && onAnswerSelect && onAnswerSelect(option.letter)}
                disabled={showResult}
                className={buttonClass}
              >
                <div className="flex items-start gap-3">
                  <span className="font-semibold text-lg">
                    {option.letter})
                  </span>
                  <span className="flex-1">
                    {option.text}
                  </span>
                  {showResult && isCorrect && (
                    <span className="text-green-600 font-semibold">✓</span>
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <span className="text-red-600 font-semibold">✗</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explicações (mostrar apenas quando showResult for true) */}
        {showResult && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">Explicações:</h4>
            <div className="space-y-2">
              {question.options?.map((option) => (
                option.explanation && (
                  <div key={option.id || option.letter} className="text-sm">
                    <span className="font-medium text-blue-700">
                      {option.letter}) 
                    </span>
                    <span className="text-blue-600">
                      {option.explanation}
                    </span>
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionWithImageUpload;

