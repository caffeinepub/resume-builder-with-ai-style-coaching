import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import type { Resume } from '../../backend';
import { deserializeResumeSections } from './serializeResumeSections';

interface ResumePreviewProps {
  resume: Resume;
}

export default function ResumePreview({ resume }: ResumePreviewProps) {
  const data = deserializeResumeSections(resume);

  return (
    <Card className="mx-auto max-w-4xl bg-white p-12 text-foreground shadow-lg print:shadow-none">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-3 text-4xl font-bold tracking-tight">{data.basics.name || 'Your Name'}</h1>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
          {data.basics.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <span>{data.basics.email}</span>
            </div>
          )}
          {data.basics.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              <span>{data.basics.phone}</span>
            </div>
          )}
          {data.basics.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{data.basics.location}</span>
            </div>
          )}
          {data.basics.website && (
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span className="break-all">{data.basics.website}</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <>
          <Separator className="my-6" />
          <section className="mb-6">
            <h2 className="mb-3 text-xl font-bold uppercase tracking-wide">Professional Summary</h2>
            <p className="leading-relaxed text-muted-foreground">{data.summary}</p>
          </section>
        </>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <>
          <Separator className="my-6" />
          <section className="mb-6">
            <h2 className="mb-4 text-xl font-bold uppercase tracking-wide">Work Experience</h2>
            <div className="space-y-5">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{exp.title}</h3>
                      <p className="text-base font-medium text-muted-foreground">{exp.company}</p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>
                        {exp.startDate} - {exp.endDate}
                      </p>
                      {exp.location && <p>{exp.location}</p>}
                    </div>
                  </div>
                  {exp.description && (
                    <div className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                      {exp.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <>
          <Separator className="my-6" />
          <section className="mb-6">
            <h2 className="mb-4 text-xl font-bold uppercase tracking-wide">Education</h2>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{edu.degree}</h3>
                      <p className="text-base font-medium text-muted-foreground">{edu.institution}</p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      {edu.graduationDate && <p>{edu.graduationDate}</p>}
                      {edu.location && <p>{edu.location}</p>}
                    </div>
                  </div>
                  {edu.description && (
                    <div className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                      {edu.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <>
          <Separator className="my-6" />
          <section>
            <h2 className="mb-3 text-xl font-bold uppercase tracking-wide">Skills</h2>
            <p className="leading-relaxed text-muted-foreground">{data.skills.join(' • ')}</p>
          </section>
        </>
      )}
    </Card>
  );
}
