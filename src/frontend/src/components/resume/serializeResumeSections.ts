import type { Resume, UpdateSection, SectionType } from '../../backend';
import { SectionType as SectionTypeEnum } from '../../backend';

export interface BasicsData {
  name: string;
  email: string;
  phone: string;
  location: string;
  website: string;
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
  description: string;
}

export interface ResumeFormData {
  title: string;
  basics: BasicsData;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
}

const SECTION_DELIMITER = '|||';
const FIELD_DELIMITER = ':::';

export function serializeResumeSections(data: ResumeFormData): UpdateSection[] {
  const sections: UpdateSection[] = [];

  // Serialize basics (stored as a special summary-like section)
  const basicsContent = [
    data.basics.name,
    data.basics.email,
    data.basics.phone,
    data.basics.location,
    data.basics.website,
  ].join(FIELD_DELIMITER);

  // Summary section includes basics
  sections.push([SectionTypeEnum.summary, `${basicsContent}${SECTION_DELIMITER}${data.summary}`]);

  // Experience section
  const experienceContent = data.experience
    .map((exp) =>
      [exp.title, exp.company, exp.location, exp.startDate, exp.endDate, exp.description].join(FIELD_DELIMITER)
    )
    .join(SECTION_DELIMITER);
  sections.push([SectionTypeEnum.experience, experienceContent]);

  // Education section
  const educationContent = data.education
    .map((edu) =>
      [edu.degree, edu.institution, edu.location, edu.graduationDate, edu.description].join(FIELD_DELIMITER)
    )
    .join(SECTION_DELIMITER);
  sections.push([SectionTypeEnum.education, educationContent]);

  // Skills section
  const skillsContent = data.skills.join(',');
  sections.push([SectionTypeEnum.skills, skillsContent]);

  return sections;
}

export function deserializeResumeSections(resume: Resume): ResumeFormData {
  const formData: ResumeFormData = {
    title: resume.title,
    basics: { name: '', email: '', phone: '', location: '', website: '' },
    summary: '',
    experience: [],
    education: [],
    skills: [],
  };

  for (const [sectionType, content] of resume.sections) {
    if (sectionType === SectionTypeEnum.summary) {
      const parts = content.split(SECTION_DELIMITER);
      if (parts.length >= 1) {
        const basicsParts = parts[0].split(FIELD_DELIMITER);
        formData.basics = {
          name: basicsParts[0] || '',
          email: basicsParts[1] || '',
          phone: basicsParts[2] || '',
          location: basicsParts[3] || '',
          website: basicsParts[4] || '',
        };
      }
      if (parts.length >= 2) {
        formData.summary = parts[1];
      }
    } else if (sectionType === SectionTypeEnum.experience) {
      if (content) {
        const items = content.split(SECTION_DELIMITER).filter(Boolean);
        formData.experience = items.map((item, idx) => {
          const parts = item.split(FIELD_DELIMITER);
          return {
            id: `exp-${idx}`,
            title: parts[0] || '',
            company: parts[1] || '',
            location: parts[2] || '',
            startDate: parts[3] || '',
            endDate: parts[4] || '',
            description: parts[5] || '',
          };
        });
      }
    } else if (sectionType === SectionTypeEnum.education) {
      if (content) {
        const items = content.split(SECTION_DELIMITER).filter(Boolean);
        formData.education = items.map((item, idx) => {
          const parts = item.split(FIELD_DELIMITER);
          return {
            id: `edu-${idx}`,
            degree: parts[0] || '',
            institution: parts[1] || '',
            location: parts[2] || '',
            graduationDate: parts[3] || '',
            description: parts[4] || '',
          };
        });
      }
    } else if (sectionType === SectionTypeEnum.skills) {
      if (content) {
        formData.skills = content.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }
  }

  return formData;
}
