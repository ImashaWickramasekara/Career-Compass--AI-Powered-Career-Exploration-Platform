
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2, Download, BookOpen } from 'lucide-react';
import { CareerPath } from '@/lib/quiz-data';

interface RoadmapCardProps {
  careerPath: CareerPath;
  isPrimary?: boolean;
}

const RoadmapCard: React.FC<RoadmapCardProps> = ({ careerPath, isPrimary = false }) => {
  return (
    <Card className={`border-0 shadow-lg overflow-hidden ${isPrimary ? 'ring-2 ring-career-purple' : ''}`}>
      <CardHeader className={`${isPrimary ? 'bg-career-purple text-white' : 'bg-gray-50'}`}>
        <div className="flex justify-between items-center">
          <CardTitle className={`text-xl font-bold ${isPrimary ? 'text-white' : 'text-career-gray-dark'}`}>
            {careerPath.title}
          </CardTitle>
          {isPrimary && (
            <Badge variant="outline" className="bg-white text-career-purple border-white">
              Recommended
            </Badge>
          )}
        </div>
        <CardDescription className={`${isPrimary ? 'text-gray-100' : 'text-gray-500'}`}>
          {careerPath.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-career-gray-dark">Key Skills</h3>
          <div className="flex flex-wrap gap-2">
            {careerPath.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="bg-gray-100">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-career-gray-dark">Your Learning Path</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="font-medium text-career-purple flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-career-purple text-white flex items-center justify-center text-xs">1</span>
                <span>Beginner Stage</span>
              </h4>
              <ul className="ml-8 space-y-2 text-gray-700">
                {careerPath.roadmap.beginner.map((step, index) => (
                  <li key={index} className="list-disc">{step}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-career-purple flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-career-purple text-white flex items-center justify-center text-xs">2</span>
                <span>Intermediate Stage</span>
              </h4>
              <ul className="ml-8 space-y-2 text-gray-700">
                {careerPath.roadmap.intermediate.map((step, index) => (
                  <li key={index} className="list-disc">{step}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-career-purple flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-career-purple text-white flex items-center justify-center text-xs">3</span>
                <span>Advanced Stage</span>
              </h4>
              <ul className="ml-8 space-y-2 text-gray-700">
                {careerPath.roadmap.advanced.map((step, index) => (
                  <li key={index} className="list-disc">{step}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-career-gray-dark">Learning Resources</h3>
          <div className="space-y-3">
            {careerPath.learningResources.map((resource, index) => (
              <a 
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-career-purple/10 text-career-purple flex items-center justify-center mr-3">
                  <BookOpen size={16} />
                </div>
                <div>
                  <p className="font-medium text-career-gray-dark">{resource.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{resource.type}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button className="flex-1 gap-2" variant="outline">
            <Share2 size={18} /> Share Roadmap
          </Button>
          <Button className="flex-1 gap-2 bg-career-purple hover:bg-career-purple-dark">
            <Download size={18} /> Download PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoadmapCard;
