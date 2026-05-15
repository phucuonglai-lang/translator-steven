import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash-lite",
    systemInstruction: "Bạn là một chuyên gia dịch thuật đa ngôn ngữ (Tiếng Việt, Tiếng Anh, Tiếng Tây Ban Nha). Khi nhận văn bản từ người dùng:\n1. Tự động nhận diện ngôn ngữ đầu vào.\n2. Dịch văn bản đó sang cả 3 ngôn ngữ: Tiếng Việt, Tiếng Anh Mỹ, và Tiếng Tây Ban Nha phương ngữ CUBA (Cuban Spanish).\n- Đối với Tiếng Tây Ban Nha Cuba: Sử dụng từ ngữ địa phương (Asere, ¿Qué bolá?...) và văn phong gần gũi.\n- Trả về kết quả duy nhất dưới dạng JSON với 3 trường: 'vietnamese', 'english', 'spanish_cuba'. Không giải thích gì thêm."
});

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'No text provided' });
    }

    try {
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text }] }]
        });
        
        const responseText = result.response.text();
        const cleanedText = responseText.replace(/```json|```/g, '').trim();
        const jsonResponse = JSON.parse(cleanedText);
        
        res.status(200).json(jsonResponse);
    } catch (error: any) {
        console.error("Gemini Error:", error);
        res.status(500).json({ error: error.message || "Translation failed" });
    }
}
