
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuizQuestion } from '@/lib/quiz-data';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface QuizCardProps {
  question: QuizQuestion;
  selectedOption: string | null;
  onSelectOption: (id: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
  currentStep: number;
  totalSteps: number;
}

const QuizCard: React.FC<QuizCardProps> = ({
  question,
  selectedOption,
  onSelectOption,
  onNext,
  onPrevious,
  isFirst,
  isLast,
  currentStep,
  totalSteps
}) => {
  return (
    <Card className="w-full max-w-2xl mx-auto border-0 shadow-lg animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">Question {currentStep} of {totalSteps}</span>
          <div className="flex gap-1">
            {[...Array(totalSteps)].map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full w-6 ${i < currentStep ? 'bg-career-purple' : 'bg-gray-200'}`}
              />
            ))}
          </div>
        </div>
        <CardTitle className="text-xl font-bold text-career-gray-dark">{question.question}</CardTitle>
        <CardDescription>Choose the option that best describes you</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedOption || ''} className="space-y-4">
          {question.options.map((option) => (
            <div key={option.id} className="flex items-start space-x-3 p-3 rounded-md hover:bg-gray-50">
              <RadioGroupItem 
                value={option.id} 
                id={`option-${option.id}`} 
                onClick={() => onSelectOption(option.id)}
              />
              <Label 
                htmlFor={`option-${option.id}`}
                className="text-base cursor-pointer font-normal text-gray-700 leading-relaxed"
              >
                {option.text}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isFirst}
          className={isFirst ? 'opacity-0 cursor-default' : ''}
        >
          Previous
        </Button>
        <Button
          onClick={onNext}
          disabled={!selectedOption}
          className="bg-career-purple hover:bg-career-purple-dark"
        >
          {isLast ? 'See Results' : 'Next Question'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizCard;
