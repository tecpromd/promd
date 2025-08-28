import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { uploadFile } from '../../lib/supabase'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { Alert, AlertDescription } from '../ui/alert'
import { X, Upload, File, Image, FileText } from 'lucide-react'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ACCEPTED_TYPES = {
  'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
}

export const FlashcardUpload = ({ onFilesUploaded, maxFiles = 5 }) => {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [error, setError] = useState('')

  const onDrop = useCallback(async (acceptedFiles) => {
    setError('')
    setUploading(true)
    setUploadProgress(0)

    try {
      const totalFiles = acceptedFiles.length
      const uploadedResults = []

      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i]
        
        // Validar tamanho do arquivo
        if (file.size > MAX_FILE_SIZE) {
          throw new Error(`Arquivo ${file.name} é muito grande. Máximo 10MB.`)
        }

        // Upload do arquivo
        const result = await uploadFile(file, 'flashcards', 'uploads')
        
        const fileData = {
          file_name: file.name,
          file_url: result.url,
          file_type: file.type,
          file_size: file.size,
          mime_type: file.type,
          storage_path: result.path
        }

        uploadedResults.push(fileData)
        setUploadProgress(((i + 1) / totalFiles) * 100)
      }

      setUploadedFiles(prev => [...prev, ...uploadedResults])
      onFilesUploaded(uploadedResults)
      
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }, [onFilesUploaded])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: maxFiles - uploadedFiles.length,
    disabled: uploading || uploadedFiles.length >= maxFiles
  })

  const removeFile = (index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index)
    setUploadedFiles(newFiles)
    onFilesUploaded(newFiles)
  }

  const getFileIcon = (mimeType) => {
    if (mimeType.startsWith('image/')) {
      return <Image className="h-4 w-4" />
    } else if (mimeType === 'application/pdf') {
      return <FileText className="h-4 w-4" />
    } else {
      return <File className="h-4 w-4" />
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-4">
      {/* Área de upload */}
      {uploadedFiles.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragActive 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${uploading ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          <input {...getInputProps()} />
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          
          {isDragActive ? (
            <p className="text-blue-600">Solte os arquivos aqui...</p>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Arraste arquivos aqui ou clique para selecionar
              </p>
              <p className="text-xs text-muted-foreground">
                Máximo {maxFiles} arquivos • PNG, JPG, PDF, DOC • Até 10MB cada
              </p>
            </div>
          )}
        </div>
      )}

      {/* Progresso do upload */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Fazendo upload...</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}

      {/* Erro */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Lista de arquivos enviados */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Arquivos enviados:</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getFileIcon(file.mime_type)}
                  <div>
                    <p className="text-sm font-medium">{file.file_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.file_size)}
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Limite de arquivos */}
      {uploadedFiles.length >= maxFiles && (
        <Alert>
          <AlertDescription>
            Limite máximo de {maxFiles} arquivos atingido.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

