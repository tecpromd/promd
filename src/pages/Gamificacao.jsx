import React, { useState, useEffect } from 'react';
import { Trophy, Star, Medal, Crown, Target, TrendingUp, Award, Zap, Brain, Heart } from 'lucide-react';

const Gamificacao = () => {
  const [userStats, setUserStats] = useState({
    level: 12,
    xp: 2450,
    xpToNext: 550,
    totalQuestions: 156,
    correctAnswers: 124,
    streak: 7,
    rank: 'Residente Senior',
    position: 23
  });

  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: 'Primeiro Passo',
      description: 'Complete sua primeira questão',
      icon: Target,
      unlocked: true,
      date: '2024-08-15',
      xp: 50
    },
    {
      id: 2,
      title: 'Maratonista',
      description: 'Responda 100 questões',
      icon: TrendingUp,
      unlocked: true,
      date: '2024-08-20',
      xp: 200
    },
    {
      id: 3,
      title: 'Especialista em Cardiologia',
      description: 'Acerte 90% das questões de cardiologia',
      icon: Heart,
      unlocked: true,
      date: '2024-08-25',
      xp: 300
    },
    {
      id: 4,
      title: 'Gênio Médico',
      description: 'Mantenha 95% de acertos por 50 questões',
      icon: Brain,
      unlocked: false,
      progress: 32,
      total: 50,
      xp: 500
    },
    {
      id: 5,
      title: 'Velocista',
      description: 'Responda 10 questões em menos de 5 minutos',
      icon: Zap,
      unlocked: false,
      progress: 3,
      total: 10,
      xp: 150
    },
    {
      id: 6,
      title: 'Mestre USMLE',
      description: 'Alcance 90% no simulado Step 1',
      icon: Crown,
      unlocked: false,
      progress: 0,
      total: 1,
      xp: 1000
    }
  ]);

  const [rankings, setRankings] = useState([
    { position: 1, name: 'Dr. Ana Silva', level: 25, xp: 5420, avatar: '👩‍⚕️' },
    { position: 2, name: 'Dr. Carlos Santos', level: 23, xp: 4890, avatar: '👨‍⚕️' },
    { position: 3, name: 'Dr. Maria Costa', level: 22, xp: 4650, avatar: '👩‍⚕️' },
    { position: 4, name: 'Dr. João Oliveira', level: 20, xp: 4200, avatar: '👨‍⚕️' },
    { position: 5, name: 'Dr. Lucia Ferreira', level: 19, xp: 3980, avatar: '👩‍⚕️' },
    // ... usuário atual
    { position: 23, name: 'Você', level: 12, xp: 2450, avatar: '🎯', isCurrentUser: true },
  ]);

  const levels = [
    { level: 1, title: 'Estudante', minXp: 0, color: 'bg-slate-500' },
    { level: 5, title: 'Interno', minXp: 500, color: 'bg-blue-500' },
    { level: 10, title: 'Residente', minXp: 1500, color: 'bg-green-500' },
    { level: 15, title: 'Residente Senior', minXp: 3000, color: 'bg-yellow-500' },
    { level: 20, title: 'Especialista', minXp: 5000, color: 'bg-orange-500' },
    { level: 25, title: 'Mestre Médico', minXp: 8000, color: 'bg-red-500' },
    { level: 30, title: 'Lenda USMLE', minXp: 12000, color: 'bg-purple-500' },
  ];

  const getCurrentLevelInfo = () => {
    return levels.reverse().find(l => userStats.xp >= l.minXp) || levels[0];
  };

  const getNextLevelInfo = () => {
    const currentLevel = getCurrentLevelInfo();
    return levels.find(l => l.minXp > userStats.xp) || currentLevel;
  };

  const calculateProgress = () => {
    const current = getCurrentLevelInfo();
    const next = getNextLevelInfo();
    if (current === next) return 100;
    
    const progress = ((userStats.xp - current.minXp) / (next.minXp - current.minXp)) * 100;
    return Math.min(progress, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-promd-navy dark:text-white mb-2">
            Sistema de Gamificação
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Acompanhe seu progresso e conquiste novos níveis
          </p>
        </div>

        {/* Stats principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-promd-navy to-promd-sky rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-promd-navy dark:text-white">
              Nível {userStats.level}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {getCurrentLevelInfo().title}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-promd-navy dark:text-white">
              {userStats.xp.toLocaleString()} XP
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {userStats.xpToNext} para próximo nível
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-promd-navy dark:text-white">
              {Math.round((userStats.correctAnswers / userStats.totalQuestions) * 100)}%
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Taxa de acerto
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-promd-navy dark:text-white">
              {userStats.streak}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Dias consecutivos
            </div>
          </div>
        </div>

        {/* Progresso do nível */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-promd-navy dark:text-white mb-4">
            Progresso do Nível
          </h3>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 ${getCurrentLevelInfo().color} rounded-full flex items-center justify-center text-white font-bold`}>
              {userStats.level}
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                <span>{getCurrentLevelInfo().title}</span>
                <span>{getNextLevelInfo().title}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-promd-navy to-promd-sky h-3 rounded-full transition-all duration-500"
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span>{getCurrentLevelInfo().minXp} XP</span>
                <span>{getNextLevelInfo().minXp} XP</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Conquistas */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-promd-navy dark:text-white mb-6 flex items-center gap-2">
              <Award className="w-6 h-6" />
              Conquistas
            </h3>
            <div className="space-y-4">
              {achievements.map((achievement) => {
                const IconComponent = achievement.icon;
                return (
                  <div 
                    key={achievement.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      achievement.unlocked 
                        ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
                        : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        achievement.unlocked 
                          ? 'bg-green-500 text-white' 
                          : 'bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400'
                      }`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-semibold ${
                            achievement.unlocked 
                              ? 'text-green-800 dark:text-green-200' 
                              : 'text-slate-700 dark:text-slate-300'
                          }`}>
                            {achievement.title}
                          </h4>
                          {achievement.unlocked && (
                            <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                              +{achievement.xp} XP
                            </span>
                          )}
                        </div>
                        <p className={`text-sm ${
                          achievement.unlocked 
                            ? 'text-green-700 dark:text-green-300' 
                            : 'text-slate-600 dark:text-slate-400'
                        }`}>
                          {achievement.description}
                        </p>
                        {achievement.unlocked && achievement.date && (
                          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                            Conquistado em {new Date(achievement.date).toLocaleDateString('pt-BR')}
                          </p>
                        )}
                        {!achievement.unlocked && achievement.progress !== undefined && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                              <span>Progresso</span>
                              <span>{achievement.progress}/{achievement.total}</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                              <div 
                                className="bg-promd-navy h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rankings */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-promd-navy dark:text-white mb-6 flex items-center gap-2">
              <Crown className="w-6 h-6" />
              Ranking Global
            </h3>
            <div className="space-y-3">
              {rankings.slice(0, 10).map((user) => (
                <div 
                  key={user.position}
                  className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
                    user.isCurrentUser 
                      ? 'bg-promd-navy/10 dark:bg-promd-navy/20 border-2 border-promd-navy' 
                      : 'bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    user.position === 1 ? 'bg-yellow-500 text-white' :
                    user.position === 2 ? 'bg-slate-400 text-white' :
                    user.position === 3 ? 'bg-orange-600 text-white' :
                    'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
                  }`}>
                    {user.position <= 3 ? (
                      user.position === 1 ? '🥇' : user.position === 2 ? '🥈' : '🥉'
                    ) : (
                      user.position
                    )}
                  </div>
                  <div className="text-2xl">{user.avatar}</div>
                  <div className="flex-1">
                    <div className={`font-semibold ${
                      user.isCurrentUser 
                        ? 'text-promd-navy dark:text-white' 
                        : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {user.name}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Nível {user.level} • {user.xp.toLocaleString()} XP
                    </div>
                  </div>
                  {user.position <= 3 && (
                    <Medal className={`w-5 h-5 ${
                      user.position === 1 ? 'text-yellow-500' :
                      user.position === 2 ? 'text-slate-400' :
                      'text-orange-600'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            
            {userStats.position > 10 && (
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                <div className="text-center text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Sua posição atual
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg bg-promd-navy/10 dark:bg-promd-navy/20 border-2 border-promd-navy">
                  <div className="w-8 h-8 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center text-sm font-bold text-slate-700 dark:text-slate-300">
                    {userStats.position}
                  </div>
                  <div className="text-2xl">🎯</div>
                  <div className="flex-1">
                    <div className="font-semibold text-promd-navy dark:text-white">
                      Você
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Nível {userStats.level} • {userStats.xp.toLocaleString()} XP
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desafios diários */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-promd-navy dark:text-white mb-6 flex items-center gap-2">
            <Target className="w-6 h-6" />
            Desafios Diários
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-blue-800 dark:text-blue-200">
                  Questões Diárias
                </span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                Responda 10 questões hoje
              </p>
              <div className="flex justify-between text-xs text-blue-600 dark:text-blue-400 mb-1">
                <span>Progresso</span>
                <span>7/10</span>
              </div>
              <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                Recompensa: +100 XP
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-green-800 dark:text-green-200">
                  Precisão
                </span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                Mantenha 80% de acertos
              </p>
              <div className="flex justify-between text-xs text-green-600 dark:text-green-400 mb-1">
                <span>Taxa atual</span>
                <span>85%</span>
              </div>
              <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <div className="text-xs text-green-600 dark:text-green-400 mt-2">
                ✅ Concluído! +150 XP
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-purple-800 dark:text-purple-200">
                  Velocidade
                </span>
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-300 mb-3">
                Complete 5 questões em 3 min
              </p>
              <div className="flex justify-between text-xs text-purple-600 dark:text-purple-400 mb-1">
                <span>Progresso</span>
                <span>2/5</span>
              </div>
              <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
              <div className="text-xs text-purple-600 dark:text-purple-400 mt-2">
                Recompensa: +200 XP
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gamificacao;

