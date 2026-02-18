import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area } from 'recharts';
import { Calendar, TrendingUp, Award, Clock, Lightbulb, Target, AlertCircle, BookOpen, Trophy, Trash2, BarChart3, PieChart as PieChartIcon, TrendingDown, User, Mail, Phone, MapPin, Edit, Activity } from 'lucide-react';
import { analyzeQuizResults, QuizAnalysis } from '@/lib/gemini';

interface QuizResult {
  id: string;
  created_at: string;
  career_path: string;
  score: number;
  total_questions: number;
}

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone_number: string | null;
  location: string | null;
  bio: string | null;
  quiz_completion_count: number;
  created_at: string | null;
  updated_at: string | null;
}

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<QuizAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [deletingQuiz, setDeletingQuiz] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'area'>('bar');

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  // Refresh data when component becomes visible (e.g., when navigating back from quiz)
  useEffect(() => {
    const handleFocus = () => {
      if (user) {
        fetchUserData();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile and quiz history in parallel
      const [profileResult, quizResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, user_id, full_name, email, phone_number, location, bio, quiz_completion_count, created_at, updated_at')
          .eq('user_id', user?.id)
          .single(),
        supabase
          .from('quiz_results')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false })
      ]);

      // Handle profile - create if doesn't exist
      if (profileResult.error) {
        if (profileResult.error.code === 'PGRST116') {
          // Profile doesn't exist, create a basic one
          console.log('Profile not found, creating basic profile...');
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([{
              user_id: user?.id,
              full_name: user?.user_metadata?.full_name || null,
              email: user?.email || null,
            }])
            .select()
            .single();
          
          if (createError) {
            console.error('Error creating profile:', createError);
            // Continue without profile data
            setUserProfile(null);
          } else {
            setUserProfile(newProfile);
          }
        } else {
          console.error('Error fetching profile:', profileResult.error);
          // Continue without profile data
          setUserProfile(null);
        }
      } else {
        setUserProfile(profileResult.data);
      }

      // Handle quiz results
      if (quizResult.error) {
        console.error('Error fetching quiz results:', quizResult.error);
        console.error('Quiz error details:', JSON.stringify(quizResult.error, null, 2));
        setQuizHistory([]);
      } else {
        console.log('Quiz results loaded:', quizResult.data?.length || 0, 'quizzes');
        setQuizHistory(quizResult.data || []);
      }
      
      // Generate analysis if there are quiz results
      if (quizResult.data && quizResult.data.length > 0) {
        setAnalyzing(true);
        try {
          const analysisResult = await analyzeQuizResults(quizResult.data);
          setAnalysis(analysisResult);
        } catch (analysisError) {
          console.error('Error generating analysis:', analysisError);
          // Continue without analysis
        } finally {
          setAnalyzing(false);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load user data. Please try refreshing the page.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCareerPathStats = () => {
    const stats = quizHistory.reduce((acc, quiz) => {
      acc[quiz.career_path] = (acc[quiz.career_path] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(stats).map(([path, count]) => ({
      name: path,
      count,
      percentage: ((count / quizHistory.length) * 100).toFixed(1),
      color: getCareerPathColor(path),
    }));
  };

  const getCareerPathColor = (path: string) => {
    const colors = [
      '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', 
      '#EF4444', '#8B5A2B', '#FF6B6B', '#4ECDC4',
      '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'
    ];
    const index = path.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getCareerPathTrends = () => {
    const monthlyStats = quizHistory.reduce((acc, quiz) => {
      const date = new Date(quiz.created_at);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthYear]) {
        acc[monthYear] = {};
      }
      
      if (!acc[monthYear][quiz.career_path]) {
        acc[monthYear][quiz.career_path] = 0;
      }
      
      acc[monthYear][quiz.career_path]++;
      return acc;
    }, {} as Record<string, Record<string, number>>);

    return Object.entries(monthlyStats)
      .sort()
      .map(([month, paths]) => ({
        month: month,
        ...paths
      }));
  };

  const getCompletionRate = () => {
    if (quizHistory.length === 0) return 0;
    // Calculate completion rate: how many questions were answered vs total questions
    // Since this is a preference-based quiz, completion rate shows engagement level
    const total = quizHistory.reduce((sum, quiz) => sum + (quiz.score / quiz.total_questions) * 100, 0);
    return (total / quizHistory.length).toFixed(1);
  };

  const getQuizCompletionStreak = () => {
    if (quizHistory.length === 0) return 0;
    
    // Sort by date and check for consecutive days
    const sortedDates = quizHistory
      .map(q => new Date(q.created_at).toDateString())
      .sort()
      .reverse();
    
    let streak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const currentDate = new Date(sortedDates[i]);
      const prevDate = new Date(sortedDates[i - 1]);
      const diffTime = Math.abs(prevDate.getTime() - currentDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const handleDeleteQuiz = async (quizId: string) => {
    // Show confirmation dialog
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this quiz result? This action cannot be undone."
    );

    if (!isConfirmed) {
      return;
    }

    setDeletingQuiz(quizId);

    try {
      const { error } = await supabase
        .from('quiz_results')
        .delete()
        .eq('id', quizId);

      if (error) {
        throw error;
      }

      // Remove from local state
      setQuizHistory(prev => prev.filter(quiz => quiz.id !== quizId));
      
      // Refresh user data to update counters
      await fetchUserData();

      toast({
        title: "Success",
        description: "Quiz result deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting quiz:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete quiz result",
      });
    } finally {
      setDeletingQuiz(null);
    }
  };

  const renderAnalysisSection = () => {
    if (loading || analyzing) {
      return <div className="text-center py-8">Loading analysis...</div>;
    }

    if (!analysis) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Complete a quiz to see your analysis</p>
          <Button
            onClick={() => navigate('/quiz')}
            className="bg-career-purple hover:bg-career-purple-dark"
          >
            Take a Quiz
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Lightbulb className="text-career-yellow" size={20} />
            Strengths
          </h3>
          <ul className="space-y-2">
            {analysis.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-career-yellow">•</span>
                <span className="text-foreground">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertCircle className="text-career-red" size={20} />
            Areas for Improvement
          </h3>
          <ul className="space-y-2">
            {analysis.weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-career-red">•</span>
                <span className="text-foreground">{weakness}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Target className="text-career-blue" size={20} />
            Recommendations
          </h3>
          <ul className="space-y-2">
            {analysis.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-career-blue">•</span>
                <span className="text-foreground">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <BookOpen className="text-career-green" size={20} />
            Career Insights
          </h3>
          <ul className="space-y-2">
            {analysis.careerInsights.map((insight, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-career-green">•</span>
                <span className="text-foreground">{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-muted-foreground">
                {entry.name}: {entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const data = getCareerPathStats();
    const trendData = getCareerPathTrends();

    switch (chartType) {
      case 'bar':
        return (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#9CA3AF' }}
                  tickLine={{ stroke: '#374151' }}
                  axisLine={{ stroke: '#374151' }}
                />
                <YAxis 
                  tick={{ fill: '#9CA3AF' }}
                  tickLine={{ stroke: '#374151' }}
                  axisLine={{ stroke: '#374151' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="count" 
                  fill="#8B5CF6"
                  radius={[4, 4, 0, 0]}
                  stroke="#7C3AED"
                  strokeWidth={1}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case 'pie':
        return (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="count"
                  stroke="#1F2937"
                  strokeWidth={2}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value, entry, index) => (
                    <span style={{ color: '#9CA3AF' }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );

      case 'area':
        return (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#9CA3AF' }}
                  tickLine={{ stroke: '#374151' }}
                  axisLine={{ stroke: '#374151' }}
                />
                <YAxis 
                  tick={{ fill: '#9CA3AF' }}
                  tickLine={{ stroke: '#374151' }}
                  axisLine={{ stroke: '#374151' }}
                />
                <Tooltip content={<CustomTooltip />} />
                {data.map((entry, index) => (
                  <Area
                    key={entry.name}
                    type="monotone"
                    dataKey={entry.name}
                    stackId="1"
                    stroke={entry.color}
                    fill={entry.color}
                    fillOpacity={0.6}
                    strokeWidth={2}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back, {userProfile?.full_name || user?.email || 'User'}!
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={fetchUserData}
                variant="outline"
                size="sm"
                disabled={loading}
                className="flex items-center gap-2"
                title="Refresh data"
              >
                <Activity size={16} className={loading ? 'animate-spin' : ''} />
                Refresh
              </Button>
              <Button
                onClick={() => navigate('/profile')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Edit size={16} />
                Edit Profile
              </Button>
            </div>
          </div>

          {/* User Profile Card */}
          {userProfile && (
            <div className="bg-card rounded-lg p-6 shadow-sm mb-8 border border-border">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-full bg-career-purple/10 flex items-center justify-center">
                    <User className="text-career-purple" size={32} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      {userProfile.full_name || 'No Name Set'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                      {userProfile.email && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail size={16} />
                          <span className="text-sm">{userProfile.email}</span>
                        </div>
                      )}
                      {userProfile.phone_number && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone size={16} />
                          <span className="text-sm">{userProfile.phone_number}</span>
                        </div>
                      )}
                      {userProfile.location && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin size={16} />
                          <span className="text-sm">{userProfile.location}</span>
                        </div>
                      )}
                      {userProfile.created_at && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar size={16} />
                          <span className="text-sm">
                            Member since {new Date(userProfile.created_at).toLocaleDateString('en-US', {
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                    {userProfile.bio && (
                      <p className="text-sm text-muted-foreground mt-3 italic">
                        "{userProfile.bio}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-career-purple/10 flex items-center justify-center">
                  <Calendar className="text-career-purple" size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Quizzes</p>
                  <p className="text-2xl font-bold text-foreground">
                    {userProfile?.quiz_completion_count || quizHistory.length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {quizHistory.length > 0 ? `${quizHistory.length} in history` : 'No quizzes yet'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-career-blue/10 flex items-center justify-center">
                  <TrendingUp className="text-career-blue" size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                  <p className="text-2xl font-bold text-foreground">{getCompletionRate()}%</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {quizHistory.length > 0 ? 'Average performance' : 'Start taking quizzes'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-career-green/10 flex items-center justify-center">
                  <Award className="text-career-green" size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Career Paths</p>
                  <p className="text-2xl font-bold text-foreground">
                    {new Set(quizHistory.map(q => q.career_path)).size}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {quizHistory.length > 0 ? 'Unique paths explored' : 'No paths yet'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-career-yellow/10 flex items-center justify-center">
                  <Trophy className="text-career-yellow" size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                  <p className="text-2xl font-bold text-foreground">
                    {getQuizCompletionStreak()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getQuizCompletionStreak() > 1 ? 'Days in a row!' : 'Keep it up!'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          {quizHistory.length > 0 && (
            <div className="bg-card rounded-lg p-6 shadow-sm mb-8 border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="text-career-purple" size={20} />
                <h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
              </div>
              <div className="space-y-3">
                {quizHistory.slice(0, 5).map((quiz, index) => (
                  <div
                    key={quiz.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-career-purple/10 flex items-center justify-center">
                        <span className="text-xs font-semibold text-career-purple">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{quiz.career_path}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(quiz.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">
                        {quiz.score}/{quiz.total_questions}
                      </p>
                      <p className="text-xs text-muted-foreground">Questions</p>
                    </div>
                  </div>
                ))}
                {quizHistory.length > 5 && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      const element = document.getElementById('quiz-history');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full mt-2"
                  >
                    View All {quizHistory.length} Quizzes
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* AI Analysis Section */}
          <div className="bg-card rounded-lg p-6 shadow-sm mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">AI-Powered Analysis</h2>
            {renderAnalysisSection()}
          </div>

          {/* Enhanced Career Path Distribution Chart */}
          <div className="bg-card rounded-lg p-6 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Career Path Distribution</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Visualize your quiz performance across different career paths
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={chartType === 'bar' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setChartType('bar')}
                  className="flex items-center gap-2"
                >
                  <BarChart3 size={16} />
                  Bar
                </Button>
                <Button
                  variant={chartType === 'pie' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setChartType('pie')}
                  className="flex items-center gap-2"
                >
                  <PieChartIcon size={16} />
                  Pie
                </Button>
                <Button
                  variant={chartType === 'area' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setChartType('area')}
                  className="flex items-center gap-2"
                >
                  <TrendingUp size={16} />
                  Trend
                </Button>
              </div>
            </div>

            {/* Chart Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {getCareerPathStats().slice(0, 4).map((stat, index) => (
                <div key={index} className="bg-muted/50 rounded-lg p-3 text-center">
                  <div 
                    className="w-3 h-3 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: stat.color }}
                  />
                  <p className="text-xs text-muted-foreground">{stat.name}</p>
                  <p className="text-lg font-semibold text-foreground">{stat.count}</p>
                  <p className="text-xs text-muted-foreground">{stat.percentage}%</p>
                </div>
              ))}
            </div>

            {/* Interactive Chart */}
            {renderChart()}

            {/* Chart Legend with Details */}
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium text-foreground mb-3">Career Path Breakdown</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {getCareerPathStats().map((stat, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: stat.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{stat.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {stat.count} quiz{stat.count !== 1 ? 'es' : ''} • {stat.percentage}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quiz History */}
          <div id="quiz-history" className="bg-card rounded-lg p-6 shadow-sm border border-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Quiz History</h2>
                {quizHistory.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {quizHistory.length} quiz{quizHistory.length !== 1 ? 'es' : ''} completed
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {quizHistory.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const isConfirmed = window.confirm(
                        `Are you sure you want to delete all ${quizHistory.length} quiz results? This action cannot be undone.`
                      );
                      if (isConfirmed) {
                        quizHistory.forEach(quiz => handleDeleteQuiz(quiz.id));
                      }
                    }}
                    className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                    title="Delete all quiz results"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Clear All
                  </Button>
                )}
                <Button
                  onClick={() => navigate('/quiz')}
                  className="bg-career-purple hover:bg-career-purple-dark"
                >
                  Take New Quiz
                </Button>
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : quizHistory.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No quiz history yet</p>
                <Button
                  onClick={() => navigate('/quiz')}
                  className="bg-career-purple hover:bg-career-purple-dark"
                >
                  Take Your First Quiz
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {quizHistory.map((quiz, index) => (
                  <div
                    key={quiz.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-background hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-career-purple/10 flex items-center justify-center">
                        <Clock className="text-career-purple" size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{quiz.career_path}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(quiz.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                                                              <div className="flex items-center gap-4">
                       <div className="text-right">
                         <p className="font-medium text-foreground">
                           Completed: {quiz.score}/{quiz.total_questions} questions
                         </p>
                         <p className="text-sm text-muted-foreground">
                           {new Date(quiz.created_at).toLocaleTimeString('en-US', {
                             hour: '2-digit',
                             minute: '2-digit'
                           })}
                         </p>
                       </div>
                       <Button
                         variant="ghost"
                         size="sm"
                         onClick={() => handleDeleteQuiz(quiz.id)}
                         disabled={deletingQuiz === quiz.id}
                         className="text-destructive hover:text-destructive hover:bg-destructive/10 p-2 h-8 w-8 disabled:opacity-50"
                         title="Delete this quiz result"
                       >
                         {deletingQuiz === quiz.id ? (
                           <div className="animate-spin rounded-full h-4 w-4 border-2 border-destructive border-t-transparent" />
                         ) : (
                           <Trash2 size={16} />
                         )}
                       </Button>
                     </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 