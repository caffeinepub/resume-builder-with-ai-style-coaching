import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Suggestion {
    section: SectionType;
    message: string;
    category: SuggestionCategory;
}
export type UpdateSection = [SectionType, string];
export interface ResumeWithCoaching {
    resume: Resume;
    coaching?: CoachingResult;
}
export interface Resume {
    id: bigint;
    title: string;
    sections: Array<[SectionType, string]>;
}
export interface CoachingResult {
    suggestions: Array<Suggestion>;
    timestamp: Time;
}
export interface UserProfile {
    name: string;
}
export enum SectionType {
    education = "education",
    experience = "experience",
    summary = "summary",
    skills = "skills"
}
export enum SuggestionCategory {
    impact = "impact",
    formatting = "formatting",
    clarity = "clarity",
    keywords = "keywords"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createResume(title: string, sections: Array<UpdateSection>): Promise<bigint>;
    deleteResume(id: bigint): Promise<void>;
    getAllResumes(): Promise<Array<Resume>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCoachingResult(resumeId: bigint): Promise<CoachingResult | null>;
    getResume(id: bigint): Promise<Resume>;
    getResumeWithCoaching(resumeId: bigint): Promise<ResumeWithCoaching>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    runCoaching(resumeId: bigint): Promise<CoachingResult>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateResume(id: bigint, title: string, sections: Array<UpdateSection>): Promise<void>;
}
