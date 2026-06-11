import OpenAI from "openai";
import { z } from "zod";
import { applyLearningCalibration } from "@/lib/analytics/learning";
import { analyzeMatch } from "@/lib/analyst-agent";
import { openAiApiKey, openAiModel } from "@/lib/env";
import type { AnalystResult, CSMatch, LearningProfile, LiveSnapshot } from "@/lib/types";

const analystOutputSchema = z.object({
  summary: z.string().min(20).max(700),
  confidence: z.number().int().min(1).max(100),
  recommendedAction: z.enum(["Bet Team A", "Bet Team B", "Wait Live", "Avoid"]),
  teamAProbability: z.number().int().min(1).max(99),
  teamBProbability: z.number().int().min(1).max(99),
  mapInsights: z
    .array(
      z.object({
        map: z.string().min(2).max(40),
        teamAStatus: z.enum(["strong", "weak", "even"]),
        teamBStatus: z.enum(["strong", "weak", "even"]),
        edge: z.number().int().min(-100).max(100),
        summary: z.string().min(12).max(260),
        suggestedAngle: z.string().min(12).max(260),
      }),
    )
    .max(7),
  reasoning: z.array(z.string().min(8).max(260)).min(3).max(6),
  riskFlags: z.array(z.string().min(8).max(260)).min(2).max(6),
});

const jsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "summary",
    "confidence",
    "recommendedAction",
    "teamAProbability",
    "teamBProbability",
    "mapInsights",
    "reasoning",
    "riskFlags",
  ],
  properties: {
    summary: { type: "string" },
    confidence: { type: "integer", minimum: 1, maximum: 100 },
    recommendedAction: {
      type: "string",
      enum: ["Bet Team A", "Bet Team B", "Wait Live", "Avoid"],
    },
    teamAProbability: { type: "integer", minimum: 1, maximum: 99 },
    teamBProbability: { type: "integer", minimum: 1, maximum: 99 },
    mapInsights: {
      type: "array",
      maxItems: 7,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "map",
          "teamAStatus",
          "teamBStatus",
          "edge",
          "summary",
          "suggestedAngle",
        ],
        properties: {
          map: { type: "string" },
          teamAStatus: { type: "string", enum: ["strong", "weak", "even"] },
          teamBStatus: { type: "string", enum: ["strong", "weak", "even"] },
          edge: { type: "integer", minimum: -100, maximum: 100 },
          summary: { type: "string" },
          suggestedAngle: { type: "string" },
        },
      },
    },
    reasoning: {
      type: "array",
      minItems: 3,
      maxItems: 6,
      items: { type: "string" },
    },
    riskFlags: {
      type: "array",
      minItems: 2,
      maxItems: 6,
      items: { type: "string" },
    },
  },
};

function normalizeProbabilities(teamAProbability: number, teamBProbability: number) {
  const total = teamAProbability + teamBProbability;
  if (total === 100) return { teamAProbability, teamBProbability };

  const normalizedA = Math.max(1, Math.min(99, Math.round((teamAProbability / total) * 100)));
  return {
    teamAProbability: normalizedA,
    teamBProbability: 100 - normalizedA,
  };
}

export async function analyzeMatchWithOpenAI(
  match: CSMatch,
  live?: LiveSnapshot,
  learningProfile?: LearningProfile,
): Promise<AnalystResult> {
  const localResult = analyzeMatch(match, live);
  const fallback = learningProfile
    ? applyLearningCalibration(localResult, learningProfile)
    : localResult;

  if (!openAiApiKey) {
    return fallback;
  }

  try {
    const client = new OpenAI({ apiKey: openAiApiKey });
    const response = await client.responses.create({
      model: openAiModel,
      reasoning: { effort: "low" },
      input: [
        {
          role: "system",
          content:
            "You are a private CS2 betting research analyst. Use only the supplied JSON from approved APIs or manual stats. Do not claim certainty, do not give guaranteed betting advice, and do not reference scraped HLTV data. Return only the requested structured JSON.",
        },
        {
          role: "user",
          content: JSON.stringify({
            task: "Analyze this CS2 match for personal research.",
            requiredActions: ["Bet Team A", "Bet Team B", "Wait Live", "Avoid"],
            mapWeaknessTask:
              "For every available map win-rate sample, identify which team is strong, weak, or even. Include CT-side, T-side, pistol, sample-size, and veto context when those fields exist. Keep each map explanation short and practical.",
            match,
            liveSnapshot: live ?? null,
            baselineModel: fallback,
            learningProfile: learningProfile ?? null,
          }),
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "cs2_match_prediction",
          strict: true,
          schema: jsonSchema,
        },
      },
    });

    const parsed = analystOutputSchema.parse(JSON.parse(response.output_text));
    const probabilities = normalizeProbabilities(
      parsed.teamAProbability,
      parsed.teamBProbability,
    );

    const openAiResult: AnalystResult = {
      matchId: match.id,
      generatedAt: new Date().toISOString(),
      dataSources: match.providerSources,
      ...parsed,
      ...probabilities,
      riskFlags: [
        ...parsed.riskFlags,
        "OpenAI-backed research estimate only. It is not guaranteed betting advice.",
      ].slice(0, 6),
    };

    return learningProfile
      ? applyLearningCalibration(openAiResult, learningProfile)
      : openAiResult;
  } catch {
    return {
      ...fallback,
      riskFlags: [
        ...fallback.riskFlags,
        "OpenAI analysis was unavailable, so the local model fallback was used.",
      ],
    };
  }
}
