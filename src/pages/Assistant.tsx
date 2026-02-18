import ChatBot from '@/components/chat/ChatBot';

export default function Assistant() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">AI Career Assistant</h1>
            <p className="text-muted-foreground">
              Get personalized guidance and answers to your career questions
            </p>
          </div>
          <ChatBot />
        </div>
      </div>
    </div>
  );
} 