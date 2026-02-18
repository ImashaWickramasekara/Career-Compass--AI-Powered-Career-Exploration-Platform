import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Bot, X } from 'lucide-react';
import ChatBot from './ChatBot';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-white rounded-lg shadow-xl border border-gray-200">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="font-semibold text-career-purple">AI Career Assistant</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="h-[calc(100%-4rem)] overflow-hidden">
            <ChatBot />
          </div>
        </div>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setIsOpen(true)}
                className="h-14 w-14 rounded-full bg-career-purple hover:bg-career-purple-dark shadow-lg flex items-center justify-center"
              >
                <Bot className="h-6 w-6 text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-career-purple text-white border-none">
              <p>How can I help you?</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default FloatingChat; 