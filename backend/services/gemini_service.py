import os
import json
from google import genai
from typing import List, Optional

def get_client():
    """Get configured Gemini client using API Key."""
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY environment variable is not set.")
    return genai.Client(api_key=api_key)
    
MODELS = [
    'gemini-2.5-flash',
]

def generate_with_fallback(client, prompt: str) -> dict:
    """Attempt generation across multiple models to avoid 429 rate limits."""
    last_error = None
    for model_name in MODELS:
        try:
            print(f"Attempting API call with: {model_name}...")
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config={
                    'response_mime_type': 'application/json',
                }
            )
            data = json.loads(response.text)
            print(f"Success with {model_name}")
            return data
        except Exception as e:
            last_error = str(e)
            print(f"Model {model_name} failed: {last_error[:100]}... Trying next.")
            continue
            
    raise Exception(f"All fallback models failed. Last error: {last_error}")

def summarize_content(text: str, mode: str = "standard") -> dict:
    """Generate AI summary of slide content."""
    client = get_client()
    
    mode_instructions = {
        "standard": "Provide a clear, concise summary suitable for students.",
        "detailed": "Provide a comprehensive, detailed summary with all important points.",
        "exam": "Focus on exam-critical concepts, definitions, and key facts a student must know."
    }
    
    instruction = mode_instructions.get(mode, mode_instructions["standard"])
    
    prompt = f"""You are an expert academic tutor. Analyze the following lecture slide content and provide a structured response.

{instruction}

Slide Content:
{text[:5000]}

Respond with a JSON object containing:
- "summary": A clear paragraph summarizing the main content
- "key_points": A list of the top 5-7 most important bullet points
- "topics": A list of 3-5 main topic categories covered
- "ai_recommended": A list of 2-3 highly important specific exam-focus points or concepts recommended to study first."""

    try:
        return generate_with_fallback(client, prompt)
    except Exception as e:
        print(f"Gemini API Error (Summarize): {str(e)}")
        # Fallback if AI fails or blocks
        return {
            "summary": "We encountered an issue while generating the AI summary. Please check your slides directly.",
            "key_points": ["Could not extract key points automatically."],
            "topics": ["General Content"],
            "ai_recommended": ["Try uploading a smaller document"]
        }

def explain_content(text: str, topic: Optional[str] = None) -> dict:
    """Generate detailed teacher-style explanation."""
    client = get_client()
    topic_context = f"Focus specifically on: {topic}" if topic else ""
    
    prompt = f"""You are an expert teacher explaining concepts to university students. 
{topic_context}
Explain the following content in a clear, engaging way with real-world examples.

IMPORTANT EXPLANATION RULES:
- Use Professional Markdown Formatting.
- Use Heading 3 (###) for main sections.
- Use bold text for important terms.
- Use bullet points where appropriate (do not return giant walls of text). 

Content:
{text[:4000]}

Respond with a JSON object containing:
- "explanation": Thorough teacher-style explanation formatted strictly as Markdown.
- "examples": A list of 3 real-world examples
- "steps": A list of steps for understanding or calculation if applicable"""

    try:
        return generate_with_fallback(client, prompt)
    except Exception as e:
        print(f"Gemini API Error (Explain): {str(e)}")
        return {
            "explanation": "Something went wrong during the detailed explanation generation. Try asking a specific question in the chat!",
            "examples": [],
            "steps": []
        }

def chat_with_content(question: str, context: str, history: list) -> dict:
    """Answer student questions about slide content."""
    client = get_client()
    
    history_text = ""
    if history:
        for msg in history[-4:]:
            role = "Student" if msg.get("role") == "user" else "Tutor"
            history_text += f"{role}: {msg.get('content', '')}\n"
    
    prompt = f"""You are SlideMind AI, a helpful academic tutor assistant. Answer the student's question based on the lecture content provided.

Lecture Content Context:
{context[:4000]}

{f"Previous conversation:{chr(10)}{history_text}" if history_text else ""}

Student's Question: {question}

Respond with a JSON object containing:
- "answer": Your detailed, helpful answer
- "suggestions": A list of 3 follow-up questions the student might want to ask"""

    try:
        return generate_with_fallback(client, prompt)
    except Exception as e:
        print(f"Gemini API Error (Chat): {str(e)}")
        return {
            "answer": "I'm having trouble processing your question right now. Let me try again in a second!",
            "suggestions": ["Tell me about the main topics", "What are the key concepts?", "How can I study this?"]
        }

def extract_topics(text: str) -> dict:
    """Extract structured topics from slide content."""
    client = get_client()
    
    prompt = f"""Analyze these lecture slides and identify the main topics or chapters.
Identify 3-7 meaningful topics.

Lecture Content:
{text[:6000]}

Respond with a JSON object containing:
- "topics": A list of objects with "title", "summary", "key_concepts" (list), and "slides" (list of dummy slide numbers)
- "total_topics": Number of topics identified"""

    try:
        return generate_with_fallback(client, prompt)
    except Exception as e:
        print(f"Gemini API Error (Topics): {str(e)}")
        return {
            "topics": [{"title": "Main Content", "summary": "Foundational slides", "key_concepts": [], "slides": [1]}],
            "total_topics": 1
        }

def generate_quiz(text: str, difficulty: str, num_questions: int) -> dict:
    """Generate MCQ quiz from slide content."""
    client = get_client()
    
    difficulty_instructions = {
        "easy": "Create straightforward questions testing basic recall and definitions.",
        "medium": "Create questions requiring understanding and application of concepts.",
        "hard": "Create challenging questions requiring analysis, synthesis, and critical thinking."
    }
    
    instruction = difficulty_instructions.get(difficulty, difficulty_instructions["medium"])
    
    prompt = f"""Generate exactly {num_questions} multiple choice questions from this lecture content.
Difficulty: {difficulty.upper()} — {instruction}

Lecture Content:
{text[:6000]}

Respond with a JSON object containing:
- "questions": A list of objects with "question", "options" (list of {{"label": "A", "text": "..."}}), "correct_answer" (e.g., "A"), and "explanation"
- "total": {num_questions}
- "difficulty": "{difficulty}" """

    try:
        return generate_with_fallback(client, prompt)
    except Exception as e:
        print(f"Gemini API Error (Quiz): {str(e)}")
        return {
            "questions": [],
            "total": 0,
            "difficulty": difficulty,
            "error": "Could not generate questions. Try a different section or shorter text."
        }