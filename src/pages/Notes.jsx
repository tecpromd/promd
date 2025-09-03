import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  StickyNote, 
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
  Hash,
  MessageSquare,
  Highlighter,
  BookOpen,
  HelpCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewNoteForm, setShowNewNoteForm] = useState(false);

  const [newNote, setNewNote] = useState({
    content: '',
    type: 'question_note',
    question_id: null,
    review_id: null,
    highlight_text: '',
    position: null,
    color: '#FEF3C7'
  });

  const noteTypes = [
    { value: 'question_note', label: 'Nota em Questão', icon: HelpCircle, color: '#DBEAFE' },
    { value: 'review_note', label: 'Nota em Review', icon: BookOpen, color: '#D1FAE5' },
    { value: 'highlight', label: 'Destaque', icon: Highlighter, color: '#FEF3C7' },
    { value: 'general', label: 'Nota Geral', icon: MessageSquare, color: '#F3E8FF' }
  ];

  const colors = [
    '#FEF3C7', '#DBEAFE', '#D1FAE5', '#F3E8FF', '#FED7D7',
    '#E0F2FE', '#ECFDF5', '#FAF5FF', '#FEF2F2', '#F0F9FF'
  ];

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contextual_notes')
        .select(`
          *,
          questions:question_id(question_text, question_number),
          reviews:review_id(title)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Erro ao buscar notas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async () => {
    try {
      if (!newNote.content.trim()) {
        alert('Conteúdo da nota é obrigatório');
        return;
      }

      const noteData = {
        content: newNote.content.trim(),
        type: newNote.type,
        question_id: newNote.question_id || null,
        review_id: newNote.review_id || null,
        highlight_text: newNote.highlight_text.trim() || null,
        position: newNote.position,
        color: newNote.color,
        user_id: 'default-user' // Placeholder
      };

      const { data, error } = await supabase
        .from('contextual_notes')
        .insert([noteData])
        .select()
        .single();

      if (error) throw error;

      setNotes(prev => [data, ...prev]);
      setNewNote({
        content: '',
        type: 'question_note',
        question_id: null,
        review_id: null,
        highlight_text: '',
        position: null,
        color: '#FEF3C7'
      });
      setShowNewNoteForm(false);
    } catch (error) {
      console.error('Erro ao criar nota:', error);
      alert('Erro ao criar nota');
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm('Tem certeza que deseja excluir esta nota?')) return;

    try {
      const { error } = await supabase
        .from('contextual_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;

      setNotes(prev => prev.filter(note => note.id !== noteId));
    } catch (error) {
      console.error('Erro ao excluir nota:', error);
      alert('Erro ao excluir nota');
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (note.highlight_text && note.highlight_text.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || note.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeInfo = (type) => {
    return noteTypes.find(t => t.value === type) || noteTypes[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-orange-200 rounded-full animate-spin border-t-orange-600 mx-auto mb-4"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent rounded-full animate-ping border-t-orange-400 mx-auto"></div>
          </div>
          <p className="text-slate-600 font-medium text-lg">Carregando notas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.03'%3E%3Cpath d='M30 30l15-15v30l-15-15zm-15 0l15 15v-30l-15 15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
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
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
                  <StickyNote className="h-8 w-8 text-orange-600" />
                  Notes
                </h1>
                <p className="text-slate-600 text-lg font-medium">
                  Anotações contextuais em questões e reviews
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowNewNoteForm(true)}
              className="group relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Nova Nota
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
                    placeholder="Buscar notas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Tipo de Nota</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="all">Todos os tipos</option>
                  {noteTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedType('all');
                  }}
                  className="w-full bg-white/70 backdrop-blur-sm text-slate-700 px-6 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/30"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          </div>

          {/* Modal Nova Nota */}
          {showNewNoteForm && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/30">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-800">📝 Nova Nota</h3>
                  <button
                    onClick={() => setShowNewNoteForm(false)}
                    className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-xl transition-all duration-300"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Tipo de Nota</label>
                    <div className="grid grid-cols-2 gap-3">
                      {noteTypes.map(type => {
                        const Icon = type.icon;
                        return (
                          <button
                            key={type.value}
                            onClick={() => setNewNote(prev => ({ ...prev, type: type.value, color: type.color }))}
                            className={`p-4 rounded-2xl border-2 transition-all duration-300 flex items-center gap-3 ${
                              newNote.type === type.value 
                                ? 'border-orange-500 bg-orange-50' 
                                : 'border-white/30 bg-white/50 hover:bg-white/70'
                            }`}
                          >
                            <Icon className="w-5 h-5 text-slate-600" />
                            <span className="font-medium text-sm">{type.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {newNote.type === 'highlight' && (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">Texto Destacado</label>
                      <input
                        type="text"
                        value={newNote.highlight_text}
                        onChange={(e) => setNewNote(prev => ({ ...prev, highlight_text: e.target.value }))}
                        placeholder="Texto que foi destacado..."
                        className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Cor da Nota</label>
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

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Conteúdo da Nota *</label>
                    <textarea
                      value={newNote.content}
                      onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Escreva sua nota aqui..."
                      rows={6}
                      className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 resize-none"
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

          {/* Lista de Notas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => {
              const typeInfo = getTypeInfo(note.type);
              const Icon = typeInfo.icon;
              
              return (
                <div 
                  key={note.id} 
                  className="group bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2"
                  style={{ backgroundColor: `${note.color}40` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-slate-600" />
                      <span className="text-sm font-semibold text-slate-700">{typeInfo.label}</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-xl transition-all duration-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {note.highlight_text && (
                    <div className="mb-4 p-3 bg-yellow-100 rounded-2xl border-l-4 border-yellow-400">
                      <p className="text-sm text-slate-700 font-medium">
                        "{note.highlight_text}"
                      </p>
                    </div>
                  )}
                  
                  <p className="text-sm text-slate-700 mb-4 line-clamp-4 leading-relaxed">
                    {note.content}
                  </p>

                  {(note.questions || note.reviews) && (
                    <div className="mb-4 p-3 bg-slate-100 rounded-2xl">
                      <p className="text-xs text-slate-600 font-medium">
                        {note.questions && `Questão #${note.questions.question_number}`}
                        {note.reviews && `Review: ${note.reviews.title}`}
                      </p>
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
              );
            })}
          </div>

          {filteredNotes.length === 0 && (
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/30 text-center">
              <StickyNote className="h-20 w-20 text-slate-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-slate-800 mb-3">
                {searchTerm || selectedType !== 'all' ? 'Nenhuma nota encontrada' : 'Suas notas aparecerão aqui'}
              </h3>
              <p className="text-slate-600 mb-6 text-lg">
                {searchTerm || selectedType !== 'all' 
                  ? 'Tente ajustar os filtros de busca.' 
                  : 'Comece criando notas contextuais durante seus estudos.'
                }
              </p>
              {!searchTerm && selectedType === 'all' && (
                <button 
                  onClick={() => setShowNewNoteForm(true)}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto"
                >
                  <Plus className="h-5 w-5" />
                  Criar Primeira Nota
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;

