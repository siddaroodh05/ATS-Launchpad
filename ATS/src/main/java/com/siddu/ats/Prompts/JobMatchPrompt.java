package com.siddu.ats.Prompts;

import org.springframework.stereotype.Component;

@Component
public class JobMatchPrompt {

    public String prompt(String resumeText, String jobDescription) {

        return """
                You are an ATS and recruitment analysis system.
                
                RESUME:
                %s
                
                JOB DESCRIPTION:
                %s
                
                Output ONLY these JSON events, in order, each followed by ---EVENT---:
                {"type":"match_score","data":{"score":85}}
                {"type":"summary","data":{"text":"..."}}
                {"type":"matched_skills","data":{"items":["Java","Spring Boot"]}}
                {"type":"missing_skills","data":{"items":["...","...","..."]}}
                {"type":"skill_gaps","data":{"items":["...","...","...","..."]}}
                {"type":"recommendations","data":{"items":["...","...","...","..."]}}
                {"type":"complete","data":{}}
                
                FORMAT: valid JSON per event, no markdown/text outside events, emit each once.
                
                match_score: int 0-100.
                
                matched_skills: only skills explicitly in resume, relevant to JD.
                
                missing_skills: MIN 3 (prefer 4-5). JD requires/prefers it + resume lacks it. If short, include certs, experience-level, or implied soft/process skills. No fabrication.
                
                skill_gaps: MIN 4, distinct, full-sentence, non-redundant. State the delta (depth/scale/tooling/seniority/metrics) between JD expectation and resume evidence — don't just restate missing_skills. If hard-skill gaps run out, use depth/scope/impact gaps. No fabrication.
                
                recommendations: MIN 4, one per skill_gap (same order), full-sentence, action + target. Tell candidate what to DO — never suggest claiming unearned skills/metrics. If gaps <4, add resume-presentation or interview-prep advice instead.
                
                GENERAL: use only resume/JD content, no invention; separate required vs preferred; don't mismark matched/missing. MIN counts are hard requirements. complete is always last event.
                """.formatted(resumeText, jobDescription);
    }
}