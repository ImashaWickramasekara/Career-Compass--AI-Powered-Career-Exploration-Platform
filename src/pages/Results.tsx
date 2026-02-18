import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RoadmapCard from '@/components/roadmap/RoadmapCard';
import { CareerPath } from '@/lib/quiz-data';
import { BookOpen, MessageSquare, Star } from 'lucide-react';

interface LocationState {
  results?: {
    primaryRecommendation: CareerPath;
    secondaryRecommendations: CareerPath[];
    scores: Record<string, number>;
  };
}

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { results } = (location.state as LocationState) || {};
  
  // If no results, redirect to quiz
  if (!results) {
    return (
      <div className="container mx-auto py-20 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">No Results Found</h1>
        <p className="mb-8">It looks like you haven't taken the quiz yet.</p>
        <Link to="/quiz">
          <Button className="bg-career-purple hover:bg-career-purple-dark">Take the Quiz</Button>
        </Link>
      </div>
    );
  }
  
  const { primaryRecommendation, secondaryRecommendations } = results;

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-career-purple to-career-blue bg-clip-text text-transparent">
          Your Career Path Results
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Based on your responses, we've identified the ideal career path for you.
        </p>
      </div>

      <div className="mb-12">
        <Tabs defaultValue="primary" className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList>
              <TabsTrigger value="primary" className="text-base px-6">
                Primary Recommendation
              </TabsTrigger>
              <TabsTrigger value="secondary" className="text-base px-6">
                Alternative Paths
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="primary">
            <div className="max-w-3xl mx-auto">
              <RoadmapCard careerPath={primaryRecommendation} isPrimary={true} />
            </div>
          </TabsContent>
          
          <TabsContent value="secondary">
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {secondaryRecommendations.map((path, index) => (
                <RoadmapCard key={index} careerPath={path} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
        <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 rounded-full bg-career-purple/10 text-career-purple flex items-center justify-center mx-auto mb-4">
            <BookOpen size={24} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Explore Resources</h3>
          <p className="text-gray-600 mb-4">
            Discover curated learning materials to help you succeed in your chosen path.
          </p>
          <Link to="/resources">
            <Button variant="outline" className="w-full">View Resources</Button>
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 rounded-full bg-career-purple/10 text-career-purple flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={24} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Ask AI Assistant</h3>
          <p className="text-gray-600 mb-4">
            Have questions about your career path? Our AI assistant can help.
          </p>
          <Link to="/assistant">
            <Button variant="outline" className="w-full">Chat Now</Button>
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 rounded-full bg-career-purple/10 text-career-purple flex items-center justify-center mx-auto mb-4">
            <Star size={24} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Rate Results</h3>
          <p className="text-gray-600 mb-4">
            Was this recommendation helpful? Let us know your feedback.
          </p>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/feedback')}
          >
            Give Feedback
          </Button>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Didn't quite get that one? Try a new quiz!</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          No worries — challenge yourself with a fresh set of questions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-career-purple hover:bg-career-purple-dark"
            onClick={() => navigate('/dashboard')}
          >
            View Dashboard
          </Button>
          <Link to="/quiz">
            <Button size="lg" variant="outline">
              Take Quiz Again
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Results;
