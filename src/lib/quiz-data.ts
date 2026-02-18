
export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    id: string;
    text: string;
    score: Record<string, number>;
  }[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Which aspect of technology interests you the most?",
    options: [
      {
        id: "a",
        text: "Creating visually appealing and user-friendly interfaces",
        score: { frontend: 3, design: 4, backend: 0, data: 0, devops: 0, security: 0 }
      },
      {
        id: "b",
        text: "Building systems and services that power applications",
        score: { frontend: 0, design: 0, backend: 4, data: 1, devops: 2, security: 1 }
      },
      {
        id: "c",
        text: "Working with data to derive insights and patterns",
        score: { frontend: 0, design: 0, backend: 1, data: 4, devops: 0, security: 1 }
      },
      {
        id: "d",
        text: "Ensuring systems are secure, scalable and reliable",
        score: { frontend: 0, design: 0, backend: 1, data: 0, devops: 3, security: 4 }
      }
    ]
  },
  {
    id: 2,
    question: "How would you describe your problem-solving approach?",
    options: [
      {
        id: "a",
        text: "Visual and creative, focusing on the user experience",
        score: { frontend: 3, design: 4, backend: 0, data: 0, devops: 0, security: 0 }
      },
      {
        id: "b",
        text: "Analytical and logical, breaking down complex problems",
        score: { frontend: 1, design: 0, backend: 3, data: 4, devops: 2, security: 2 }
      },
      {
        id: "c",
        text: "Detail-oriented and methodical, ensuring everything works correctly",
        score: { frontend: 2, design: 1, backend: 2, data: 1, devops: 3, security: 4 }
      },
      {
        id: "d",
        text: "Innovative and adaptable, finding unique solutions",
        score: { frontend: 2, design: 3, backend: 2, data: 2, devops: 2, security: 1 }
      }
    ]
  },
  {
    id: 3,
    question: "What type of projects would you enjoy working on?",
    options: [
      {
        id: "a",
        text: "Building websites and mobile applications",
        score: { frontend: 4, design: 3, backend: 1, data: 0, devops: 0, security: 0 }
      },
      {
        id: "b",
        text: "Developing server-side architecture and APIs",
        score: { frontend: 0, design: 0, backend: 4, data: 1, devops: 2, security: 1 }
      },
      {
        id: "c",
        text: "Creating data pipelines and analytics dashboards",
        score: { frontend: 1, design: 1, backend: 1, data: 4, devops: 1, security: 0 }
      },
      {
        id: "d",
        text: "Setting up infrastructure and monitoring systems",
        score: { frontend: 0, design: 0, backend: 1, data: 1, devops: 4, security: 2 }
      }
    ]
  },
  {
    id: 4,
    question: "Which of these tasks sounds most appealing to you?",
    options: [
      {
        id: "a",
        text: "Designing layouts and implementing responsive interfaces",
        score: { frontend: 4, design: 4, backend: 0, data: 0, devops: 0, security: 0 }
      },
      {
        id: "b",
        text: "Writing code to handle business logic and data processing",
        score: { frontend: 1, design: 0, backend: 4, data: 2, devops: 1, security: 0 }
      },
      {
        id: "c",
        text: "Analyzing data and creating models to predict trends",
        score: { frontend: 0, design: 0, backend: 1, data: 4, devops: 0, security: 0 }
      },
      {
        id: "d",
        text: "Testing systems for vulnerabilities and implementing security measures",
        score: { frontend: 0, design: 0, backend: 1, data: 0, devops: 2, security: 4 }
      }
    ]
  },
  {
    id: 5,
    question: "How comfortable are you with mathematics and statistics?",
    options: [
      {
        id: "a",
        text: "I'm more creatively inclined than mathematically oriented",
        score: { frontend: 3, design: 4, backend: 1, data: 0, devops: 1, security: 1 }
      },
      {
        id: "b",
        text: "I'm reasonably comfortable with math but don't use it heavily",
        score: { frontend: 2, design: 1, backend: 3, data: 1, devops: 3, security: 2 }
      },
      {
        id: "c",
        text: "I enjoy working with numbers, statistics and patterns",
        score: { frontend: 1, design: 0, backend: 2, data: 4, devops: 1, security: 2 }
      },
      {
        id: "d",
        text: "I'm comfortable with applied math in specific contexts",
        score: { frontend: 1, design: 1, backend: 3, data: 3, devops: 2, security: 3 }
      }
    ]
  }
];

export interface CareerPath {
  id: string;
  title: string;
  description: string;
  skills: string[];
  roadmap: {
    beginner: string[];
    intermediate: string[];
    advanced: string[];
  };
  learningResources: {
    name: string;
    url: string;
    type: string;
  }[];
}

