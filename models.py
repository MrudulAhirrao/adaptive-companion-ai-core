from pydantic import BaseModel
from typing import List

class UserProfile(BaseModel):
    name: str
    key_preferences: List[str]
    key_facts: List[str]

class EmotionalPatterns(BaseModel):
    dominant_emotion: str
    emotional_triggers: str
    communication_style: str

class MemoryExtraction(BaseModel):
    user_profile: UserProfile
    emotional_patterns: EmotionalPatterns