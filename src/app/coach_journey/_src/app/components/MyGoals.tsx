"use client";
import { useState, useEffect } from 'react';
import { Target, Plus, Trash2, Calendar, CheckCircle2, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { ShareModal } from '@/components/ShareModal';
import { getGoals, createGoal, updateGoal, deleteGoal } from '@/app/actions/goalActions';

type GoalStatus = 'not-started' | 'in-progress' | 'completed';

interface Goal {
  id: string;
  title: string;
  description: string;
  status: GoalStatus;
  deadline?: string;
  created_at?: string;
}

export function MyGoals() {
  const { t } = useTranslation();
  const router = useRouter();
  const { userId } = useAuth();
  const [showShareModal, setShowShareModal] = useState(false);

  const STATUS_OPTIONS: { value: GoalStatus; label: string; color: string; bgColor: string }[] = [
    { value: 'not-started', label: t('status.notStarted'), color: 'text-gray-700', bgColor: 'bg-gray-100' },
    { value: 'in-progress', label: t('status.inProgress'), color: 'text-blue-700', bgColor: 'bg-blue-100' },
    { value: 'completed', label: t('status.completed'), color: 'text-green-700', bgColor: 'bg-green-100' },
  ];
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDescription, setNewGoalDescription] = useState('');
  const [newGoalStatus, setNewGoalStatus] = useState<GoalStatus>('not-started');
  const [newGoalDeadline, setNewGoalDeadline] = useState('');

  useEffect(() => {
    fetchGoals();
  }, [userId]);

  const fetchGoals = async () => {
    try {
      if (!userId) return;
      const data = await getGoals(userId);
      setGoals(data.map(g => ({ ...g, status: g.status as GoalStatus })));
    } catch (err) {
      console.error('Failed to fetch goals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async () => {
    if (newGoalTitle.trim() && userId) {
      try {
        await createGoal({
          userId,
          title: newGoalTitle,
          description: newGoalDescription,
          status: newGoalStatus,
          deadline: newGoalDeadline || undefined,
        });
        await fetchGoals();
        setNewGoalTitle('');
        setNewGoalDescription('');
        setNewGoalStatus('not-started');
        setNewGoalDeadline('');
        setShowAddGoal(false);
      } catch (err) {
        console.error('Failed to add goal', err);
      }
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      await deleteGoal(id, userId!);
      setGoals(goals.filter(goal => goal.id !== id));
    } catch (err) {
      console.error('Failed to delete goal', err);
    }
  };

  const handleUpdateStatus = async (id: string, status: GoalStatus) => {
    try {
      setGoals(goals.map(goal => goal.id === id ? { ...goal, status } : goal));
      await updateGoal({ id, status, userId: userId! });
    } catch (err) {
      console.error('Failed to update goal status', err);
      await fetchGoals(); // revert on failure
    }
  };

  const getStatusConfig = (status: GoalStatus) => {
    return STATUS_OPTIONS.find(opt => opt.value === status) || STATUS_OPTIONS[0];
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/coach/coach_journey', { scroll: false })}
          className="p-2 rounded-xl hover:bg-slate-200 transition-colors text-slate-700 flex-shrink-0"
          aria-label="Go Back"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
          <Target className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('goals.title')}</h1>
          <p className="text-sm text-gray-500">{t('goals.subtitle')}</p>
        </div>
      </div>

      {/* Add New Goal Card */}
      <div className="bg-purple-50 rounded-2xl p-6 sm:p-8 border border-purple-100 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{t('goals.createTitle')}</h3>
              <p className="text-gray-600 text-sm">{t('goals.createSubtitle')}</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowAddGoal(!showAddGoal)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition shadow-md"
          >
            <Plus className="w-5 h-5" />
            {t('goals.addBtn')}
          </button>
        </div>

        {showAddGoal && (
          <div className="mt-6 pt-6 border-t border-purple-200 border-opacity-60">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">{t('goals.formTitle')}</label>
                <input
                  type="text"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  placeholder="..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100 transition shadow-sm"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">{t('goals.formDesc')}</label>
                <textarea
                  value={newGoalDescription}
                  onChange={(e) => setNewGoalDescription(e.target.value)}
                  placeholder="..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100 transition shadow-sm resize-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">{t('goals.formStatus')}</label>
                  <select
                    value={newGoalStatus}
                    onChange={(e) => setNewGoalStatus(e.target.value as GoalStatus)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-gray-50 text-gray-900 focus:outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100 transition shadow-sm"
                  >
                    {STATUS_OPTIONS.map(option => (
                      <option key={option.value} value={option.value} className="text-gray-900">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">{t('goals.formDeadline')}</label>
                  <input
                    type="date"
                    value={newGoalDeadline}
                    onChange={(e) => setNewGoalDeadline(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-gray-50 text-gray-900 focus:outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100 transition shadow-sm"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddGoal}
                  disabled={!newGoalTitle.trim()}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('goals.saveBtn')}
                </button>
                <button
                  onClick={() => {
                    setShowAddGoal(false);
                    setNewGoalTitle('');
                    setNewGoalDescription('');
                    setNewGoalStatus('not-started');
                    setNewGoalDeadline('');
                  }}
                  className="px-6 py-3 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:bg-opacity-10 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal, index) => {
          const statusConfig = getStatusConfig(goal.status);
          
          return (
            <div key={goal.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <div className="text-xs font-bold text-orange-600 mb-1 uppercase tracking-wider">Goal {index + 1}</div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 break-words">{goal.title}</h3>
                      </div>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition flex-shrink-0"
                        title="Delete goal"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed break-words">{goal.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-3">
                      <select
                        value={goal.status}
                        onChange={(e) => handleUpdateStatus(goal.id, e.target.value as GoalStatus)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold ${statusConfig.bgColor} ${statusConfig.color} cursor-pointer border-none outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
                      >
                        {STATUS_OPTIONS.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                      
                      {goal.deadline && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl">
                          <Calendar className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">
                            {new Date(goal.deadline).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {goals.length > 0 && (
          <div className="pt-8 border-t border-slate-200 flex flex-col items-center">
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 px-8 py-4 bg-white border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
            >
              <Target className="w-5 h-5 text-orange-500" />
              {t('common.shareProgress', 'Share My Progress')}
            </button>
          </div>
        )}

      <ShareModal t={t} 
        isOpen={showShareModal} 
        onClose={() => setShowShareModal(false)} 
        title={t('share.goals_progress_title', 'Goals & Progress')}
        message={t('share.goals_progress_msg', "You're making great strides toward your goals. Share your journey and inspire others!")}
      />
      </div>

      {goals.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Target className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{t('goals.emptyTitle')}</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {t('goals.emptyDesc')}
          </p>
        </div>
      )}
    </div>
  );
}
