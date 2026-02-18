import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Video, Code, FileText, Database, Shield, Cloud, Palette, Server, Terminal } from 'lucide-react';

const Resources = () => {
  // Resources data
  const resources = [
    {
      category: "Frontend Development",
      items: [
        {
          title: "HTML & CSS Fundamentals",
          type: "Course",
          icon: <BookOpen className="h-6 w-6 text-career-purple" />,
          description: "Master the basics of web development with HTML5 and CSS3, including responsive design and modern layouts.",
          link: "https://www.w3schools.com/html/"
        },
        {
          title: "JavaScript Deep Dive",
          type: "Tutorial",
          icon: <Code className="h-6 w-6 text-career-purple" />,
          description: "Comprehensive JavaScript tutorial covering ES6+, async programming, and modern frameworks.",
          link: "https://javascript.info/"
        },
        {
          title: "React.js Masterclass",
          type: "Video Series",
          icon: <Video className="h-6 w-6 text-career-purple" />,
          description: "Learn React.js from basics to advanced concepts including hooks, context, and state management.",
          link: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/"
        }
      ]
    },
    {
      category: "Backend Development",
      items: [
        {
          title: "Node.js & Express",
          type: "Course",
          icon: <Server className="h-6 w-6 text-career-purple" />,
          description: "Build scalable backend applications with Node.js and Express.js, including RESTful APIs and authentication.",
          link: "https://www.udemy.com/course/nodejs-the-complete-guide/"
        },
        {
          title: "Database Design",
          type: "Tutorial",
          icon: <Database className="h-6 w-6 text-career-purple" />,
          description: "Learn database design principles, SQL, and NoSQL databases for modern applications.",
          link: "https://www.coursera.org/learn/database-design"
        },
        {
          title: "API Development",
          type: "Documentation",
          icon: <FileText className="h-6 w-6 text-career-purple" />,
          description: "Comprehensive guide to RESTful API design, documentation, and best practices.",
          link: "https://restfulapi.net/"
        }
      ]
    },
    {
      category: "Data Science & Analytics",
      items: [
        {
          title: "Python for Data Science",
          type: "Course",
          icon: <BookOpen className="h-6 w-6 text-career-purple" />,
          description: "Learn Python programming, data analysis, and visualization with pandas, NumPy, and Matplotlib.",
          link: "https://www.datacamp.com/courses/intro-to-python-for-data-science"
        },
        {
          title: "Machine Learning Fundamentals",
          type: "Video Series",
          icon: <Video className="h-6 w-6 text-career-purple" />,
          description: "Introduction to machine learning algorithms, model evaluation, and practical applications.",
          link: "https://www.coursera.org/learn/machine-learning"
        },
        {
          title: "Data Visualization",
          type: "Tutorial",
          icon: <Palette className="h-6 w-6 text-career-purple" />,
          description: "Master data visualization techniques using tools like Tableau, Power BI, and D3.js.",
          link: "https://www.datacamp.com/courses/data-visualization"
        }
      ]
    },
    {
      category: "DevOps & Cloud",
      items: [
        {
          title: "AWS Cloud Practitioner",
          type: "Course",
          icon: <Cloud className="h-6 w-6 text-career-purple" />,
          description: "Comprehensive AWS cloud services overview and best practices for cloud architecture.",
          link: "https://aws.amazon.com/training/learn-about/cloud-practitioner/"
        },
        {
          title: "Docker & Kubernetes",
          type: "Tutorial",
          icon: <Terminal className="h-6 w-6 text-career-purple" />,
          description: "Learn containerization with Docker and orchestration with Kubernetes.",
          link: "https://www.docker.com/101-tutorial/"
        },
        {
          title: "CI/CD Pipelines",
          type: "Documentation",
          icon: <FileText className="h-6 w-6 text-career-purple" />,
          description: "Set up continuous integration and deployment pipelines with GitHub Actions and Jenkins.",
          link: "https://www.jenkins.io/doc/"
        }
      ]
    },
    {
      category: "Cybersecurity",
      items: [
        {
          title: "Network Security",
          type: "Course",
          icon: <Shield className="h-6 w-6 text-career-purple" />,
          description: "Learn network security fundamentals, protocols, and defense mechanisms.",
          link: "https://www.coursera.org/learn/network-security"
        },
        {
          title: "Ethical Hacking",
          type: "Tutorial",
          icon: <Terminal className="h-6 w-6 text-career-purple" />,
          description: "Master penetration testing and ethical hacking techniques for security assessment.",
          link: "https://www.offensive-security.com/pwk-oscp/"
        },
        {
          title: "Security Best Practices",
          type: "Documentation",
          icon: <FileText className="h-6 w-6 text-career-purple" />,
          description: "Comprehensive guide to implementing security best practices in applications.",
          link: "https://owasp.org/www-project-top-ten/"
        }
      ]
    },
    {
      category: "UI/UX Design",
      items: [
        {
          title: "UI Design Fundamentals",
          type: "Course",
          icon: <Palette className="h-6 w-6 text-career-purple" />,
          description: "Learn UI design principles, color theory, typography, and layout techniques.",
          link: "https://www.interaction-design.org/courses/ui-design-patterns-for-successful-software"
        },
        {
          title: "UX Research Methods",
          type: "Tutorial",
          icon: <BookOpen className="h-6 w-6 text-career-purple" />,
          description: "Master user research techniques, usability testing, and user-centered design.",
          link: "https://www.nngroup.com/articles/ux-research-methods/"
        },
        {
          title: "Design Systems",
          type: "Documentation",
          icon: <FileText className="h-6 w-6 text-career-purple" />,
          description: "Learn to create and maintain design systems for consistent user experiences.",
          link: "https://www.designsystems.com/"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-career-gray-dark">Learning Resources</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our curated collection of learning materials to help you advance in your career
          </p>
        </div>
        
        {resources.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-career-purple">{category.category}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {category.items.map((resource, resourceIndex) => (
                <Card key={resourceIndex} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-center gap-2">
                      {resource.icon}
                      <CardTitle className="text-xl text-center">{resource.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-gray-500 mb-2">{resource.type}</p>
                    <p className="text-gray-700 mb-4">{resource.description}</p>
                    <a 
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-career-purple hover:text-career-purple-dark font-medium"
                    >
                      Access Resource →
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resources; 