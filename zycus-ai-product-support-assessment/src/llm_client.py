import os
import json
import time
from typing import Optional
import sys
from pathlib import Path
from openai import OpenAI

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import config

class LLMClient:
    """Wrapper for NVIDIA NIM API calls."""
    
    def __init__(self):
        api_key = os.environ.get("NVIDIA_API_KEY")
        if not api_key:
            raise ValueError("NVIDIA_API_KEY environment variable not set.")
            
        self.client = OpenAI(
            base_url=getattr(config, "NIM_BASE_URL", "https://integrate.api.nvidia.com/v1"),
            api_key=api_key
        )
        self.model = getattr(config, "NIM_MODEL", "meta/llama-3.2-11b-vision-instruct")
        self.temperature = getattr(config, "NIM_TEMPERATURE", 0.0)
        self.seed = getattr(config, "NIM_SEED", 42)
        self.max_tokens = getattr(config, "NIM_MAX_TOKENS", 2048)
        
    def chat(self, system_prompt: str, user_prompt: str, response_format: Optional[dict] = None) -> str:
        """Send a chat completion request.
        
        Args:
            system_prompt: System message content
            user_prompt: User message content  
            response_format: If provided, request JSON response (e.g. {"type": "json_object"})
        
        Returns:
            The assistant's response text
        """
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        
        kwargs = {
            "model": self.model,
            "messages": messages,
            "temperature": self.temperature,
            "seed": self.seed,
            "max_tokens": self.max_tokens
        }
        
        if response_format:
            # Some OpenAI compatible endpoints support response_format={"type": "json_object"}
            kwargs["response_format"] = response_format
            
        for attempt in range(3):
            try:
                response = self.client.chat.completions.create(**kwargs)
                return response.choices[0].message.content
            except Exception as e:
                if attempt == 2:
                    print(f"Failed to get response after 3 attempts: {e}")
                    raise
                time.sleep(2 ** attempt)
        
        return ""
        
    def chat_json(self, system_prompt: str, user_prompt: str) -> dict:
        """Send a chat request and parse JSON response.
        
        Instructs the LLM to respond in JSON format.
        Parses the response and returns a dict.
        Raises ValueError if JSON parsing fails after retries.
        """
        system_prompt += "\nRespond ONLY with valid JSON."
        
        for attempt in range(3):
            try:
                response_text = self.chat(system_prompt, user_prompt, response_format={"type": "json_object"})
                # Strip markdown code blocks if present
                if response_text.startswith("```json"):
                    response_text = response_text[7:]
                elif response_text.startswith("```"):
                    response_text = response_text[3:]
                if response_text.endswith("```"):
                    response_text = response_text[:-3]
                    
                response_text = response_text.strip()
                return json.loads(response_text)
            except json.JSONDecodeError as e:
                if attempt == 2:
                    raise ValueError(f"Failed to parse JSON response: {response_text}") from e
                time.sleep(2 ** attempt)
            except Exception as e:
                if attempt == 2:
                    raise
                time.sleep(2 ** attempt)
                
        raise ValueError("Failed to get JSON response")
