import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, BookOpen, Target, Users, Settings, Play } from 'lucide-react';
import { useDisciplines } from '../hooks/useDisciplines';

// Material-UI imports
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  Slider,
  TextField,
  Box,
  Grid,
  Paper,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';

const TestConfiguration = () => {
  const navigate = useNavigate();
  const { disciplines, loading: disciplinesLoading } = useDisciplines();
  
  // Estados para configuração do teste
  const [testMode, setTestMode] = useState('tutor');
  const [testModel, setTestModel] = useState('promd');
  const [questionTypes, setQuestionTypes] = useState(['ineditas']);
  const [selectedDisciplines, setSelectedDisciplines] = useState([]);
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState(['all']);
  const [questionCount, setQuestionCount] = useState(20);
  const [questionTypeCounts, setQuestionTypeCounts] = useState({
    correct: 0,
    incorrect: 0,
    new: 0,
    marked: 0,
    all: 0
  });

  const testModes = [
    { id: 'tutor', label: 'Modo Tutor', description: 'Sem limite de tempo, com feedback imediato', icon: BookOpen },
    { id: 'cronometrado', label: 'Modo Cronometrado', description: '1,5 min por questão', icon: Clock }
  ];

  const testModels = [
    { id: 'promd', label: 'ProMD Simulado', description: 'Questões automáticas baseadas no seu progresso' },
    { id: 'nbme', label: 'Estilo NBME', description: 'Formato similar ao exame oficial' },
    { id: 'personalizado', label: 'Personalizado', description: 'Escolha questões específicas por ID' }
  ];

  const questionTypeOptions = [
    { id: 'corretas', label: 'Respondidas Corretamente', count: questionTypeCounts.correct },
    { id: 'incorretas', label: 'Respondidas Incorretamente', count: questionTypeCounts.incorrect },
    { id: 'ineditas', label: 'Questões Inéditas', count: questionTypeCounts.new },
    { id: 'marcadas', label: 'Questões Marcadas', count: questionTypeCounts.marked },
    { id: 'todas', label: 'Todas as Questões', count: questionTypeCounts.all }
  ];

  // Calcular contagens de tipos de questões
  useEffect(() => {
    if (selectedDisciplines.length > 0 && disciplines.length > 0) {
      const selectedDisciplineData = disciplines.filter(d => selectedDisciplines.includes(d.id));
      const totalQuestions = selectedDisciplineData.reduce((sum, d) => sum + (d.questionCount || 0), 0);
      
      setQuestionTypeCounts({
        correct: Math.floor(totalQuestions * 0.3),
        incorrect: Math.floor(totalQuestions * 0.2),
        new: Math.floor(totalQuestions * 0.4),
        marked: Math.floor(totalQuestions * 0.1),
        all: totalQuestions
      });
    } else {
      setQuestionTypeCounts({
        correct: 0,
        incorrect: 0,
        new: 0,
        marked: 0,
        all: 0
      });
    }
  }, [selectedDisciplines, disciplines]);

  const handleDisciplineToggle = (disciplineId) => {
    setSelectedDisciplines(prev => 
      prev.includes(disciplineId) 
        ? prev.filter(id => id !== disciplineId)
        : [...prev, disciplineId]
    );
  };

  const handleSelectAllDisciplines = () => {
    if (selectedDisciplines.length === disciplines.length) {
      setSelectedDisciplines([]);
    } else {
      setSelectedDisciplines(disciplines.map(d => d.id));
    }
  };

  const calculateEstimatedTime = () => {
    if (testMode === 'cronometrado') {
      const minutes = Math.ceil(questionCount * 1.5);
      return `${minutes} min`;
    }
    return 'Sem limite';
  };

  const canStartTest = selectedDisciplines.length > 0 && selectedQuestionTypes.length > 0;

  const handleStartTest = () => {
    if (canStartTest) {
      const config = {
        mode: testMode,
        model: testModel,
        disciplines: selectedDisciplines,
        questionTypes: selectedQuestionTypes,
        questionCount,
        estimatedTime: calculateEstimatedTime()
      };
      
      localStorage.setItem('testConfig', JSON.stringify(config));
      navigate('/exam');
    }
  };

  return (
    <Box className="p-4 max-w-7xl mx-auto">
      <Typography variant="h4" className="mb-4 font-bold text-slate-800 dark:text-slate-200">
        Configurar Teste
      </Typography>
      <Typography variant="body2" className="mb-6 text-slate-600 dark:text-slate-400">
        Configure seu teste personalizado escolhendo modo, disciplinas e tipos de questões
      </Typography>

      <Grid container spacing={3}>
        {/* Coluna Principal */}
        <Grid item xs={12} lg={8}>
          {/* 1. Modo da Prova */}
          <Card className="mb-4 shadow-sm">
            <CardHeader className="pb-2">
              <Typography variant="h6" className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                1. Modo da Prova
              </Typography>
            </CardHeader>
            <CardContent className="pt-0">
              <FormControl component="fieldset">
                <RadioGroup
                  value={testMode}
                  onChange={(e) => setTestMode(e.target.value)}
                  className="gap-2"
                >
                  {testModes.map((mode) => (
                    <Paper key={mode.id} className="p-3 border">
                      <FormControlLabel
                        value={mode.id}
                        control={<Radio size="small" />}
                        label={
                          <Box>
                            <Typography variant="subtitle2" className="font-medium">
                              {mode.label}
                            </Typography>
                            <Typography variant="caption" className="text-slate-600">
                              {mode.description}
                            </Typography>
                          </Box>
                        }
                      />
                    </Paper>
                  ))}
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>

          {/* 2. Modelo da Prova */}
          <Card className="mb-4 shadow-sm">
            <CardHeader className="pb-2">
              <Typography variant="h6" className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                2. Modelo da Prova
              </Typography>
            </CardHeader>
            <CardContent className="pt-0">
              <FormControl component="fieldset">
                <RadioGroup
                  value={testModel}
                  onChange={(e) => setTestModel(e.target.value)}
                  className="gap-2"
                >
                  {testModels.map((model) => (
                    <Paper key={model.id} className="p-3 border">
                      <FormControlLabel
                        value={model.id}
                        control={<Radio size="small" />}
                        label={
                          <Box>
                            <Typography variant="subtitle2" className="font-medium">
                              {model.label}
                            </Typography>
                            <Typography variant="caption" className="text-slate-600">
                              {model.description}
                            </Typography>
                          </Box>
                        }
                      />
                    </Paper>
                  ))}
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>

          {/* 3. Tipos de Questões */}
          <Card className="mb-4 shadow-sm">
            <CardHeader className="pb-2">
              <Typography variant="h6" className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                3. Tipos de Questões
              </Typography>
            </CardHeader>
            <CardContent className="pt-0">
              <Grid container spacing={2}>
                {questionTypeOptions.map((option) => (
                  <Grid item xs={12} sm={6} key={option.id}>
                    <Paper className="p-3 border">
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            checked={selectedQuestionTypes.includes(option.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedQuestionTypes(prev => [...prev, option.id]);
                              } else {
                                setSelectedQuestionTypes(prev => prev.filter(id => id !== option.id));
                              }
                            }}
                          />
                        }
                        label={
                          <Box className="flex justify-between items-center w-full">
                            <Typography variant="body2">{option.label}</Typography>
                            <Chip label={`${option.count} questões`} size="small" variant="outlined" />
                          </Box>
                        }
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* 4. Disciplinas */}
          <Card className="mb-4 shadow-sm">
            <CardHeader className="pb-2">
              <Box className="flex justify-between items-center">
                <Typography variant="h6" className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  4. Disciplinas
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleSelectAllDisciplines}
                  className="text-xs"
                >
                  {selectedDisciplines.length === disciplines.length ? 'Desmarcar Todas' : 'Selecionar Todas'}
                </Button>
              </Box>
              <Typography variant="caption" className="text-slate-600">
                {selectedDisciplines.length} de {disciplines.length} selecionadas
              </Typography>
            </CardHeader>
            <CardContent className="pt-0">
              {disciplinesLoading ? (
                <Typography variant="body2">Carregando disciplinas...</Typography>
              ) : (
                <Grid container spacing={2}>
                  {disciplines.map((discipline) => (
                    <Grid item xs={12} sm={6} md={4} key={discipline.id}>
                      <Paper className="p-2 border">
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              checked={selectedDisciplines.includes(discipline.id)}
                              onChange={() => handleDisciplineToggle(discipline.id)}
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body2" className="font-medium">
                                {discipline.name}
                              </Typography>
                              <Typography variant="caption" className="text-slate-600">
                                {discipline.questionCount || 0} questões
                              </Typography>
                            </Box>
                          }
                        />
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Coluna Lateral - Configurações */}
        <Grid item xs={12} lg={4}>
          <Card className="sticky top-4 shadow-sm">
            <CardHeader className="pb-2">
              <Typography variant="h6">5. Configurações Gerais</Typography>
            </CardHeader>
            <CardContent>
              {/* Número de Questões */}
              <Box className="mb-4">
                <Typography variant="subtitle2" className="mb-2">
                  Número de Questões (máx. 40)
                </Typography>
                <TextField
                  type="number"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Math.min(40, Math.max(1, parseInt(e.target.value) || 1)))}
                  placeholder="Digite o número de questões"
                  size="small"
                  fullWidth
                  inputProps={{ min: 1, max: 40 }}
                  className="mb-2"
                />
                <Slider
                  value={questionCount}
                  onChange={(e, value) => setQuestionCount(value)}
                  min={1}
                  max={40}
                  size="small"
                  valueLabelDisplay="auto"
                />
                <Box className="flex justify-between text-xs text-slate-600 mt-1">
                  <span>1</span>
                  <span>{questionCount}</span>
                  <span>40</span>
                </Box>
              </Box>

              <Divider className="my-3" />

              {/* Informações do Teste */}
              <Box className="space-y-2 text-sm">
                <Box className="flex justify-between">
                  <span>Questões por bloco:</span>
                  <span className="font-medium">{questionCount}/40</span>
                </Box>
                <Box className="flex justify-between">
                  <span>Tempo estimado:</span>
                  <span className="font-medium">{calculateEstimatedTime()}</span>
                </Box>
                <Box className="flex justify-between">
                  <span>Número de blocos:</span>
                  <span className="font-medium">01/07</span>
                </Box>
              </Box>

              <Divider className="my-3" />

              {/* Resumo da Configuração */}
              <Box className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                <Typography variant="subtitle2" className="mb-2 font-medium">
                  Resumo da Configuração
                </Typography>
                <Box className="space-y-1 text-sm">
                  <Box className="flex items-center gap-2">
                    <span>📚</span>
                    <span className="font-bold">{questionCount}</span>
                    <span>questões</span>
                  </Box>
                  <Box className="flex items-center gap-2">
                    <span>⏱️</span>
                    <span className="font-bold">{calculateEstimatedTime()}</span>
                  </Box>
                  <Box className="flex items-center gap-2">
                    <span>🎯</span>
                    <span className="font-bold">{selectedDisciplines.length}</span>
                    <span>disciplinas</span>
                  </Box>
                  <Box className="flex items-center gap-2">
                    <span>📋</span>
                    <span className="font-bold">{selectedQuestionTypes.length}</span>
                    <span>tipos selecionados</span>
                  </Box>
                </Box>
              </Box>

              {/* Botão Iniciar Teste */}
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleStartTest}
                disabled={!canStartTest}
                className="mt-4"
                startIcon={<Play className="h-4 w-4" />}
              >
                Iniciar Teste
              </Button>

              {!canStartTest && (
                <Typography variant="caption" className="text-red-500 text-center block mt-2">
                  Selecione pelo menos uma disciplina e um tipo de questão
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TestConfiguration;

