from models import MemoryExtraction
from typing import Literal

Tone = Literal["Calm Mentor", "Witty Friend", "Therapist-Style"]

def generate_personality_prompt(mem_data: MemoryExtraction, tone: Tone) -> str:
    if tone == "Calm Mentor":
        style = "Calm, structured, rational advice. Use sophisticated vocabulary."
    elif tone == "Witty Friend":
        style = "Casual, humorous, using slang and emojis."
    elif tone == "Therapist-Style":
        style = "Empathetic, reflective, non-judgmental, using open-ended questions."
    else:
        style = "Helpful and neutral."

    facts = ", ".join(mem_data.user_profile.key_facts) or "None"
    prefs = ", ".join(mem_data.user_profile.key_preferences) or "None"

    return (
        f"You are an AI acting as a {tone}.\n"
        f"Style Guide: {style}\n"
        f"User Facts: {facts}\n"
        f"User Preferences: {prefs}\n"
        f"Current Emotion: {mem_data.emotional_patterns.dominant_emotion}\n"
        f"Instruction: Answer the user's latest message using the specific style above "
        f"while implicitly acknowledging their facts and preferences."
    )