export const careerPaths: Record<string, CareerPath> = {
  frontend: {
    id: "frontend",
    title: "Frontend Development",
    description: "Build user interfaces and interactive web applications that provide great user experiences.",
    skills: ["HTML/CSS", "JavaScript", "React/Vue/Angular", "Responsive Design", "Web Accessibility", "Performance Optimization"],
    roadmap: {
      beginner: [
        "Learn HTML5, CSS3 fundamentals",
        "Learn JavaScript basics and DOM manipulation",
        "Build simple static websites",
        "Learn responsive design principles"
      ],
      intermediate: [
        "Master a frontend framework (React, Vue, or Angular)",
        "Learn state management (Redux, Vuex, etc.)",
        "Study CSS preprocessors and modern CSS (Sass, Tailwind)",
        "Understand API integration and asynchronous JavaScript"
      ],
      advanced: [
        "Learn advanced patterns and architecture",
        "Master performance optimization techniques",
        "Implement accessibility standards",
        "Build complex single-page applications"
      ]
    },
    learningResources: [
      {
        name: "Frontend Masters",
        url: "https://frontendmasters.com/",
        type: "course"
      },
      {
        name: "MDN Web Docs",
        url: "https://developer.mozilla.org/en-US/",
        type: "documentation"
      },
      {
        name: "CSS-Tricks",
        url: "https://css-tricks.com/",
        type: "blog"
      },
      {
        name: "React Documentation",
        url: "https://reactjs.org/docs/getting-started.html",
        type: "documentation"
      }
    ]
  },
  backend: {
    id: "backend",
    title: "Backend Development",
    description: "Build server-side applications, APIs, and services that power web applications.",
    skills: ["Node.js/Python/Java/C#", "Databases (SQL/NoSQL)", "API Design", "Authentication/Authorization", "Server Architecture", "Performance Optimization"],
    roadmap: {
      beginner: [
        "Learn a server-side language (Node.js, Python, etc.)",
        "Understand HTTP protocols and RESTful services",
        "Learn database fundamentals (SQL and NoSQL)",
        "Build simple CRUD APIs"
      ],
      intermediate: [
        "Master a backend framework (Express, Django, Spring, etc.)",
        "Implement authentication and authorization",
        "Learn database optimization and transactions",
        "Set up unit and integration testing"
      ],
      advanced: [
        "Design scalable microservices architecture",
        "Implement advanced data modeling",
        "Add caching strategies and message queues",
        "Master security best practices"
      ]
    },
    learningResources: [
      {
        name: "Node.js Documentation",
        url: "https://nodejs.org/en/docs/",
        type: "documentation"
      },
      {
        name: "The Odin Project",
        url: "https://www.theodinproject.com/",
        type: "course"
      },
      {
        name: "MongoDB University",
        url: "https://university.mongodb.com/",
        type: "course"
      },
      {
        name: "REST API Design Best Practices",
        url: "https://restfulapi.net/",
        type: "documentation"
      }
    ]
  },
  data: {
    id: "data",
    title: "Data Science & Analytics",
    description: "Analyze data, build models, and derive insights to help organizations make data-driven decisions.",
    skills: ["Python/R", "SQL", "Statistics", "Machine Learning", "Data Visualization", "Big Data Technologies"],
    roadmap: {
      beginner: [
        "Learn Python or R programming",
        "Master SQL for data retrieval",
        "Study statistics and probability fundamentals",
        "Learn data visualization basics (Matplotlib, ggplot)"
      ],
      intermediate: [
        "Build machine learning models with scikit-learn",
        "Master data cleaning and preprocessing",
        "Learn advanced data visualization (Tableau, D3.js)",
        "Implement statistical analyses"
      ],
      advanced: [
        "Study deep learning with TensorFlow or PyTorch",
        "Work with big data technologies (Hadoop, Spark)",
        "Implement complex predictive models",
        "Learn data engineering principles"
      ]
    },
    learningResources: [
      {
        name: "Kaggle",
        url: "https://www.kaggle.com/",
        type: "platform"
      },
      {
        name: "DataCamp",
        url: "https://www.datacamp.com/",
        type: "course"
      },
      {
        name: "Towards Data Science",
        url: "https://towardsdatascience.com/",
        type: "blog"
      },
      {
        name: "Python for Data Science Handbook",
        url: "https://jakevdp.github.io/PythonDataScienceHandbook/",
        type: "book"
      }
    ]
  },
  devops: {
    id: "devops",
    title: "DevOps & Cloud",
    description: "Build, deploy, and maintain infrastructure and pipelines to deliver reliable software efficiently.",
    skills: ["Linux", "Containerization (Docker)", "CI/CD", "Cloud Platforms (AWS, Azure, GCP)", "Infrastructure as Code", "Monitoring & Logging"],
    roadmap: {
      beginner: [
        "Learn Linux fundamentals",
        "Understand networking basics",
        "Study containerization with Docker",
        "Learn a cloud platform (AWS, Azure, or GCP)"
      ],
      intermediate: [
        "Master container orchestration (Kubernetes)",
        "Set up CI/CD pipelines",
        "Learn Infrastructure as Code (Terraform, CloudFormation)",
        "Implement monitoring and logging solutions"
      ],
      advanced: [
        "Design highly available infrastructure",
        "Implement security best practices",
        "Master advanced automation and scripting",
        "Learn service mesh and advanced network concepts"
      ]
    },
    learningResources: [
      {
        name: "Linux Academy",
        url: "https://linuxacademy.com/",
        type: "course"
      },
      {
        name: "AWS Documentation",
        url: "https://docs.aws.amazon.com/",
        type: "documentation"
      },
      {
        name: "Docker Documentation",
        url: "https://docs.docker.com/",
        type: "documentation"
      },
      {
        name: "Kubernetes Learning Path",
        url: "https://kubernetes.io/docs/tutorials/",
        type: "tutorial"
      }
    ]
  },
  security: {
    id: "security",
    title: "Cybersecurity",
    description: "Protect systems, networks, and data from digital attacks and implement security measures.",
    skills: ["Network Security", "Application Security", "Cryptography", "Penetration Testing", "Security Tools", "Risk Assessment"],
    roadmap: {
      beginner: [
        "Learn networking fundamentals",
        "Study operating system security",
        "Understand basic cryptography",
        "Learn common vulnerabilities (OWASP Top 10)"
      ],
      intermediate: [
        "Master security tools (Wireshark, Metasploit)",
        "Learn web application security testing",
        "Study incident response procedures",
        "Implement authentication security"
      ],
      advanced: [
        "Perform advanced penetration testing",
        "Implement security in cloud environments",
        "Master security architecture principles",
        "Learn threat modeling and risk assessment"
      ]
    },
    learningResources: [
      {
        name: "Cybrary",
        url: "https://www.cybrary.it/",
        type: "course"
      },
      {
        name: "OWASP",
        url: "https://owasp.org/",
        type: "documentation"
      },
      {
        name: "HackerOne",
        url: "https://www.hackerone.com/",
        type: "platform"
      },
      {
        name: "Penetration Testing: A Hands-On Introduction to Hacking",
        url: "https://nostarch.com/pentesting",
        type: "book"
      }
    ]
  },
  design: {
    id: "design",
    title: "UI/UX Design",
    description: "Design user interfaces and experiences that are intuitive, accessible, and delightful to use.",
    skills: ["UI Design", "UX Research", "Wireframing & Prototyping", "Design Systems", "Accessibility", "User Testing"],
    roadmap: {
      beginner: [
        "Learn design fundamentals (color, typography, layout)",
        "Master a design tool (Figma, Sketch, or Adobe XD)",
        "Study user experience principles",
        "Create simple UI components and layouts"
      ],
      intermediate: [
        "Build wireframes and interactive prototypes",
        "Conduct user research and usability testing",
        "Learn to create design systems",
        "Study accessibility standards"
      ],
      advanced: [
        "Lead complex UX research projects",
        "Create comprehensive design systems",
        "Master motion design and interactions",
        "Learn to work with developers for implementation"
      ]
    },
    learningResources: [
      {
        name: "Figma",
        url: "https://www.figma.com/resources/",
        type: "tool"
      },
      {
        name: "Nielsen Norman Group",
        url: "https://www.nngroup.com/articles/",
        type: "articles"
      },
      {
        name: "Interaction Design Foundation",
        url: "https://www.interaction-design.org/",
        type: "course"
      },
      {
        name: "Laws of UX",
        url: "https://lawsofux.com/",
        type: "reference"
      }
    ]
  }
};

export const calculateResults = (answers: Record<number, string>) => {
  const scores: Record<string, number> = {
    frontend: 0,
    backend: 0,
    data: 0,
    devops: 0,
    security: 0,
    design: 0
  };
  
  // Calculate scores based on answers
  Object.entries(answers).forEach(([questionId, optionId]) => {
    const question = quizQuestions.find(q => q.id === parseInt(questionId));
    if (question) {
      const option = question.options.find(opt => opt.id === optionId);
      if (option) {
        Object.entries(option.score).forEach(([field, value]) => {
          scores[field] = (scores[field] || 0) + value;
        });
      }
    }
  });
  
  // Find the career path with the highest score
  let highestScore = 0;
  let recommendedPath = 'frontend'; // Default
  
  Object.entries(scores).forEach(([path, score]) => {
    if (score > highestScore) {
      highestScore = score;
      recommendedPath = path;
    }
  });
  
  // Get the secondary recommendations (top 3)
  const secondaryRecommendations = Object.entries(scores)
    .filter(([path]) => path !== recommendedPath)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([path]) => path);
  
  return {
    primaryRecommendation: careerPaths[recommendedPath],
    secondaryRecommendations: secondaryRecommendations.map(path => careerPaths[path]),
    scores
  };
};
