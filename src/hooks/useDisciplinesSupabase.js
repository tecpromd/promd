import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { disciplinesData, disciplinesList } from '../data/disciplines';

export const useDisciplinesSupabase = () => {
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar disciplinas do Supabase
  const loadDisciplines = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('disciplines')
        .select('*')
        .order('order_index');

      if (supabaseError) throw supabaseError;

      // Se não há disciplinas no banco, criar as 19 disciplinas padrão
      if (!data || data.length === 0) {
        await initializeDisciplines();
        return;
      }

      setDisciplines(data);
    } catch (err) {
      console.error('Erro ao carregar disciplinas:', err);
      setError(err.message);
      // Fallback para dados locais
      setDisciplines(getAllDisciplinesLocal());
    } finally {
      setLoading(false);
    }
  };

  // Inicializar as 19 disciplinas no banco
  const initializeDisciplines = async () => {
    try {
      const disciplinesToInsert = disciplinesList.map((id, index) => ({
        id,
        name_pt: getDisciplineName(id, 'pt'),
        name_en: getDisciplineName(id, 'en'),
        name_es: getDisciplineName(id, 'es'),
        description_pt: disciplinesData[id].description.pt,
        description_en: disciplinesData[id].description.en,
        description_es: disciplinesData[id].description.es,
        icon: disciplinesData[id].icon,
        color: disciplinesData[id].color,
        color_light: disciplinesData[id].colorLight,
        order_index: index,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const { data, error } = await supabase
        .from('disciplines')
        .insert(disciplinesToInsert)
        .select();

      if (error) throw error;

      setDisciplines(data);
      console.log('✅ 19 disciplinas médicas inicializadas no Supabase');
    } catch (err) {
      console.error('Erro ao inicializar disciplinas:', err);
      setError(err.message);
    }
  };

  // Obter nome da disciplina por idioma
  const getDisciplineName = (id, language) => {
    const translations = {
      pt: {
        anatomy: "Anatomia, Musculoesquelético e Reumatologia",
        behavioral: "Ciências Comportamentais",
        biochemistry: "Bioquímica",
        biostatistics: "Bioestatística e Epidemiologia",
        cardiology: "Cardiologia",
        dermatology: "Dermatologia",
        endocrinology: "Endocrinologia",
        female: "Genital Feminino, Reprodutivo e Mama",
        gastroenterology: "Gastroenterologia",
        hematology: "Hematologia",
        immunology: "Imunologia",
        infectious: "Doenças Infecciosas",
        male: "Patologia Masculina",
        neurology: "Neurologia",
        pathology: "Patologia",
        pharmacology: "Farmacologia",
        psychiatry: "Psiquiatria",
        pulmonary: "Pneumologia",
        renal: "Nefrologia"
      },
      en: {
        anatomy: "Anatomy, Musculoskeletal & Rheumatology",
        behavioral: "Behavioral Science",
        biochemistry: "Biochemistry",
        biostatistics: "Biostatistics & Epidemiology",
        cardiology: "Cardiology",
        dermatology: "Dermatology",
        endocrinology: "Endocrinology",
        female: "Female Genital, Reproductive & Breast",
        gastroenterology: "Gastroenterology",
        hematology: "Hematology",
        immunology: "Immunology",
        infectious: "Infectious Disease",
        male: "Male Pathology",
        neurology: "Neurology",
        pathology: "Pathology",
        pharmacology: "Pharmacology",
        psychiatry: "Psychiatry",
        pulmonary: "Pulmonary",
        renal: "Renal"
      },
      es: {
        anatomy: "Anatomía, Musculoesquelético y Reumatología",
        behavioral: "Ciencias del Comportamiento",
        biochemistry: "Bioquímica",
        biostatistics: "Bioestadística y Epidemiología",
        cardiology: "Cardiología",
        dermatology: "Dermatología",
        endocrinology: "Endocrinología",
        female: "Genital Femenino, Reproductivo y Mama",
        gastroenterology: "Gastroenterología",
        hematology: "Hematología",
        immunology: "Inmunología",
        infectious: "Enfermedades Infecciosas",
        male: "Patología Masculina",
        neurology: "Neurología",
        pathology: "Patología",
        pharmacology: "Farmacología",
        psychiatry: "Psiquiatría",
        pulmonary: "Neumología",
        renal: "Nefrología"
      }
    };

    return translations[language][id] || id;
  };

  // Fallback para dados locais
  const getAllDisciplinesLocal = () => {
    return disciplinesList.map((id, index) => ({
      id,
      name_pt: getDisciplineName(id, 'pt'),
      name_en: getDisciplineName(id, 'en'),
      name_es: getDisciplineName(id, 'es'),
      description_pt: disciplinesData[id].description.pt,
      description_en: disciplinesData[id].description.en,
      description_es: disciplinesData[id].description.es,
      icon: disciplinesData[id].icon,
      color: disciplinesData[id].color,
      color_light: disciplinesData[id].colorLight,
      order_index: index,
      is_active: true
    }));
  };

  // Atualizar disciplina
  const updateDiscipline = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('disciplines')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setDisciplines(prev => 
        prev.map(discipline => 
          discipline.id === id ? data : discipline
        )
      );

      return data;
    } catch (err) {
      console.error('Erro ao atualizar disciplina:', err);
      throw err;
    }
  };

  // Obter disciplina por ID
  const getDisciplineById = (id) => {
    return disciplines.find(discipline => discipline.id === id);
  };

  // Obter disciplinas ativas
  const getActiveDisciplines = () => {
    return disciplines.filter(discipline => discipline.is_active);
  };

  useEffect(() => {
    loadDisciplines();
  }, []);

  return {
    disciplines,
    loading,
    error,
    loadDisciplines,
    updateDiscipline,
    getDisciplineById,
    getActiveDisciplines,
    initializeDisciplines
  };
};

