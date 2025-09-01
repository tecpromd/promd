import React, { useState } from 'react';

const QuestionImage = ({ images, className = "" }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!images || images.length === 0) {
    return null;
  }

  const currentImage = images[selectedImage];

  return (
    <div className={`question-image-container ${className}`}>
      {/* Imagem Principal */}
      <div className="relative bg-gray-50 rounded-lg overflow-hidden border">
        <img
          src={currentImage.url}
          alt={currentImage.alt}
          className="w-full h-auto max-h-64 object-contain cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setIsModalOpen(true)}
          style={{ imageRendering: 'high-quality' }}
        />
        
        {/* Overlay com informações */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <p className="text-white text-sm font-medium">
            {currentImage.caption}
          </p>
          {images.length > 1 && (
            <p className="text-white/80 text-xs">
              {selectedImage + 1} de {images.length} imagens
            </p>
          )}
        </div>

        {/* Botão de expandir */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-colors"
          title="Expandir imagem"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </button>
      </div>

      {/* Thumbnails para múltiplas imagens */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all ${
                selectedImage === index 
                  ? 'border-blue-500 ring-2 ring-blue-200' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover"
                style={{ imageRendering: 'high-quality' }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Modal para visualização ampliada com alta qualidade */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            {/* Botão fechar */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Imagem ampliada com alta qualidade */}
            <div className="relative max-w-full max-h-full flex items-center justify-center overflow-auto">
              <img
                src={currentImage.url}
                alt={currentImage.alt}
                className="modal-image-zoom max-w-none transition-transform duration-200 ease-out"
                style={{ 
                  imageRendering: 'high-quality',
                  minWidth: '50vw',
                  minHeight: '50vh',
                  cursor: 'grab'
                }}
                draggable={false}
                onMouseDown={(e) => {
                  e.preventDefault();
                  const img = e.target;
                  let isDragging = false;
                  let startX = e.clientX;
                  let startY = e.clientY;
                  let scrollLeft = img.parentElement.scrollLeft;
                  let scrollTop = img.parentElement.scrollTop;

                  const handleMouseMove = (e) => {
                    if (!isDragging) return;
                    e.preventDefault();
                    const x = e.clientX - startX;
                    const y = e.clientY - startY;
                    img.parentElement.scrollLeft = scrollLeft - x;
                    img.parentElement.scrollTop = scrollTop - y;
                  };

                  const handleMouseUp = () => {
                    isDragging = false;
                    img.style.cursor = 'grab';
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };

                  isDragging = true;
                  img.style.cursor = 'grabbing';
                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
              />
            </div>

            {/* Informações da imagem */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-white font-semibold text-xl mb-2">
                  {currentImage.caption}
                </h3>
                <p className="text-white/80 text-base">
                  {currentImage.alt}
                </p>
                {images.length > 1 && (
                  <p className="text-white/60 text-sm mt-2">
                    Imagem {selectedImage + 1} de {images.length}
                  </p>
                )}
              </div>
            </div>

            {/* Navegação para múltiplas imagens */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : images.length - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setSelectedImage(prev => prev < images.length - 1 ? prev + 1 : 0)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Controles de zoom */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <button
                onClick={() => {
                  const img = document.querySelector('.modal-image-zoom');
                  if (img) {
                    const currentScale = img.style.transform.match(/scale\(([^)]+)\)/);
                    const scale = currentScale ? parseFloat(currentScale[1]) : 1;
                    img.style.transform = `scale(${Math.min(scale * 1.5, 10)})`;
                    img.style.cursor = 'grab';
                  }
                }}
                className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                title="Zoom In (até 10x)"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              <button
                onClick={() => {
                  const img = document.querySelector('.modal-image-zoom');
                  if (img) {
                    const currentScale = img.style.transform.match(/scale\(([^)]+)\)/);
                    const scale = currentScale ? parseFloat(currentScale[1]) : 1;
                    img.style.transform = `scale(${Math.max(scale / 1.5, 0.3)})`;
                  }
                }}
                className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                title="Zoom Out"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                </svg>
              </button>
              <button
                onClick={() => {
                  const img = document.querySelector('.modal-image-zoom');
                  if (img) {
                    img.style.transform = 'scale(1)';
                  }
                }}
                className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                title="Reset Zoom"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionImage;

