import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://truepksaojbpgwdtelbb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydWVwa3Nhb2picGd3ZHRlbGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzM0NjcsImV4cCI6MjA3MDE0OTQ2N30.UO0hdlI6IAvJeWDEbrnicMMLNn9ExAV7zPQlEc3DgTk';

const supabase = createClient(supabaseUrl, supabaseKey);

const DisciplineFilter = ({ selectedDiscipline, onDisciplineChange, className = '' }) => {
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDisciplines();
  }, []);

  const loadDisciplines = async () => {
    try {
      const { data, error } = await supabase
        .from('disciplines')
        .select('id, name, description')
        .order('name');

      if (error) {
        console.error('Erro ao carregar disciplinas:', error);
        return;
      }

      // Remover duplicatas baseado no nome
      const uniqueDisciplines = data.reduce((acc, current) => {
        const existing = acc.find(item => item.name === current.name);
        if (!existing) {
          acc.push(current);
        }
        return acc;
      }, []);

      setDisciplines(uniqueDisciplines);
    } catch (error) {
      console.error('Erro ao carregar disciplinas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        <select disabled className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100">
          <option>Carregando disciplinas...</option>
        </select>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <select
        value={selectedDiscipline || ''}
        onChange={(e) => onDisciplineChange(e.target.value || null)}
        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Todas as Disciplinas</option>
        {disciplines.map((discipline) => (
          <option key={discipline.id} value={discipline.id}>
            {discipline.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DisciplineFilter;

