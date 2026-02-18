import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Trash2, Save, Download, Eye, FileText, Briefcase, GraduationCap, Award, Code, Globe, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CVData {
  id?: string;
  title: string;
  template: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin_url: string;
  github_url: string;
  portfolio_url: string;
  summary: string;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  additional_sections: AdditionalSection[];
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  start_date: string;
  end_date: string;
  gpa?: string;
  description: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string;
  current: boolean;
  description: string;
}

interface Skill {
  id: string;
  name: string;
  level: string;
  category: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  url: string;
  start_date: string;
  end_date: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiry_date?: string;
  credential_id?: string;
}

interface Language {
  id: string;
  name: string;
  proficiency: string;
}

interface AdditionalSection {
  id: string;
  title: string;
  content: string;
}

export default function CVBuilder() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [cvList, setCvList] = useState<any[]>([]);
  const [currentCvId, setCurrentCvId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const [cvData, setCvData] = useState<CVData>({
    title: 'My CV',
    template: 'modern',
    full_name: '',
    email: '',
    phone: '',
    location: '',
    linkedin_url: '',
    github_url: '',
    portfolio_url: '',
    summary: '',
    education: [],
    experience: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    additional_sections: [],
  });

  useEffect(() => {
    if (user) {
      fetchCVs();
      loadDefaultCV();
    }
  }, [user]);

  const fetchCVs = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('cvs')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setCvList(data || []);
    } catch (error) {
      console.error('Error fetching CVs:', error);
    }
  };

  const loadDefaultCV = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('cvs')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_default', true)
        .single();

      if (data && !error) {
        setCvData(data as CVData);
        setCurrentCvId(data.id);
      } else {
        // Load profile data if available
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profile) {
          setCvData(prev => ({
            ...prev,
            full_name: profile.full_name || '',
            email: profile.email || user.email || '',
            phone: profile.phone_number || '',
            location: profile.location || '',
          }));
        }
      }
    } catch (error) {
      console.error('Error loading default CV:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const cvToSave = {
        ...cvData,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      };

      if (currentCvId) {
        const { error } = await supabase
          .from('cvs')
          .update(cvToSave)
          .eq('id', currentCvId);

        if (error) throw error;
        toast({
          title: "Success!",
          description: "CV updated successfully",
        });
      } else {
        const { data, error } = await supabase
          .from('cvs')
          .insert([{ ...cvToSave, is_default: cvList.length === 0 }])
          .select()
          .single();

        if (error) throw error;
        setCurrentCvId(data.id);
        toast({
          title: "Success!",
          description: "CV saved successfully",
        });
      }
      await fetchCVs();
    } catch (error) {
      console.error('Error saving CV:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save CV. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const addEducation = () => {
    setCvData(prev => ({
      ...prev,
      education: [...prev.education, {
        id: Date.now().toString(),
        degree: '',
        institution: '',
        location: '',
        start_date: '',
        end_date: '',
        description: '',
      }],
    }));
  };

  const removeEducation = (id: string) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id),
    }));
  };

  const updateEducation = (id: string, field: keyof Education, value: string | boolean) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const addExperience = () => {
    setCvData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        id: Date.now().toString(),
        title: '',
        company: '',
        location: '',
        start_date: '',
        end_date: '',
        current: false,
        description: '',
      }],
    }));
  };

  const removeExperience = (id: string) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id),
    }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const addSkill = () => {
    setCvData(prev => ({
      ...prev,
      skills: [...prev.skills, {
        id: Date.now().toString(),
        name: '',
        level: 'Intermediate',
        category: 'Technical',
      }],
    }));
  };

  const removeSkill = (id: string) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id),
    }));
  };

  const updateSkill = (id: string, field: keyof Skill, value: string) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.map(skill =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    }));
  };

  const addProject = () => {
    setCvData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        id: Date.now().toString(),
        name: '',
        description: '',
        technologies: '',
        url: '',
        start_date: '',
        end_date: '',
      }],
    }));
  };

  const removeProject = (id: string) => {
    setCvData(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id),
    }));
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    setCvData(prev => ({
      ...prev,
      projects: prev.projects.map(proj =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    }));
  };

  const addCertification = () => {
    setCvData(prev => ({
      ...prev,
      certifications: [...prev.certifications, {
        id: Date.now().toString(),
        name: '',
        issuer: '',
        date: '',
      }],
    }));
  };

  const removeCertification = (id: string) => {
    setCvData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert.id !== id),
    }));
  };

  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    setCvData(prev => ({
      ...prev,
      certifications: prev.certifications.map(cert =>
        cert.id === id ? { ...cert, [field]: value } : cert
      ),
    }));
  };

  const addLanguage = () => {
    setCvData(prev => ({
      ...prev,
      languages: [...prev.languages, {
        id: Date.now().toString(),
        name: '',
        proficiency: 'Intermediate',
      }],
    }));
  };

  const removeLanguage = (id: string) => {
    setCvData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang.id !== id),
    }));
  };

  const updateLanguage = (id: string, field: keyof Language, value: string) => {
    setCvData(prev => ({
      ...prev,
      languages: prev.languages.map(lang =>
        lang.id === id ? { ...lang, [field]: value } : lang
      ),
    }));
  };

  const handleExportPDF = async () => {
    if (!cvData.full_name) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in at least your name before exporting.",
      });
      return;
    }

    try {
      // Dynamically import jsPDF
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      let yPosition = margin;
      const lineHeight = 7;
      const sectionSpacing = 10;

      // Helper function to add new page if needed
      const checkPageBreak = (requiredSpace: number) => {
        if (yPosition + requiredSpace > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
          return true;
        }
        return false;
      };

      // Helper function to add text with word wrap
      const addText = (text: string, fontSize: number, isBold: boolean = false, color: number[] = [0, 0, 0]) => {
        doc.setFontSize(fontSize);
        doc.setTextColor(color[0], color[1], color[2]);
        if (isBold) {
          doc.setFont(undefined, 'bold');
        } else {
          doc.setFont(undefined, 'normal');
        }
        
        const maxWidth = pageWidth - (margin * 2);
        const lines = doc.splitTextToSize(text, maxWidth);
        
        lines.forEach((line: string) => {
          checkPageBreak(lineHeight);
          doc.text(line, margin, yPosition);
          yPosition += lineHeight;
        });
      };

      // Header Section
      doc.setFontSize(24);
      doc.setTextColor(139, 92, 246); // Purple color
      doc.setFont(undefined, 'bold');
      doc.text(cvData.full_name || 'Your Name', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += lineHeight + 2;

      // Contact Information
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.setFont(undefined, 'normal');
      const contactInfo = [
        cvData.email,
        cvData.phone,
        cvData.location
      ].filter(Boolean).join(' | ');
      
      if (contactInfo) {
        doc.text(contactInfo, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += lineHeight;
      }

      // Links
      const links = [];
      if (cvData.linkedin_url) links.push(`LinkedIn: ${cvData.linkedin_url}`);
      if (cvData.github_url) links.push(`GitHub: ${cvData.github_url}`);
      if (cvData.portfolio_url) links.push(`Portfolio: ${cvData.portfolio_url}`);
      
      if (links.length > 0) {
        doc.text(links.join(' | '), pageWidth / 2, yPosition, { align: 'center' });
        yPosition += lineHeight + sectionSpacing;
      } else {
        yPosition += sectionSpacing;
      }

      // Professional Summary
      if (cvData.summary) {
        checkPageBreak(sectionSpacing);
        addText('PROFESSIONAL SUMMARY', 14, true, [139, 92, 246]);
        yPosition += 2;
        addText(cvData.summary, 10, false, [0, 0, 0]);
        yPosition += sectionSpacing;
      }

      // Education
      if (cvData.education.length > 0) {
        checkPageBreak(sectionSpacing);
        addText('EDUCATION', 14, true, [139, 92, 246]);
        yPosition += 2;
        
        cvData.education.forEach((edu) => {
          checkPageBreak(lineHeight * 4);
          doc.setFontSize(12);
          doc.setFont(undefined, 'bold');
          doc.text(edu.degree || 'Degree', margin, yPosition);
          
          const dateRange = edu.start_date && edu.end_date 
            ? `${edu.start_date} - ${edu.end_date}`
            : '';
          if (dateRange) {
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.text(dateRange, pageWidth - margin, yPosition, { align: 'right' });
          }
          
          yPosition += lineHeight;
          doc.setFontSize(10);
          doc.text(`${edu.institution}${edu.location ? `, ${edu.location}` : ''}`, margin, yPosition);
          
          if (edu.gpa) {
            yPosition += lineHeight;
            doc.text(`GPA: ${edu.gpa}`, margin, yPosition);
          }
          
          if (edu.description) {
            yPosition += lineHeight;
            const descLines = doc.splitTextToSize(edu.description, pageWidth - (margin * 2));
            descLines.forEach((line: string) => {
              doc.text(line, margin, yPosition);
              yPosition += lineHeight;
            });
          }
          
          yPosition += 3;
        });
        yPosition += sectionSpacing - 3;
      }

      // Experience
      if (cvData.experience.length > 0) {
        checkPageBreak(sectionSpacing);
        addText('EXPERIENCE', 14, true, [139, 92, 246]);
        yPosition += 2;
        
        cvData.experience.forEach((exp) => {
          checkPageBreak(lineHeight * 5);
          doc.setFontSize(12);
          doc.setFont(undefined, 'bold');
          doc.text(exp.title || 'Job Title', margin, yPosition);
          
          const dateRange = exp.start_date 
            ? `${exp.start_date} - ${exp.current ? 'Present' : exp.end_date || ''}`
            : '';
          if (dateRange) {
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.text(dateRange, pageWidth - margin, yPosition, { align: 'right' });
          }
          
          yPosition += lineHeight;
          doc.setFontSize(10);
          doc.text(`${exp.company}${exp.location ? `, ${exp.location}` : ''}`, margin, yPosition);
          
          if (exp.description) {
            yPosition += lineHeight;
            const descLines = doc.splitTextToSize(exp.description, pageWidth - (margin * 2));
            descLines.forEach((line: string) => {
              doc.text(line, margin, yPosition);
              yPosition += lineHeight;
            });
          }
          
          yPosition += 3;
        });
        yPosition += sectionSpacing - 3;
      }

      // Skills
      if (cvData.skills.length > 0) {
        checkPageBreak(sectionSpacing);
        addText('SKILLS', 14, true, [139, 92, 246]);
        yPosition += 2;
        
        const skillsText = cvData.skills
          .map(skill => `${skill.name}${skill.level ? ` (${skill.level})` : ''}`)
          .join(' • ');
        
        addText(skillsText, 10, false, [0, 0, 0]);
        yPosition += sectionSpacing;
      }

      // Projects
      if (cvData.projects.length > 0) {
        checkPageBreak(sectionSpacing);
        addText('PROJECTS', 14, true, [139, 92, 246]);
        yPosition += 2;
        
        cvData.projects.forEach((proj) => {
          checkPageBreak(lineHeight * 4);
          doc.setFontSize(12);
          doc.setFont(undefined, 'bold');
          doc.text(proj.name || 'Project Name', margin, yPosition);
          
          if (proj.url) {
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(139, 92, 246);
            doc.text(proj.url, pageWidth - margin, yPosition, { align: 'right' });
            doc.setTextColor(0, 0, 0);
          }
          
          if (proj.description) {
            yPosition += lineHeight;
            const descLines = doc.splitTextToSize(proj.description, pageWidth - (margin * 2));
            descLines.forEach((line: string) => {
              doc.text(line, margin, yPosition);
              yPosition += lineHeight;
            });
          }
          
          if (proj.technologies) {
            yPosition += lineHeight;
            doc.setFontSize(9);
            doc.setTextColor(100, 100, 100);
            doc.text(`Technologies: ${proj.technologies}`, margin, yPosition);
            doc.setTextColor(0, 0, 0);
          }
          
          yPosition += 3;
        });
        yPosition += sectionSpacing - 3;
      }

      // Certifications
      if (cvData.certifications.length > 0) {
        checkPageBreak(sectionSpacing);
        addText('CERTIFICATIONS', 14, true, [139, 92, 246]);
        yPosition += 2;
        
        cvData.certifications.forEach((cert) => {
          checkPageBreak(lineHeight * 2);
          doc.setFontSize(10);
          doc.setFont(undefined, 'bold');
          doc.text(cert.name || 'Certification', margin, yPosition);
          
          const certInfo = [
            cert.issuer,
            cert.date
          ].filter(Boolean).join(' • ');
          
          if (certInfo) {
            yPosition += lineHeight;
            doc.setFont(undefined, 'normal');
            doc.text(certInfo, margin, yPosition);
          }
          
          yPosition += 3;
        });
        yPosition += sectionSpacing - 3;
      }

      // Languages
      if (cvData.languages.length > 0) {
        checkPageBreak(sectionSpacing);
        addText('LANGUAGES', 14, true, [139, 92, 246]);
        yPosition += 2;
        
        const languagesText = cvData.languages
          .map(lang => `${lang.name}${lang.proficiency ? ` (${lang.proficiency})` : ''}`)
          .join(' • ');
        
        addText(languagesText, 10, false, [0, 0, 0]);
      }

      // Generate filename
      const fileName = `${cvData.full_name.replace(/\s+/g, '_')}_CV_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Save the PDF - this will download to the user's default download folder
      doc.save(fileName);

      toast({
        title: "Success!",
        description: "CV downloaded successfully!",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">CV Builder</h1>
              <p className="text-muted-foreground mt-1">Create a professional CV in minutes</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2"
              >
                <Eye size={16} />
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-career-purple hover:bg-career-purple-dark flex items-center gap-2"
              >
                <Save size={16} />
                {saving ? 'Saving...' : 'Save CV'}
              </Button>
              <Button
                variant="outline"
                onClick={handleExportPDF}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Export PDF
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Section */}
            <div className={showPreview ? 'hidden lg:block' : ''}>
              <Card>
                <CardHeader>
                  <CardTitle>CV Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="personal" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="personal">Personal</TabsTrigger>
                      <TabsTrigger value="education">Education</TabsTrigger>
                      <TabsTrigger value="experience">Experience</TabsTrigger>
                      <TabsTrigger value="skills">Skills</TabsTrigger>
                    </TabsList>

                    {/* Personal Information */}
                    <TabsContent value="personal" className="space-y-4 mt-4">
                      <div>
                        <label className="text-sm font-medium">CV Title</label>
                        <Input
                          value={cvData.title}
                          onChange={(e) => setCvData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="My Professional CV"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Full Name *</label>
                        <Input
                          value={cvData.full_name}
                          onChange={(e) => setCvData(prev => ({ ...prev, full_name: e.target.value }))}
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Email *</label>
                          <Input
                            type="email"
                            value={cvData.email}
                            onChange={(e) => setCvData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="john@example.com"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Phone</label>
                          <Input
                            value={cvData.phone}
                            onChange={(e) => setCvData(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="+1 234 567 8900"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Location</label>
                        <Input
                          value={cvData.location}
                          onChange={(e) => setCvData(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="City, Country"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium">LinkedIn</label>
                          <Input
                            value={cvData.linkedin_url}
                            onChange={(e) => setCvData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                            placeholder="linkedin.com/in/..."
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">GitHub</label>
                          <Input
                            value={cvData.github_url}
                            onChange={(e) => setCvData(prev => ({ ...prev, github_url: e.target.value }))}
                            placeholder="github.com/..."
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Portfolio</label>
                          <Input
                            value={cvData.portfolio_url}
                            onChange={(e) => setCvData(prev => ({ ...prev, portfolio_url: e.target.value }))}
                            placeholder="yourportfolio.com"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Professional Summary</label>
                        <Textarea
                          value={cvData.summary}
                          onChange={(e) => setCvData(prev => ({ ...prev, summary: e.target.value }))}
                          placeholder="Brief summary of your professional background..."
                          rows={4}
                        />
                      </div>
                    </TabsContent>

                    {/* Education */}
                    <TabsContent value="education" className="space-y-4 mt-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold flex items-center gap-2">
                          <GraduationCap size={20} />
                          Education
                        </h3>
                        <Button onClick={addEducation} size="sm" variant="outline">
                          <Plus size={16} className="mr-2" />
                          Add Education
                        </Button>
                      </div>
                      {cvData.education.map((edu) => (
                        <Card key={edu.id} className="p-4">
                          <div className="flex justify-end mb-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeEducation(edu.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <Input
                                placeholder="Degree (e.g., B.S. Computer Science)"
                                value={edu.degree}
                                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                              />
                              <Input
                                placeholder="Institution"
                                value={edu.institution}
                                onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              <Input
                                placeholder="Location"
                                value={edu.location}
                                onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                              />
                              <Input
                                type="month"
                                placeholder="Start Date"
                                value={edu.start_date}
                                onChange={(e) => updateEducation(edu.id, 'start_date', e.target.value)}
                              />
                              <Input
                                type="month"
                                placeholder="End Date"
                                value={edu.end_date}
                                onChange={(e) => updateEducation(edu.id, 'end_date', e.target.value)}
                              />
                            </div>
                            <Input
                              placeholder="GPA (optional)"
                              value={edu.gpa || ''}
                              onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                            />
                            <Textarea
                              placeholder="Description, achievements, relevant coursework..."
                              value={edu.description}
                              onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                              rows={2}
                            />
                          </div>
                        </Card>
                      ))}
                      {cvData.education.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <GraduationCap size={48} className="mx-auto mb-2 opacity-50" />
                          <p>No education entries yet. Click "Add Education" to get started.</p>
                        </div>
                      )}
                    </TabsContent>

                    {/* Experience */}
                    <TabsContent value="experience" className="space-y-4 mt-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold flex items-center gap-2">
                          <Briefcase size={20} />
                          Work Experience
                        </h3>
                        <Button onClick={addExperience} size="sm" variant="outline">
                          <Plus size={16} className="mr-2" />
                          Add Experience
                        </Button>
                      </div>
                      {cvData.experience.map((exp) => (
                        <Card key={exp.id} className="p-4">
                          <div className="flex justify-end mb-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeExperience(exp.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <Input
                                placeholder="Job Title"
                                value={exp.title}
                                onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                              />
                              <Input
                                placeholder="Company"
                                value={exp.company}
                                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              <Input
                                placeholder="Location"
                                value={exp.location}
                                onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                              />
                              <Input
                                type="month"
                                placeholder="Start Date"
                                value={exp.start_date}
                                onChange={(e) => updateExperience(exp.id, 'start_date', e.target.value)}
                              />
                              <div className="flex items-center gap-2">
                                <Input
                                  type="month"
                                  placeholder="End Date"
                                  value={exp.end_date}
                                  onChange={(e) => updateExperience(exp.id, 'end_date', e.target.value)}
                                  disabled={exp.current}
                                />
                                <label className="flex items-center gap-1 text-sm">
                                  <input
                                    type="checkbox"
                                    checked={exp.current}
                                    onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                                    className="rounded"
                                  />
                                  Current
                                </label>
                              </div>
                            </div>
                            <Textarea
                              placeholder="Job description, achievements, responsibilities..."
                              value={exp.description}
                              onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                              rows={4}
                            />
                          </div>
                        </Card>
                      ))}
                      {cvData.experience.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Briefcase size={48} className="mx-auto mb-2 opacity-50" />
                          <p>No work experience entries yet. Click "Add Experience" to get started.</p>
                        </div>
                      )}
                    </TabsContent>

                    {/* Skills */}
                    <TabsContent value="skills" className="space-y-4 mt-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold flex items-center gap-2">
                          <Code size={20} />
                          Skills
                        </h3>
                        <Button onClick={addSkill} size="sm" variant="outline">
                          <Plus size={16} className="mr-2" />
                          Add Skill
                        </Button>
                      </div>
                      {cvData.skills.map((skill) => (
                        <Card key={skill.id} className="p-4">
                          <div className="flex justify-end mb-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSkill(skill.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <Input
                              placeholder="Skill Name"
                              value={skill.name}
                              onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                            />
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              value={skill.level}
                              onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}
                            >
                              <option value="Beginner">Beginner</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Advanced">Advanced</option>
                              <option value="Expert">Expert</option>
                            </select>
                            <Input
                              placeholder="Category"
                              value={skill.category}
                              onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                            />
                          </div>
                        </Card>
                      ))}
                      {cvData.skills.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Code size={48} className="mx-auto mb-2 opacity-50" />
                          <p>No skills added yet. Click "Add Skill" to get started.</p>
                        </div>
                      )}

                      {/* Projects */}
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold flex items-center gap-2">
                            <FileText size={20} />
                            Projects
                          </h3>
                          <Button onClick={addProject} size="sm" variant="outline">
                            <Plus size={16} className="mr-2" />
                            Add Project
                          </Button>
                        </div>
                        {cvData.projects.map((proj) => (
                          <Card key={proj.id} className="p-4 mb-3">
                            <div className="flex justify-end mb-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeProject(proj.id)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                            <div className="space-y-3">
                              <Input
                                placeholder="Project Name"
                                value={proj.name}
                                onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                              />
                              <Textarea
                                placeholder="Project description..."
                                value={proj.description}
                                onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                                rows={2}
                              />
                              <div className="grid grid-cols-2 gap-3">
                                <Input
                                  placeholder="Technologies used"
                                  value={proj.technologies}
                                  onChange={(e) => updateProject(proj.id, 'technologies', e.target.value)}
                                />
                                <Input
                                  placeholder="Project URL"
                                  value={proj.url}
                                  onChange={(e) => updateProject(proj.id, 'url', e.target.value)}
                                />
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>

                      {/* Certifications */}
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold flex items-center gap-2">
                            <Award size={20} />
                            Certifications
                          </h3>
                          <Button onClick={addCertification} size="sm" variant="outline">
                            <Plus size={16} className="mr-2" />
                            Add Certification
                          </Button>
                        </div>
                        {cvData.certifications.map((cert) => (
                          <Card key={cert.id} className="p-4 mb-3">
                            <div className="flex justify-end mb-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeCertification(cert.id)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <Input
                                placeholder="Certification Name"
                                value={cert.name}
                                onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                              />
                              <Input
                                placeholder="Issuing Organization"
                                value={cert.issuer}
                                onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                              />
                              <Input
                                type="month"
                                placeholder="Issue Date"
                                value={cert.date}
                                onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                              />
                              <Input
                                placeholder="Credential ID (optional)"
                                value={cert.credential_id || ''}
                                onChange={(e) => updateCertification(cert.id, 'credential_id', e.target.value)}
                              />
                            </div>
                          </Card>
                        ))}
                      </div>

                      {/* Languages */}
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold flex items-center gap-2">
                            <Globe size={20} />
                            Languages
                          </h3>
                          <Button onClick={addLanguage} size="sm" variant="outline">
                            <Plus size={16} className="mr-2" />
                            Add Language
                          </Button>
                        </div>
                        {cvData.languages.map((lang) => (
                          <Card key={lang.id} className="p-4 mb-3">
                            <div className="flex justify-end mb-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeLanguage(lang.id)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <Input
                                placeholder="Language"
                                value={lang.name}
                                onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                              />
                              <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={lang.proficiency}
                                onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value)}
                              >
                                <option value="Basic">Basic</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                                <option value="Native">Native</option>
                              </select>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Preview Section */}
            {showPreview && (
              <div className="lg:block">
                <Card>
                  <CardHeader>
                    <CardTitle>CV Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white p-8 shadow-lg min-h-[800px]">
                      {/* Modern Template Preview */}
                      <div className="space-y-6">
                        {/* Header */}
                        <div className="border-b-2 border-career-purple pb-4">
                          <h1 className="text-3xl font-bold text-gray-900">{cvData.full_name || 'Your Name'}</h1>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                            {cvData.email && <span>{cvData.email}</span>}
                            {cvData.phone && <span>{cvData.phone}</span>}
                            {cvData.location && <span>{cvData.location}</span>}
                          </div>
                          <div className="flex gap-4 mt-2 text-sm">
                            {cvData.linkedin_url && <a href={cvData.linkedin_url} className="text-career-purple">LinkedIn</a>}
                            {cvData.github_url && <a href={cvData.github_url} className="text-career-purple">GitHub</a>}
                            {cvData.portfolio_url && <a href={cvData.portfolio_url} className="text-career-purple">Portfolio</a>}
                          </div>
                        </div>

                        {/* Summary */}
                        {cvData.summary && (
                          <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Professional Summary</h2>
                            <p className="text-gray-700">{cvData.summary}</p>
                          </div>
                        )}

                        {/* Education */}
                        {cvData.education.length > 0 && (
                          <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">Education</h2>
                            {cvData.education.map((edu) => (
                              <div key={edu.id} className="mb-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-semibold text-gray-900">{edu.degree || 'Degree'}</h3>
                                    <p className="text-gray-700">{edu.institution} {edu.location && `• ${edu.location}`}</p>
                                    {edu.description && <p className="text-sm text-gray-600 mt-1">{edu.description}</p>}
                                  </div>
                                  <div className="text-right text-sm text-gray-600">
                                    {edu.start_date && edu.end_date && `${edu.start_date} - ${edu.end_date}`}
                                    {edu.gpa && <p>GPA: {edu.gpa}</p>}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Experience */}
                        {cvData.experience.length > 0 && (
                          <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">Experience</h2>
                            {cvData.experience.map((exp) => (
                              <div key={exp.id} className="mb-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-semibold text-gray-900">{exp.title || 'Job Title'}</h3>
                                    <p className="text-gray-700">{exp.company} {exp.location && `• ${exp.location}`}</p>
                                    {exp.description && <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">{exp.description}</p>}
                                  </div>
                                  <div className="text-right text-sm text-gray-600">
                                    {exp.start_date && `${exp.start_date} - ${exp.current ? 'Present' : exp.end_date}`}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Skills */}
                        {cvData.skills.length > 0 && (
                          <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">Skills</h2>
                            <div className="flex flex-wrap gap-2">
                              {cvData.skills.map((skill) => (
                                <span key={skill.id} className="bg-career-purple/10 text-career-purple px-3 py-1 rounded-full text-sm">
                                  {skill.name} ({skill.level})
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Projects */}
                        {cvData.projects.length > 0 && (
                          <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">Projects</h2>
                            {cvData.projects.map((proj) => (
                              <div key={proj.id} className="mb-4">
                                <h3 className="font-semibold text-gray-900">{proj.name || 'Project Name'}</h3>
                                {proj.url && <a href={proj.url} className="text-career-purple text-sm">{proj.url}</a>}
                                <p className="text-sm text-gray-600 mt-1">{proj.description}</p>
                                {proj.technologies && <p className="text-xs text-gray-500 mt-1">Tech: {proj.technologies}</p>}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Certifications */}
                        {cvData.certifications.length > 0 && (
                          <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">Certifications</h2>
                            {cvData.certifications.map((cert) => (
                              <div key={cert.id} className="mb-2">
                                <span className="font-semibold text-gray-900">{cert.name}</span>
                                {cert.issuer && <span className="text-gray-700"> • {cert.issuer}</span>}
                                {cert.date && <span className="text-sm text-gray-600"> • {cert.date}</span>}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Languages */}
                        {cvData.languages.length > 0 && (
                          <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">Languages</h2>
                            <div className="flex flex-wrap gap-4">
                              {cvData.languages.map((lang) => (
                                <span key={lang.id} className="text-gray-700">
                                  {lang.name} ({lang.proficiency})
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
