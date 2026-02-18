import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = 'AIzaSyBV0JS03hZFdAlAE5Veo6j1q4sJKv14n6s';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export interface QuizAnalysis {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  careerInsights: string[];
}

export async function analyzeQuizResults(quizHistory: any[]): Promise<QuizAnalysis> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Prepare the quiz history data for analysis
    const quizData = quizHistory.map(quiz => ({
      careerPath: quiz.career_path,
      score: (quiz.score / quiz.total_questions) * 100,
      date: new Date(quiz.created_at).toLocaleDateString()
    }));

    const prompt = `
      Analyze the following quiz results and provide insights:
      ${JSON.stringify(quizData, null, 2)}

      Please provide a detailed analysis in the following format:
      1. List 3-5 key strengths based on the quiz performance
      2. List 3-5 areas for improvement
      3. Provide 3-5 specific recommendations for career development
      4. Share 3-5 insights about potential career paths

      Format the response as a JSON object with the following structure:
      {
        "strengths": ["strength1", "strength2", ...],
        "weaknesses": ["weakness1", "weakness2", ...],
        "recommendations": ["recommendation1", "recommendation2", ...],
        "careerInsights": ["insight1", "insight2", ...]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    const analysis = JSON.parse(text);
    return analysis;
  } catch (error) {
    console.error('Error analyzing quiz results:', error);
    return {
      strengths: [],
      weaknesses: [],
      recommendations: [],
      careerInsights: []
    };
  }
} 