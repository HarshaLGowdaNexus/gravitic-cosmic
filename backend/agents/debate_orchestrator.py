import os
from pydantic import BaseModel, Field
from pprint import pprint

from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import PydanticOutputParser

class DebateClaim(BaseModel):
    claim: str = Field(description="The specific claim or argument.")
    evidence: str = Field(description="The empirical evidence supporting or refuting the claim.")
    citation_url: str = Field(description="URL to the source evidence via MCP context.")

class ExecutiveSummary(BaseModel):
    proponent_arguments: list[DebateClaim] = Field(description="Arguments supporting the video's accuracy.")
    skeptic_arguments: list[DebateClaim] = Field(description="Counter-arguments and logical fallacies found.")
    synthesis: str = Field(description="A neutral, Grade-8 readability summary mapping the truth.")
    overall_sentiment: str = Field(description="For example 'Neutral-Skeptical' or 'Highly Accurate'")

class DebateOrchestrator:
    """
    Spawns Proponent, Skeptic, and Synthesis agents via Gemini 1.5 Pro 
    to debate the multimodal context and output a structured Pydantic schema.
    """
    def __init__(self):
        # We rely on the GEMINI_API_KEY environment variable.
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-pro",
            temperature=0.2, # Low temperature for analytical tasks
        )
        self.parser = PydanticOutputParser(pydantic_object=ExecutiveSummary)

    def run_debate(self, topic: str, context_documents: list[str]) -> ExecutiveSummary:
        """
        Executes the Multi-Agent Dialectical Debate.
        """
        
        system_instructions = """
        You are an elite triad of AI Agents: The Proponent, The Skeptic, and The Synthesis.
        You have been provided with context regarding a user-uploaded video or claim:
        Topic: {topic}
        Context Sources: {context}

        INSTRUCTIONS:
        1. Proponent: Find empirical evidence supporting the claim in the provided context.
        2. Skeptic: Find counter-evidence, logical fallacies, and structural inconsistencies.
        3. Synthesis: Review both. Draft a neutral, Grade-8 reading level Executive Summary highlighting biases.
        
        {format_instructions}
        """

        prompt = ChatPromptTemplate.from_messages([
            ("system", system_instructions),
            ("human", "Execute the debate and return the findings.")
        ])

        chain = prompt | self.llm | self.parser

        try:
            print("Orchestrating Agentic Debate via Gemini 1.5 Pro...")
            result = chain.invoke({
                "topic": topic,
                "context": "\n".join(context_documents),
                "format_instructions": self.parser.get_format_instructions()
            })
            return result
        except Exception as e:
            print(f"Error during debate execution: {e}")
            # Fallback mock for testing without API keys
            return ExecutiveSummary(
                proponent_arguments=[DebateClaim(claim="System Error", evidence=str(e), citation_url="#")],
                skeptic_arguments=[],
                synthesis="The AI agents failed to connect to the Google Generative AI API. Please verify GEMINI_API_KEY.",
                overall_sentiment="System Error"
            )

# Example execution if run directly
if __name__ == "__main__":
    orchestrator = DebateOrchestrator()
    summary = orchestrator.run_debate("Video claiming the moon is made of cheese", ["Article 1: The moon is rock.", "Article 2: Cheese rumors false."])
    pprint(summary.dict())
