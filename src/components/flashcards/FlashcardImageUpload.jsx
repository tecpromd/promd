import React, { useState, useRef } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

export const FlashcardImageUpload = ({ onImageSelect, currentImage, onImageRemove }) => {
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        onImageSelect(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const onButtonClick = () => {
    fileInputRef.current?.click()
  }

  if (currentImage) {
    return (
      <Card className="relative">
        <CardContent className="p-4">
          <div className="relative">
            <img 
              src={currentImage} 
              alt="Flashcard" 
              className="w-full h-48 object-cover rounded-lg"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={onImageRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card 
      className={`border-2 border-dashed transition-colors ${
        dragActive 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
          : 'border-gray-300 dark:border-gray-600'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <CardContent className="p-8">
        <div className="text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Arraste uma imagem aqui ou
            </p>
            <Button 
              variant="outline" 
              onClick={onButtonClick}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Selecionar Imagem
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            PNG, JPG, GIF até 10MB
          </p>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleChange}
        />
      </CardContent>
    </Card>
  )
}

