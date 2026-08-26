import { WordData } from "./words";

/**
 * AI Manager - Fully dynamic content generation using user-provided API
 * This module ensures the game never repeats words by fetching fresh data from an LLM.
 */

const AI_API_KEY = "AQ.Ab8RN6LbunZpmOmgI9nRQeaUvFe451RvrSp0jYtXYxRwMyNAgQ";
const API_URL = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation";

export class AiManager {
  /**
   * Helper to perform API calls to the DashScope/Qwen model
   */
  private static async callAi(prompt: string, systemPrompt: string = "You are a helpful game assistant."): Promise<string | null> {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${AI_API_KEY}`
        },
        body: JSON.stringify({
          model: "qwen-max",
          input: {
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: prompt }
            ]
          },
          parameters: { result_format: "message" }
        })
      });

      const data = await response.json();
      if (!response.ok) return null;
      return data.output?.choices?.[0]?.message?.content || null;
    } catch (e) {
      console.error("[AI] API Call Failed:", e);
      return null;
    }
  }

  /**
   * Generates a completely unique secret word and related questions using AI.
   */
  public static async generateDynamicWord(category: string, difficulty: string, usedWords: string[]): Promise<WordData | null> {
    const prompt = `
      ACT AS A SOCIAL DEDUCTION GAME MASTER.
      TASK: Generate exactly ONE unique secret word/title for the category: "${category}".
      DIFFICULTY: ${difficulty}.

      CRITICAL CONSTRAINTS:
      1. DO NOT REPEAT any of these words: ${usedWords.join(", ")}.
      2. If category is "tamil_movies", provide a highly recognizable Tamil film title.
      3. Output MUST be valid JSON.

      REQUIRED JSON STRUCTURE:
      {
        "word": "Secret Word",
        "wordTa": "Tamil Translation",
        "wordHi": "Hindi Translation",
        "liarNormal": "Normal player question (e.g., 'Is the protagonist a hero?')",
        "liarNormalTa": "Tamil version of normal question",
        "liarLiar": "Liar player question (vague variation)",
        "liarLiarTa": "Tamil version of liar question"
      }
    `;

    const content = await this.callAi(prompt, "You only output STRICT JSON.");
    if (!content) return null;

    try {
      const jsonStr = content.match(/\{[\s\S]*\}/)?.[0] || content;
      const result = JSON.parse(jsonStr);
      return { category, difficulty: difficulty as any, ...result };
    } catch (e) {
      return null;
    }
  }

  /**
   * AI FEATURE: Bot Clue Generation
   * Generates a contextually appropriate clue for an AI bot.
   */
  public static async generateBotClue(role: string, secretWord: string, existingClues: string[]): Promise<string> {
    const persona = role === "impostor" ? "an infiltrator bluffing" : "a civilian agent giving a helpful but cryptic hint";
    const prompt = `
      You are an AI player in an Impostor game.
      Your role is: ${role}.
      The secret word is: "${secretWord}".
      Existing clues: ${existingClues.join(", ")}.

      Provide a SINGLE word clue as ${persona}.
      Respond with ONLY the single word.
    `;

    const content = await this.callAi(prompt, "You are a strategic AI game player.");
    return content?.trim().split(" ")[0].replace(/[^a-zA-Z]/g, "") || "Data";
  }

  /**
   * AI FEATURE: Mission Briefing
   * Generates a cinematic context for the start of the round.
   */
  public static async generateMissionBriefing(category: string, word: string): Promise<string> {
    const prompt = `Write a 1-sentence mysterious mission briefing for a group of agents investigating "${word}" in the "${category}" sector. Use tech-noir style.`;
    const content = await this.callAi(prompt);
    return content || "Initializing neural link... data extraction in progress.";
  }

  /**
   * AI FEATURE: Real-time Anomaly Detection
   * Analyzes player clues and identifies the most statistically improbable one.
   */
  public static async analyzeAnomaly(clues: { name: string, text: string }[], secretWord: string): Promise<string | null> {
    if (clues.length < 3) return null;

    const clueList = clues.map(c => `${c.name}: "${c.text}"`).join("\n");
    const prompt = `
      The secret word is "${secretWord}".
      Here are the clues provided by players:
      ${clueList}

      Identify which player's clue is most likely a bluff (doesn't fit the word well).
      Respond with ONLY the player's name. If unsure, respond with "NONE".
    `;

    const content = await this.callAi(prompt, "You are a data analyst identifying anomalies.");
    if (!content || content.includes("NONE")) return null;

    // Clean up response to get just the name
    return content.trim().replace(/[".]/g, "");
  }

  /**
   * AI FEATURE: Cinematic Recap
   * Generates a dramatic summary of the round results.
   */
  public static async generateRoundRecap(isWin: boolean, word: string, targetName?: string): Promise<string> {
    const prompt = isWin
      ? `Generate a short, 1-sentence victory message for catching the infiltrator who failed to hide behind the keyword "${word}".`
      : `Generate a short, 1-sentence failure message for letting the infiltrator escape while they successfully spoofed the keyword "${word}".`;

    const content = await this.callAi(prompt);
    return content || (isWin ? "Threat eliminated. System integrity restored." : "Protocol breach. Target has vanished into the network.");
  }

  public static suggestCategory(): string {
    const categories = ["tamil_movies", "technology", "indian_culture", "nature", "food", "objects", "animals", "places", "movies", "sports", "school", "professions", "festivals", "games", "daily_life", "tamil_nadu"];
    return categories[Math.floor(Math.random() * categories.length)];
  }

  /**
   * AI FEATURE: Strategic Role Assignment
   * Selects an Impostor based on fairness and occasional "Chaos" (repetition).
   */
  public static selectStrategicImpostor(playerIds: string[], pastImpostors: string[], count: number): string[] {
    // Determine if this round should be "Chaos Mode" (25% chance)
    // In Chaos Mode, history is ignored, allowing for double-impostor rounds.
    const isChaosMode = Math.random() < 0.25;

    let potentialPool: string[];

    if (isChaosMode) {
      console.log("[AI] Chaos Assignment: Ignoring history for role selection.");
      potentialPool = playerIds;
    } else {
      // Fair Logic: Prioritize people who have NEVER been the impostor in this session.
      const neverImpostors = playerIds.filter(id => !pastImpostors.includes(id));
      potentialPool = neverImpostors.length >= count ? neverImpostors : playerIds;
    }

    // Proper Fisher-Yates Shuffle for the pool
    const shuffled = [...potentialPool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, count);
  }
}
