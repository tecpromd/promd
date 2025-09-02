import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useDisciplines = () => {
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lista oficial de disciplinas conforme PDF
  const officialDisciplines = [
    { id: 1, name: 'Behavioral Science', name_pt: 'Ciências Comportamentais' },
    { id: 2, name: 'Decision-Making Capacity and Personal Skills', name_pt: 'Capacidade de Tomada de Decisão e Habilidades Pessoais' },
    { id: 3, name: 'Ethics Principles & Jurisprudence', name_pt: 'Princípios Éticos e Jurisprudência' },
    { id: 4, name: 'Healthcare Delivery System', name_pt: 'Sistema de Prestação de Cuidados de Saúde' },
    { id: 5, name: 'Informed Consent', name_pt: 'Consentimento Informado' },
    { id: 6, name: 'Public Health', name_pt: 'Saúde Pública' },
    { id: 7, name: 'Quality and Patient Safety', name_pt: 'Qualidade e Segurança do Paciente' },
    { id: 8, name: 'Biochemistry', name_pt: 'Bioquímica' },
    { id: 9, name: 'Biostatistics & Epidemiology', name_pt: 'Bioestatística e Epidemiologia' },
    { id: 10, name: 'Cardiology', name_pt: 'Cardiologia' },
    { id: 11, name: 'Dermatology', name_pt: 'Dermatologia' },
    { id: 12, name: 'Endocrinology', name_pt: 'Endocrinologia' },
    { id: 13, name: 'Gastroenterology', name_pt: 'Gastroenterologia' },
    { id: 14, name: 'Genetics', name_pt: 'Genética' },
    { id: 15, name: 'Hematology', name_pt: 'Hematologia' },
    { id: 16, name: 'Immunology', name_pt: 'Imunologia' },
    { id: 17, name: 'Infectious Disease', name_pt: 'Doenças Infecciosas' },
    { id: 18, name: 'Anatomy, Musculoskeletal & Rheumatology', name_pt: 'Anatomia, Musculoesquelético e Reumatologia' },
    { id: 19, name: 'Neurology', name_pt: 'Neurologia' },
    { id: 20, name: 'Pathology', name_pt: 'Patologia' },
    { id: 21, name: 'Pharmacology', name_pt: 'Farmacologia' },
    { id: 22, name: 'Psychiatry', name_pt: 'Psiquiatria' },
    { id: 23, name: 'Pulmonary', name_pt: 'Pneumologia' },
    { id: 24, name: 'Renal', name_pt: 'Nefrologia' },
    { id: 25, name: 'Female Genital, Reproductive & Breast', name_pt: 'Genital Feminino, Reprodutivo e Mama' },
    { id: 26, name: 'Male Pathology', name_pt: 'Patologia Masculina' }
  ];

  const fetchDisciplines = async () => {
    try {
      setLoading(true);
      
      // Buscar contagem de questões por disciplina
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('tags')
        .eq('is_active', true);

      if (questionsError) {
        console.error('Erro ao buscar questões:', questionsError);
        setError(questionsError.message);
        return;
      }

      // Buscar contagem de flashcards por disciplina
      const { data: flashcardsData, error: flashcardsError } = await supabase
        .from('flashcards')
        .select('tags');

      if (flashcardsError) {
        console.error('Erro ao buscar flashcards:', flashcardsError);
      }

      // Contar questões e flashcards por disciplina
      const disciplineCounts = {};
      
      // Contar questões
      questionsData?.forEach(question => {
        if (question.tags && Array.isArray(question.tags)) {
          question.tags.forEach(tag => {
            const discipline = officialDisciplines.find(d => 
              d.name.toLowerCase().includes(tag.toLowerCase()) ||
              d.name_pt.toLowerCase().includes(tag.toLowerCase()) ||
              tag.toLowerCase().includes(d.name.toLowerCase())
            );
            
            if (discipline) {
              if (!disciplineCounts[discipline.id]) {
                disciplineCounts[discipline.id] = { questions: 0, flashcards: 0 };
              }
              disciplineCounts[discipline.id].questions++;
            }
          });
        }
      });

      // Contar flashcards
      flashcardsData?.forEach(flashcard => {
        if (flashcard.tags && Array.isArray(flashcard.tags)) {
          flashcard.tags.forEach(tag => {
            const discipline = officialDisciplines.find(d => 
              d.name.toLowerCase().includes(tag.toLowerCase()) ||
              d.name_pt.toLowerCase().includes(tag.toLowerCase()) ||
              tag.toLowerCase().includes(d.name.toLowerCase())
            );
            
            if (discipline) {
              if (!disciplineCounts[discipline.id]) {
                disciplineCounts[discipline.id] = { questions: 0, flashcards: 0 };
              }
              disciplineCounts[discipline.id].flashcards++;
            }
          });
        }
      });

      // Criar lista final de disciplinas com contagens
      const disciplinesWithCounts = officialDisciplines.map(discipline => ({
        ...discipline,
        questionCount: disciplineCounts[discipline.id]?.questions || 0,
        flashcardCount: disciplineCounts[discipline.id]?.flashcards || 0,
        totalCount: (disciplineCounts[discipline.id]?.questions || 0) + (disciplineCounts[discipline.id]?.flashcards || 0)
      }));

      setDisciplines(disciplinesWithCounts);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar disciplinas:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisciplines();
  }, []);

  return {
    disciplines,
    loading,
    error,
    refetch: fetchDisciplines
  };
};

