from pydantic import BaseModel, EmailStr
from typing import List, Optional

class MCQ(BaseModel):
    question: str
    options: List[str]
    answer: str

class AnalysisResult(BaseModel):
    skills_matched: List[str]
    skills_missing: List[str]
    ATS_score: int
    strengths: str
    weaknesses: str
    improvement_suggestions: str
    mcqs: List[MCQ]
    job_matches: List[str]

    class Config:
        from_attributes = True  
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Sub-schema to hold the user details in the token response
class UserInfo(BaseModel):
    name: str
    email: EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserInfo  