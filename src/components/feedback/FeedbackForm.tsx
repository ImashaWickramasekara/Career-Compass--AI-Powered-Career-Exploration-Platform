import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from 'lucide-react';

const FeedbackForm = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState({
    name: '',
    role: '',
    text: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get existing feedbacks from localStorage
    const existingFeedbacks = JSON.parse(localStorage.getItem('successStories') || '[]');
    
    // Add new feedback
    const newFeedback = {
      ...feedback,
      rating,
      date: new Date().toISOString()
    };
    
    // Save updated feedbacks
    localStorage.setItem('successStories', JSON.stringify([...existingFeedbacks, newFeedback]));
    
    // Navigate back to home page
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center text-career-purple">Share Your Success Story</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={feedback.name}
                onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Your Role</Label>
              <Input
                id="role"
                value={feedback.role}
                onChange={(e) => setFeedback({ ...feedback, role: e.target.value })}
                placeholder="e.g., Junior Frontend Developer"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback">Your Story</Label>
              <Textarea
                id="feedback"
                value={feedback.text}
                onChange={(e) => setFeedback({ ...feedback, text: e.target.value })}
                placeholder="Share your experience with CareerCompass..."
                className="min-h-[150px]"
                required
              />
            </div>

            <div className="flex justify-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-career-purple hover:bg-career-purple-dark"
              >
                Submit Feedback
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackForm; 