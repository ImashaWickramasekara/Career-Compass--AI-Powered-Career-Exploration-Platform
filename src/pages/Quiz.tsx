import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { quizQuestions, calculateResults } from '@/lib/quiz-data';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const Quiz = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quizStarted, setQuizStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<{
    questionId: number;
    selectedOption: string;
    scores: Record<string, number>;
  }>>([]);

  const totalQuestions = quizQuestions.length;
  const currentQuestion = quizQuestions[currentQuestionIndex];
  
  const handleStartQuiz = () => {
    setQuizStarted(true);
  };
  
  const handleSelectOption = (optionId: string) => {
    const selectedOptionData = currentQuestion.options.find(opt => opt.id === optionId);
    
    if (selectedOptionData) {
      setAnswers(prev => {
        // Remove any existing answer for this question
        const filteredAnswers = prev.filter(a => a.questionId !== currentQuestion.id);
        // Add the new answer
        return [...filteredAnswers, {
          questionId: currentQuestion.id,
          selectedOption: optionId,
          scores: selectedOptionData.score
        }];
      });
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz completed, show completion screen
      setCurrentQuestionIndex(totalQuestions);
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const getCareerPath = (answers: Array<{ questionId: number; selectedOption: string; scores: Record<string, number> }>) => {
    const scores: Record<string, number> = {
      frontend: 0,
      backend: 0,
      data: 0,
      devops: 0,
      security: 0,
      design: 0
    };

    // Calculate scores based on answers
    answers.forEach(answer => {
      Object.entries(answer.scores).forEach(([field, value]) => {
        scores[field] = (scores[field] || 0) + value;
      });
    });

    // Find the career path with the highest score
    const maxScore = Math.max(...Object.values(scores));
    const careerPath = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0];
    
    return careerPath?.charAt(0).toUpperCase() + careerPath?.slice(1) || 'General';
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to save your results",
      });
      return;
    }

    if (answers.length !== totalQuestions) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please answer all questions before submitting",
      });
      return;
    }

    setLoading(true);
    try {
      // Calculate results first
      const results = calculateResults(
        answers.reduce((acc, answer) => ({
          ...acc,
          [answer.questionId]: answer.selectedOption
        }), {})
      );

      // Try to save to database
      const careerPath = getCareerPath(answers);
      
      // Calculate score as number of correct answers (each question is worth 1 point)
      // Since this is a preference-based quiz, we'll give 1 point per answered question
      const totalScore = answers.length;

      const { data: savedQuiz, error } = await supabase
        .from('quiz_results')
        .insert([
          {
            user_id: user.id,
            career_path: careerPath,
            score: totalScore,
            total_questions: totalQuestions,
            answers: answers
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error saving quiz results:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        toast({
          variant: "destructive",
          title: "Warning",
          description: `Quiz completed but couldn't save results: ${error.message}. You can still view your results.`,
        });
      } else {
        console.log('Quiz results saved successfully:', savedQuiz);
        toast({
          title: "Success!",
          description: "Your quiz results have been saved to your dashboard",
        });
      }

      // Navigate to results page with the calculated results
      navigate('/results', { 
        state: { results }
      });
    } catch (error) {
      console.error('Detailed submission error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error processing your results. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!quizStarted) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Card className="w-full max-w-2xl mx-auto border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-career-gray-dark">Career Path Quiz</CardTitle>
            <CardDescription className="text-lg">
              Discover your ideal IT career path by answering a few questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-gray-700">
                This quiz will help identify which IT career path best matches your skills, interests, and work style preferences. It only takes about 5 minutes to complete.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-career-gray-dark mb-2">What to expect:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-career-purple text-white flex items-center justify-center text-xs">1</div>
                    <span>5 multiple-choice questions about your preferences</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-career-purple text-white flex items-center justify-center text-xs">2</div>
                    <span>AI-powered analysis of your responses</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-career-purple text-white flex items-center justify-center text-xs">3</div>
                    <span>Personalized career path recommendation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-career-purple text-white flex items-center justify-center text-xs">4</div>
                    <span>Detailed learning roadmap for your journey</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              size="lg" 
              onClick={handleStartQuiz}
              className="bg-career-purple hover:bg-career-purple-dark"
            >
              Start Quiz
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (currentQuestionIndex >= totalQuestions) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Quiz Complete!</h2>
              <p className="text-foreground mb-4">
                You've answered {answers.length} out of {totalQuestions} questions.
              </p>
              {answers.length === totalQuestions ? (
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-career-purple hover:bg-career-purple-dark"
                >
                  {loading ? 'Saving...' : 'View Results'}
                </Button>
              ) : (
                <div className="space-y-4">
                  <p className="text-destructive">Please answer all questions before submitting.</p>
                  <Button
                    onClick={() => setCurrentQuestionIndex(0)}
                    className="w-full bg-career-purple hover:bg-career-purple-dark"
                  >
                    Return to Quiz
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </h2>
              <p className="text-foreground">{currentQuestion.question}</p>
            </div>

            <div className="space-y-4">
              {currentQuestion.options.map((option) => (
                <Button
                  key={option.id}
                  variant="outline"
                  className={`w-full justify-start p-4 h-auto ${
                    answers.find(a => a.questionId === currentQuestion.id)?.selectedOption === option.id
                      ? 'border-career-purple bg-career-purple/10'
                      : ''
                  }`}
                  onClick={() => handleSelectOption(option.id)}
                >
                  <span className="text-left">{option.text}</span>
                </Button>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              <Button
                onClick={handleNextQuestion}
                disabled={!answers.find(a => a.questionId === currentQuestion.id)}
                className="bg-career-purple hover:bg-career-purple-dark"
              >
                {currentQuestionIndex === totalQuestions - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
