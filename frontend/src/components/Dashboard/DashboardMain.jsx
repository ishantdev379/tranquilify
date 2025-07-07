import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Heart, 
  Zap, 
  Activity, 
  Calendar,
  ChevronRight,
  Lightbulb,
  Target,
  Award
} from 'lucide-react';
import axios from '../../config/axios'; 
import { toast } from 'react-hot-toast';

export const DashboardMain = ({data}) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [habits, setHabits] = useState([]);
  const [loadingHabits, setLoadingHabits] = useState(true);

  useEffect(() => {
    // Fetch latest 3 habits from backend on mount
    const fetchLatestHabits = async () => {
      try {
        setLoadingHabits(true);
        const res = await axios.get('/api/habits/latest?limit=3'); 
        if (res.data.success) {
          setHabits(res.data.habits);
        } else {
          toast.error('Failed to load latest habits');
        }
      } catch (err) {
        console.error(err);
        toast.error('Error fetching latest habits');
      } finally {
        setLoadingHabits(false);
      }
    };

    fetchLatestHabits();
  }, []);

  const getColorClass = (color) => {
    const colorMap = {
      emerald: 'bg-emerald-500',
      blue: 'bg-blue-500',
      purple: 'bg-purple-500',
      indigo: 'bg-indigo-500',
      green: 'bg-green-500',
      sky: 'bg-sky-500',
      rose: 'bg-rose-500',
      orange: 'bg-orange-500'
    };
    return colorMap[color] || 'bg-gray-500';
  };

  const getMoodEmoji = (mood) => {
    if (mood >= 5) return '😊';
    if (mood >= 4) return '🙂';
    if (mood >= 3) return '😐';
    if (mood >= 2) return '😔';
    return '😢';
  };

  const getStressColor = (level) => {
    if (level >= 4) return 'bg-red-500';
    if (level >= 3) return 'bg-orange-500';
    if (level >= 2) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % data.aiTips.length);
  };

  const recentMoodData = data.moodData.slice(-7);
  const completedHabits = habits.filter(habit => habit.completed);


  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-sky-500 to-emerald-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, {data.user.name.split(' ')[0]}! 👋</h2>
            <p className="text-sky-100 mb-4">You're doing great on your wellness journey</p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span className="font-semibold">{data.user.streak} day streak</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>{completedHabits.length}/{habits.length} habits today</span>
              </div>
            </div>
          </div>
          <div className="text-6xl opacity-20">🌿</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Mood Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Average Mood</h3>
                <p className="text-sm text-gray-600">This week</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+{data.weeklyStats.moodImprovement}%</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-gray-900">{data.weeklyStats.averageMood}</span>
            <span className="text-2xl">{getMoodEmoji(data.weeklyStats.averageMood)}</span>
          </div>
        </div>

        {/* Stress Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Stress Level</h3>
                <p className="text-sm text-gray-600">This week</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-emerald-600">
              <TrendingDown className="w-4 h-4" />
              <span className="text-sm font-medium">-{data.weeklyStats.stressReduction}%</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-gray-900">{data.weeklyStats.averageStress}</span>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`w-2 h-6 rounded-full ${
                    level <= data.weeklyStats.averageStress ? 'bg-orange-400' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Energy Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Energy Level</h3>
                <p className="text-sm text-gray-600">This week</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+{data.weeklyStats.energyIncrease}%</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-gray-900">{data.weeklyStats.averageEnergy}</span>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`w-2 h-6 rounded-full ${
                    level <= data.weeklyStats.averageEnergy ? 'bg-yellow-400' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mood + Stress Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Trends */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Mood Trends</h3>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentMoodData.map((day, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-16 text-sm text-gray-600">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-gray-700">Mood</span>
                    <span className="text-lg">{getMoodEmoji(day.mood)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-rose-400 to-pink-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(day.mood / 5) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900">{day.mood}/5</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stress Factors */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Stress Factors</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {data.stressFactors.map((factor, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-20 text-sm text-gray-600">{factor.factor}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Level {factor.level}</span>
                    <span className="text-sm text-gray-600">{factor.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${getStressColor(factor.level)}`}
                      style={{ width: `${factor.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Tip of the Day */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">AI Wellness Tip</h3>
              <p className="text-sm text-gray-600">Personalized for you</p>
            </div>
          </div>
          <button
            onClick={nextTip}
            className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            <span className="text-sm font-medium text-gray-700">Next Tip</span>
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">{data.aiTips[currentTipIndex].icon}</span>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{data.aiTips[currentTipIndex].title}</h4>
              <p className="text-gray-700 leading-relaxed">{data.aiTips[currentTipIndex].tip}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                {data.aiTips[currentTipIndex].category}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Habits */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Today's Habits</h3>
          <span className="text-sm text-gray-600">{completedHabits.length}/{habits.length} completed</span>
        </div>

        {loadingHabits ? (
          <p className="text-center text-gray-500">Loading habits...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {habits.map((habit) => (
              <div
                key={habit._id}
                className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  habit.completed
                    ? 'border-emerald-200 bg-emerald-50'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{habit.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{habit.name}</h4>
                    <p className="text-sm text-gray-600">{habit.streak} day streak</p>
                  </div>
                 
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
