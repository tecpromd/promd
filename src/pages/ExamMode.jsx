import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Timer, ArrowLeft, ArrowRight, Flag, CheckCircle2 } from 'lucide-react'

export function ExamMode() {
  const navigate = useNavigate()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(3600) // 1 hora
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set())
  const [answers, setAnswers] = useState({})

  // Dados de exemplo das questões
  const questions = [
    {
      id: 1,
      question: "Paciente de 65 anos apresenta dor torácica súbita e dispneia. O ECG mostra elevação do segmento ST em V1-V4. Qual é o diagnóstico mais provável?",
      options: [
        "Infarto agudo do miocárdio anterior",
        "Embolia pulmonar",
        "Pneumotórax espontâneo",
        "Pericardite aguda",
        "Dissecção aórtica"
      ],
      correct: 0,
      explanation: "A elevação do segmento ST em V1-V4 é característica de infarto agudo do miocárdio da parede anterior."
    },
    {
      id: 2,
      question: "Qual é o tratamento de primeira linha para hipertensão arterial em paciente diabético?",
      options: [
        "Diuréticos tiazídicos",
        "Inibidores da ECA",
        "Bloqueadores dos canais de cálcio",
        "Beta-bloqueadores",
        "Antagonistas dos receptores da angiotensina"
      ],
      correct: 1,
      explanation: "Inibidores da ECA são primeira linha em diabéticos devido ao efeito nefroprotetor."
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Tempo esgotado
          handleFinishExam()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (optionIndex) => {
    setSelectedAnswer(optionIndex)
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: optionIndex
    }))
  }

  const handleFlagQuestion = () => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(currentQuestion)) {
        newSet.delete(currentQuestion)
      } else {
        newSet.add(currentQuestion)
      }
      return newSet
    })
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setSelectedAnswer(answers[currentQuestion + 1] || null)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
      setSelectedAnswer(answers[currentQuestion - 1] || null)
    }
  }

  const handleFinishExam = () => {
    // Aqui você salvaria os resultados no banco
    navigate('/study', { 
      state: { 
        examResults: {
          answers,
          totalQuestions: questions.length,
          timeSpent: 3600 - timeRemaining
        }
      }
    })
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const answeredQuestions = Object.keys(answers).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-slate-900">
      {/* Header da Prova */}
      <div className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/study')}
              className="text-white hover:bg-blue-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Sair da Prova
            </Button>
            <h1 className="text-xl font-bold">Simulado de Cardiologia</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
            </div>
            <Badge variant="secondary" className="bg-white text-blue-600">
              {currentQuestion + 1} de {questions.length}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Painel de Navegação */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Navegação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progresso</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Respondidas:</span>
                      <span className="font-medium">{answeredQuestions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Marcadas:</span>
                      <span className="font-medium">{flaggedQuestions.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Restantes:</span>
                      <span className="font-medium">{questions.length - answeredQuestions}</span>
                    </div>
                  </div>

                  {/* Grid de questões */}
                  <div className="grid grid-cols-5 gap-1">
                    {questions.map((_, index) => (
                      <Button
                        key={index}
                        variant={currentQuestion === index ? "default" : "outline"}
                        size="sm"
                        className={`h-8 w-8 p-0 text-xs relative ${
                          answers[index] !== undefined ? 'bg-green-100 border-green-300' : ''
                        } ${
                          flaggedQuestions.has(index) ? 'bg-yellow-100 border-yellow-300' : ''
                        }`}
                        onClick={() => {
                          setCurrentQuestion(index)
                          setSelectedAnswer(answers[index] || null)
                        }}
                      >
                        {index + 1}
                        {flaggedQuestions.has(index) && (
                          <Flag className="h-2 w-2 absolute -top-1 -right-1 text-yellow-600" />
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Área da Questão */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Questão {currentQuestion + 1}</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleFlagQuestion}
                    className={flaggedQuestions.has(currentQuestion) ? 'bg-yellow-100' : ''}
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    {flaggedQuestions.has(currentQuestion) ? 'Desmarcada' : 'Marcar'}
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="prose max-w-none">
                  <p className="text-lg leading-relaxed">
                    {questions[currentQuestion]?.question}
                  </p>
                </div>

                <div className="space-y-3">
                  {questions[currentQuestion]?.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={selectedAnswer === index ? "default" : "outline"}
                      className={`w-full justify-start text-left h-auto p-4 ${
                        selectedAnswer === index ? 'bg-blue-600 text-white' : ''
                      }`}
                      onClick={() => handleAnswerSelect(index)}
                    >
                      <span className="font-medium mr-3">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span>{option}</span>
                    </Button>
                  ))}
                </div>

                {/* Navegação entre questões */}
                <div className="flex justify-between pt-6">
                  <Button
                    variant="outline"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestion === 0}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Anterior
                  </Button>

                  <div className="flex gap-2">
                    {currentQuestion === questions.length - 1 ? (
                      <Button onClick={handleFinishExam} className="bg-green-600 hover:bg-green-700">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Finalizar Prova
                      </Button>
                    ) : (
                      <Button onClick={handleNextQuestion}>
                        Próxima
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

