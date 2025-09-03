import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter,
  Edit3,
  Save,
  Trash2,
  Tag,
  Calendar,
  ArrowLeft,
  Bookmark,
  FileText,
  Hash
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const Notebook = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDiscipline, setSelectedDiscipline] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewNoteForm, setShowNewNoteForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    discipline: '',
    tags: '',
    color: '#3B82F6'
  });

  const disciplines = [
    'Behavioral Science', 'Biochemistry', 'Biostatistics & Epidemiology',
    'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology',
    'Genetics', 'Hematology', 'Immunology', 'Infectious Disease',
    'Anatomy, Musculoskeletal & Rheumatology', 'Neurology', 'Pathology',
    'Pharmacology', 'Psychiatry', 'Pulmonary', 'Renal',
    'Female Genital, Reproductive & Breast', 'Male Pathology'
  ];

  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ];

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notebook_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Erro ao buscar anotações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async () => {
    try {
      if (!newNote.title.trim() || !newNote.content.trim()) {
        alert('Título e conteúdo são obrigatórios');
        return;
      }

      const noteData = {
        title: newNote.title.trim(),
        content: newNote.content.trim(),
        discipline: newNote.discipline || null,
        tags: newNote.tags.trim() ? newNote.tags.split(',').map(tag => tag.trim()) : [],
        color: newNote.color,
        user_id: 'default-user' // Placeholder
      };

      const { data, error } = await supabase
        .from('notebook_entries')
        .insert([noteData])
        .select()
        .single();

      if (error) throw error;

      setNotes(prev => [data, ...prev]);
      setNewNote({
        title: '',
        content: '',
        discipline: '',
        tags: '',
        color: '#3B82F6'
      });
      setShowNewNoteForm(false);
    } catch (error) {
      console.error('Erro ao criar anotação:', error);
      alert('Erro ao criar anotação');
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm('Tem certeza que deseja excluir esta anotação?')) return;

    try {
      const { error } = await supabase
        .from('notebook_entries')
        .delete()
        .eq('id', noteId);

      if (error) throw error;

      setNotes(prev => prev.filter(note => note.id !== noteId));
    } catch (error) {
      console.error('Erro ao excluir anotação:', error);
      alert('Erro ao excluir anotação');
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDiscipline = selectedDiscipline === 'all' || note.discipline === selectedDiscipline;
    return matchesSearch && matchesDiscipline;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto mb-4"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent rounded-full animate-ping border-t-blue-400 mx-auto"></div>
          </div>
          <p className="text-slate-600 font-medium text-lg">Carregando notebook...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <Link to="/">
                <button className="bg-white/70 backdrop-blur-sm hover:bg-white/90 text-slate-700 px-6 py-3 rounded-2xl font-medium shadow-lg border border-white/20 transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </button>
              </Link>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                  Notebook
                </h1>
                <p className="text-slate-600 text-lg font-medium">
                  Suas anotações organizadas por disciplina
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowNewNoteForm(true)}
              className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Nova Anotação
              </div>
            </button>
          </div>

          {/* Filtros */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/30 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar anotações..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Disciplina</label>
                <select
                  value={selectedDiscipline}
                  onChange={(e) => setSelectedDiscipline(e.target.value)}
                  className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="all">Todas as disciplinas</option>
                  {disciplines.map(discipline => (
                    <option key={discipline} value={discipline}>{discipline}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedDiscipline('all');
                  }}
                  className="w-full bg-white/70 backdrop-blur-sm text-slate-700 px-6 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/30"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          </div>

          {/* Modal Nova Anotação */}
          {showNewNoteForm && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/30">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-800">✏️ Nova Anotação</h3>
                  <button
                    onClick={() => setShowNewNoteForm(false)}
                    className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-xl transition-all duration-300"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Título *</label>
                    <input
                      type="text"
                      value={newNote.title}
                      onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Título da anotação..."
                      className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">Disciplina</label>
                      <select
                        value={newNote.discipline}
                        onChange={(e) => setNewNote(prev => ({ ...prev, discipline: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      >
                        <option value="">Selecionar disciplina...</option>
                        {disciplines.map(discipline => (
                          <option key={discipline} value={discipline}>{discipline}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">Cor</label>
                      <div className="flex gap-2 flex-wrap">
                        {colors.map(color => (
                          <button
                            key={color}
                            onClick={() => setNewNote(prev => ({ ...prev, color }))}
                            className={`w-8 h-8 rounded-xl border-2 transition-all duration-300 hover:scale-110 ${
                              newNote.color === color ? 'border-slate-400 scale-110' : 'border-white'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Tags</label>
                    <input
                      type="text"
                      value={newNote.tags}
                      onChange={(e) => setNewNote(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="Ex: importante, revisão, prova..."
                      className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Conteúdo *</label>
                    <textarea
                      value={newNote.content}
                      onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Escreva sua anotação aqui..."
                      rows={8}
                      className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button 
                    onClick={handleCreateNote}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Salvar
                  </button>
                  <button 
                    onClick={() => setShowNewNoteForm(false)}
                    className="bg-white/70 backdrop-blur-sm text-slate-700 px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 border border-white/30"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Lista de Anotações */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <div 
                key={note.id} 
                className="group bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2"
                style={{ borderLeft: `6px solid ${note.color}` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2">
                      {note.title}
                    </h3>
                    {note.discipline && (
                      <div className="flex items-center gap-2 mb-2">
                        <Bookmark className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-600 font-medium">{note.discipline}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setEditingNote(note)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-all duration-300"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-xl transition-all duration-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-sm text-slate-600 mb-4 line-clamp-4 leading-relaxed">
                  {note.content}
                </p>
                
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {note.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full flex items-center gap-1"
                      >
                        <Hash className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(note.created_at).toLocaleDateString('pt-BR')}
                  </div>
                  <div 
                    className="w-4 h-4 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: note.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {filteredNotes.length === 0 && (
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/30 text-center">
              <FileText className="h-20 w-20 text-slate-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-slate-800 mb-3">
                {searchTerm || selectedDiscipline !== 'all' ? 'Nenhuma anotação encontrada' : 'Seu notebook está vazio'}
              </h3>
              <p className="text-slate-600 mb-6 text-lg">
                {searchTerm || selectedDiscipline !== 'all' 
                  ? 'Tente ajustar os filtros de busca.' 
                  : 'Comece criando sua primeira anotação de estudo.'
                }
              </p>
              {!searchTerm && selectedDiscipline === 'all' && (
                <button 
                  onClick={() => setShowNewNoteForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto"
                >
                  <Plus className="h-5 w-5" />
                  Criar Primeira Anotação
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notebook;

