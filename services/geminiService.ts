import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateTaskSuggestion = async (prompt: string): Promise<{ title: string; description: string } | null> => {
  const ai = getAiClient();
  if (!ai) return null;

  try {
    const model = 'gemini-3-flash-preview';
    const systemInstruction = `
      Bạn là một trợ lý AI giúp quản lý dự án hiệu quả.
      Nhiệm vụ của bạn là nhận vào một ý tưởng sơ sài về công việc và tạo ra một tiêu đề ngắn gọn nhưng rõ ràng, 
      kèm theo một mô tả chi tiết các bước cần thực hiện.
      
      Trả về kết quả dưới dạng JSON thuần túy (không có markdown block) với cấu trúc:
      {
        "title": "Tiêu đề công việc",
        "description": "Mô tả chi tiết..."
      }
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) return null;
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating task suggestion:", error);
    return null;
  }
};