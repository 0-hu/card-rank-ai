import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is missing. Please add it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Allow large base64 uploads
app.use(express.json({ limit: "50mb" }));

// Card analysis API endpoint
app.post("/api/analyze", async (req, res) => {
  try {
    const { frontImage, backImage } = req.body;

    if (!frontImage || !backImage) {
      return res.status(400).json({ error: "Both front and back card images are required for grading." });
    }

    // Helper to extract base64 components
    const parseBase64Image = (dataUrl: string) => {
      const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        throw new Error("Invalid image data format. Must be a base64 data URL.");
      }
      return {
        mimeType: matches[1],
        data: matches[2],
      };
    };

    let parsedFront, parsedBack;
    try {
      parsedFront = parseBase64Image(frontImage);
      parsedBack = parseBase64Image(backImage);
    } catch (err: any) {
      return res.status(400).json({ error: err.message || "Failed to process image data." });
    }

    const ai = getAiClient();

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        front: {
          type: Type.OBJECT,
          properties: {
            centering: {
              type: Type.OBJECT,
              properties: {
                ratio: { type: Type.STRING, description: "Borders centering ratio, e.g., '55/45' or '60/40'" },
                sub_grade: { type: Type.INTEGER, description: "Sub-grade integer from 1 to 10" },
                assessment: { type: Type.STRING, description: "Detail of centering on front, in Korean" }
              },
              required: ["ratio", "sub_grade", "assessment"]
            },
            corners: {
              type: Type.OBJECT,
              properties: {
                sub_grade: { type: Type.INTEGER, description: "Sub-grade integer from 1 to 10" },
                assessment: { type: Type.STRING, description: "Detail of corners condition on front, in Korean" }
              },
              required: ["sub_grade", "assessment"]
            },
            edges: {
              type: Type.OBJECT,
              properties: {
                sub_grade: { type: Type.INTEGER, description: "Sub-grade integer from 1 to 10" },
                assessment: { type: Type.STRING, description: "Detail of edges condition on front, in Korean" }
              },
              required: ["sub_grade", "assessment"]
            },
            surface: {
              type: Type.OBJECT,
              properties: {
                sub_grade: { type: Type.INTEGER, description: "Sub-grade integer from 1 to 10" },
                assessment: { type: Type.STRING, description: "Detail of surface condition on front, in Korean" }
              },
              required: ["sub_grade", "assessment"]
            }
          },
          required: ["centering", "corners", "edges", "surface"]
        },
        back: {
          type: Type.OBJECT,
          properties: {
            centering: {
              type: Type.OBJECT,
              properties: {
                ratio: { type: Type.STRING, description: "Borders centering ratio, e.g., '52/48' or '55/45'" },
                sub_grade: { type: Type.INTEGER, description: "Sub-grade integer from 1 to 10" },
                assessment: { type: Type.STRING, description: "Detail of centering on back, in Korean" }
              },
              required: ["ratio", "sub_grade", "assessment"]
            },
            corners: {
              type: Type.OBJECT,
              properties: {
                sub_grade: { type: Type.INTEGER, description: "Sub-grade integer from 1 to 10" },
                assessment: { type: Type.STRING, description: "Detail of corners condition on back, in Korean" }
              },
              required: ["sub_grade", "assessment"]
            },
            edges: {
              type: Type.OBJECT,
              properties: {
                sub_grade: { type: Type.INTEGER, description: "Sub-grade integer from 1 to 10" },
                assessment: { type: Type.STRING, description: "Detail of edges condition on back, in Korean" }
              },
              required: ["sub_grade", "assessment"]
            },
            surface: {
              type: Type.OBJECT,
              properties: {
                sub_grade: { type: Type.INTEGER, description: "Sub-grade integer from 1 to 10" },
                assessment: { type: Type.STRING, description: "Detail of surface condition on back, in Korean" }
              },
              required: ["sub_grade", "assessment"]
            }
          },
          required: ["centering", "corners", "edges", "surface"]
        }
      },
      required: ["front", "back"]
    };

    const frontImagePart = {
      inlineData: {
        mimeType: parsedFront.mimeType,
        data: parsedFront.data,
      },
    };

    const backImagePart = {
      inlineData: {
        mimeType: parsedBack.mimeType,
        data: parsedBack.data,
      },
    };

    const promptText = `
      You are an expert TCG (Trading Card Game) card grader, following precise PSA grading standards.
      Analyze the attached Front image and Back image of a generic TCG card.
      Evaluate the 4 core grading components: Centering, Corners, Edges, and Surface for both front and back.
      
      For Centering:
      - Assess the borders (outer borders on front and back).
      - Estimate the centering ratio (e.g., "50/50", "60/40", "70/30") for left/right and top/bottom.
      - Assign a sub-grade integer between 1 and 10 based on how well centered it is.
      
      For Corners:
      - Look for fraying, whitening, chipping, or bending.
      - Assign a sub-grade integer between 1 and 10.
      
      For Edges:
      - Look for chipping, whitening, dents, or cuts on borders.
      - Assign a sub-grade integer between 1 and 10.
      
      For Surface:
      - Look for scratches, creases, prints lines, stains, cloudiness, or loss of gloss.
      - Assign a sub-grade integer between 1 and 10.

      Provide detailed, professional grading descriptions ("assessment") in Korean for all components.
      Return the final output strictly matching the provided JSON schema.
    `;

    const geminiResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [frontImagePart, backImagePart, promptText],
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
      },
    });

    if (!geminiResponse.text) {
      throw new Error("Gemini returned an empty response. Please try again with clear photos.");
    }

    const rawResult = JSON.parse(geminiResponse.text);

    // Compute Estimated PSA Grade using the requested integration formula (§5.4)
    const subGrades = [
      rawResult.front.centering.sub_grade,
      rawResult.front.corners.sub_grade,
      rawResult.front.edges.sub_grade,
      rawResult.front.surface.sub_grade,
      rawResult.back.centering.sub_grade,
      rawResult.back.corners.sub_grade,
      rawResult.back.edges.sub_grade,
      rawResult.back.surface.sub_grade,
    ];

    const minGrade = Math.min(...subGrades);

    // Calculate other avg grade
    const otherGrades = [...subGrades];
    const minIndex = otherGrades.indexOf(minGrade);
    if (minIndex !== -1) {
      otherGrades.splice(minIndex, 1);
    }
    const otherAvg = otherGrades.reduce((sum, val) => sum + val, 0) / otherGrades.length;

    let estimatedPsa = minGrade;
    // (나머지 항목 평균 - min) >= 2 이면 +0.5 보정
    if ((otherAvg - minGrade) >= 2) {
      estimatedPsa += 0.5;
    }

    // Clamp estimatedPsa to 1-10
    estimatedPsa = Math.min(10, Math.max(1, estimatedPsa));

    // estimated_range = estimated_psa 기준 ±1
    const rangeLow = Math.max(1, Math.floor(estimatedPsa - 1));
    const rangeHigh = Math.min(10, Math.ceil(estimatedPsa + 1));
    const estimatedRange = rangeLow === rangeHigh ? `${rangeLow}` : `${rangeLow}-${rangeHigh}`;

    const finalResponse = {
      ...rawResult,
      estimated_psa: estimatedPsa,
      estimated_range: estimatedRange,
      disclaimer: "본 결과는 참고용 추정치이며 실제 PSA 감정 결과와 다를 수 있습니다."
    };

    return res.json(finalResponse);

  } catch (err: any) {
    console.error("Analysis Error:", err);
    return res.status(500).json({ error: err.message || "An error occurred during card analysis." });
  }
});

// Setup development server or serve static build
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();
