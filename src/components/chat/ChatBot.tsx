import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Send, Loader2, BookOpen, Target, TrendingUp, Lightbulb, ArrowRight, CheckCircle, Clock, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// DeepSeek API configuration
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = import.meta.env.VITE_DEEPSEEK_API_URL;

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface QuickAction {
  label: string;
  prompt: string;
  icon: React.ReactNode;
  category: 'career' | 'skills' | 'learning' | 'general';
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const quickActions: QuickAction[] = [
    {
      label: "Career Path Analysis",
      prompt: "I want to understand my career path better. Can you analyze my current situation and suggest next steps?",
      icon: <Target className="h-4 w-4" />,
      category: "career"
    },
    {
      label: "Skill Assessment",
      prompt: "What skills should I focus on developing for my career goals?",
      icon: <TrendingUp className="h-4 w-4" />,
      category: "skills"
    },
    {
      label: "Learning Roadmap",
      prompt: "Create a learning roadmap for my career development",
      icon: <BookOpen className="h-4 w-4" />,
      category: "learning"
    },
    {
      label: "Interview Prep",
      prompt: "Help me prepare for job interviews in my field",
      icon: <Lightbulb className="h-4 w-4" />,
      category: "general"
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatMessage = (content: string) => {
    // Split content into sections based on common patterns
    const sections = content.split(/(?=^#|\*\*|\d+\.|•|- )/gm);
    
    return sections.map((section, index) => {
      const trimmedSection = section.trim();
      if (!trimmedSection) return null;

      // Handle headers
      if (trimmedSection.startsWith('#')) {
        const level = trimmedSection.match(/^#+/)?.[0].length || 1;
        const text = trimmedSection.replace(/^#+\s*/, '');
        return (
          <div key={index} className={`font-bold mb-2 ${
            level === 1 ? 'text-lg text-career-purple' : 
            level === 2 ? 'text-base text-gray-800' : 'text-sm text-gray-700'
          }`}>
            {text}
          </div>
        );
      }

      // Handle bold text
      if (trimmedSection.startsWith('**') && trimmedSection.endsWith('**')) {
        const text = trimmedSection.slice(2, -2);
        return <strong key={index} className="font-semibold text-gray-800">{text}</strong>;
      }

      // Handle numbered lists
      if (/^\d+\./.test(trimmedSection)) {
        const text = trimmedSection.replace(/^\d+\.\s*/, '');
        return (
          <div key={index} className="flex items-start gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <span>{text}</span>
          </div>
        );
      }

      // Handle bullet points
      if (trimmedSection.startsWith('•') || trimmedSection.startsWith('- ')) {
        const text = trimmedSection.replace(/^[•-]\s*/, '');
        return (
          <div key={index} className="flex items-start gap-2 mb-2">
            <div className="w-2 h-2 bg-career-purple rounded-full mt-2 flex-shrink-0" />
            <span>{text}</span>
          </div>
        );
      }

      // Handle regular paragraphs
      return (
        <p key={index} className="mb-2 leading-relaxed">
          {trimmedSection}
        </p>
      );
    });
  };

  const handleQuickAction = (action: QuickAction) => {
    setInput(action.prompt);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: userMessage,
      timestamp: new Date()
    }]);
    setIsLoading(true);

    try {
      console.log('Sending request to DeepSeek API...');
      
      // Enhanced system prompt for better structured responses
      const systemPrompt = `You are an AI Career Assistant. Provide structured, actionable advice with the following format:
      
1. Start with a clear summary or main point
2. Use bullet points (•) for key points
3. Use numbered lists (1. 2. 3.) for step-by-step instructions
4. Use **bold text** for important concepts
5. Organize information with clear sections
6. End with actionable next steps
7. Keep responses concise but comprehensive
8. Use a friendly, encouraging tone

Focus on practical, implementable advice.`;

      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (!data.choices || !data.choices[0]?.message?.content) {
        throw new Error('Invalid response format from API');
      }

      const assistantMessage = data.choices[0].message.content;
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: assistantMessage,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Detailed error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response from AI. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[600px] bg-background rounded-lg border shadow-sm">
      {/* Chat Header */}
      <div className="p-4 border-b bg-gradient-to-r from-career-purple to-career-purple-dark">
        <h2 className="text-lg font-semibold text-white">AI Career Assistant</h2>
        <p className="text-sm text-purple-100">
          Get personalized career guidance and actionable insights
        </p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="space-y-4">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-career-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-8 w-8 text-career-purple" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Welcome to Your Career Assistant!</h3>
              <p className="text-muted-foreground mb-6">
                I'm here to help you navigate your career journey with personalized advice and actionable insights.
              </p>
            </div>
            
            {/* Quick Actions */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 text-center">Quick Start</h4>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action)}
                    className="h-auto p-3 flex flex-col items-center gap-2 text-xs hover:bg-career-purple/5 hover:border-career-purple/30"
                  >
                    {action.icon}
                    <span className="text-center leading-tight">{action.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                message.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-medium ${
                  message.role === 'user' ? 'text-career-purple' : 'text-muted-foreground'
                }`}>
                  {message.role === 'user' ? 'You' : 'AI Assistant'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatTime(message.timestamp)}
                </span>
              </div>
              
              {message.role === 'assistant' ? (
                <Card className="max-w-[90%] border-career-purple/20 shadow-sm">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      {formatMessage(message.content)}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="max-w-[85%] rounded-lg p-4 bg-career-purple text-white">
                  <div className="whitespace-pre-wrap break-words">
                    {message.content}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t bg-gray-50">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your career, skills, or learning goals..."
            disabled={isLoading}
            className="flex-1 border-gray-200 focus:border-career-purple focus:ring-career-purple/20"
          />
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-career-purple hover:bg-career-purple-dark"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {/* Quick Action Pills */}
        {messages.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {quickActions.slice(0, 2).map((action, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => handleQuickAction(action)}
                className="h-7 px-3 text-xs text-career-purple hover:bg-career-purple/10"
              >
                {action.icon}
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatBot;