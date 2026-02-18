
import React from 'react';

const HeroAnimation = () => {
  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-career-purple-light via-career-purple to-career-blue opacity-10"></div>
      
      {/* Animated elements */}
      <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-career-purple rounded-full opacity-30 animate-float"></div>
      <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-career-blue rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-career-purple-light rounded-full opacity-25 animate-float" style={{ animationDelay: '2s' }}></div>
      
      {/* Code-like elements */}
      <div className="absolute top-1/4 right-1/3">
        <div className="w-32 h-3 rounded bg-career-purple opacity-20 animate-pulse-slow"></div>
        <div className="w-48 h-3 mt-3 rounded bg-career-blue opacity-15 animate-pulse-slow" style={{ animationDelay: '0.5s' }}></div>
        <div className="w-24 h-3 mt-3 rounded bg-career-purple-light opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="absolute bottom-1/3 left-1/5">
        <div className="w-40 h-3 rounded bg-career-blue opacity-15 animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
        <div className="w-24 h-3 mt-3 rounded bg-career-purple opacity-20 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="w-32 h-3 mt-3 rounded bg-career-purple-light opacity-25 animate-pulse-slow" style={{ animationDelay: '2.5s' }}></div>
      </div>
      
      {/* Career path graphic representation */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-1 h-40 bg-career-purple-light opacity-30"></div>
        <div className="w-6 h-6 rounded-full bg-career-purple absolute -left-2.5 top-0 opacity-60"></div>
        <div className="w-6 h-6 rounded-full bg-career-purple absolute -left-2.5 top-1/3 opacity-60"></div>
        <div className="w-6 h-6 rounded-full bg-career-blue absolute -left-2.5 top-2/3 opacity-60"></div>
        <div className="w-6 h-6 rounded-full bg-career-blue absolute -left-2.5 bottom-0 opacity-60"></div>
      </div>
    </div>
  );
};

export default HeroAnimation;
