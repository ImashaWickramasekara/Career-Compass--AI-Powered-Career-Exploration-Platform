import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import HeroAnimation from '@/components/HeroAnimation';
import { BookOpen, Compass, BarChart, MessageSquare } from 'lucide-react';
import FloatingChat from '@/components/chat/FloatingChat';

interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
  date: string;
}

const Home = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    // Get testimonials from localStorage
    const storedTestimonials = JSON.parse(localStorage.getItem('successStories') || '[]');
    // Sort by date (newest first) and take the latest 3
    const sortedTestimonials = storedTestimonials
      .sort((a: Testimonial, b: Testimonial) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
    setTestimonials(sortedTestimonials);
  }, []);

  // Features data
  const features = [
    {
      icon: <Compass className="h-10 w-10 text-career-purple" />,
      title: "Personalized Career Path",
      description: "Take our AI-powered quiz to discover the IT career path that best matches your skills and interests."
    },
    {
      icon: <BarChart className="h-10 w-10 text-career-purple" />,
      title: "Detailed Roadmap",
      description: "Get a step-by-step roadmap with resources, skills to learn, and milestones for your chosen career."
    },
    {
      icon: <BookOpen className="h-10 w-10 text-career-purple" />,
      title: "Learning Resources",
      description: "Access curated learning materials including courses, tutorials, and videos for each career path."
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-career-purple" />,
      title: "AI Career Assistant",
      description: "Ask questions and get guidance from our AI career assistant to help you along your journey."
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-career-purple-light via-career-purple to-career-blue text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
                Find Your Perfect 
                <span className="block text-career-blue-light"> IT Career Path</span>
              </h1>
              <p className="text-xl mb-8 text-gray-100 max-w-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Not sure which direction to take in the IT industry? Let our AI-powered quiz guide you to the perfect career path that matches your skills and personality.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <Link to="/quiz">
                  <Button size="lg" className="bg-white hover:bg-gray-100 text-career-purple font-semibold">
                    Take Career Quiz
                  </Button>
                </Link>
                <Link to="/resources">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 dark:text-white dark:border-white text-black border-black">
                    Explore Resources
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <HeroAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-career-gray-dark">Discover Your Path With AI</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform helps IT freshers find their ideal career path through personalized recommendations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-md hover:shadow-xl transition-shadow card-hover">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-career-purple/10 w-16 h-16 flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-career-white-dark">{feature.title}</h3>
                  <p className="text-white-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-career-white-dark">How It Works</h2>
            <p className="text-xl text-white-600 max-w-2xl mx-auto">
              Finding your ideal career path is simple with our three-step process.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="rounded-full bg-career-purple text-white w-12 h-12 flex items-center justify-center mx-auto mb-6">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-career-white-dark">Take the Quiz</h3>
              <p className="text-white-600">
                Answer a series of questions about your preferences, skills, and interests.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center">
              <div className="rounded-full bg-career-purple text-white w-12 h-12 flex items-center justify-center mx-auto mb-6">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-career-white-dark">Get Your Results</h3>
              <p className="text-white-600">
                Our AI analyzes your responses to identify career paths that suit you best.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center">
              <div className="rounded-full bg-career-purple text-white w-12 h-12 flex items-center justify-center mx-auto mb-6">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-career-white-dark">Follow Your Roadmap</h3>
              <p className="text-white-600">
                Access a personalized roadmap with resources to guide your career journey.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/quiz">
              <Button size="lg" className="bg-career-purple hover:bg-career-purple-dark text-white">
                Start Your Journey
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-career-gray-dark">Success Stories</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how CareerCompass has helped others find their ideal career path.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.length > 0 ? (
              testimonials.map((testimonial, index) => (
                <Card key={index} className="border-none shadow-md card-hover">
                  <CardContent className="pt-6">
                    <div className="mb-6">
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={i} 
                          className={`text-xl ${
                            i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-white-600 mb-6 italic">"{testimonial.text}"</p>
                    <div>
                      <p className="font-medium text-career-white-dark">{testimonial.name}</p>
                      <p className="text-sm text-career-purple">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500">
                No success stories yet. Be the first to share your story!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-career-purple text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Discover Your Perfect IT Career Path?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Take our AI-powered quiz today and get a personalized roadmap to guide your career journey.
            </p>
            <Link to="/quiz">
              <Button size="lg" className="bg-white hover:bg-gray-100 text-career-purple font-semibold">
                Take the Quiz Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Floating Chat */}
      <FloatingChat />
    </div>
  );
};

export default Home;
