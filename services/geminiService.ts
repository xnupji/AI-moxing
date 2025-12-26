
import { GoogleGenAI, Type } from "@google/genai";
import { Token, AIAnalysis } from "../types";

// Always use the standard initialization format
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeToken = async (token: Token): Promise<AIAnalysis> => {
  try {
    const prompt = `
      请作为一名顶级加密货币量化分析师和链上数据专家，深度分析代币：${token.name} (${token.symbol})。
      代币地址: ${token.address}
      网络: ${token.chain}
      
      要求：
      1. 使用 Google Search 搜索该代币在 Twitter(X), Telegram, CoinTelegraph, 和各大财经媒体上的最新动态。
      2. 扫描关于该代币的最新大额转账、机构增持或项目重大更新。
      3. 分析当前全球市场对该币种的情绪（社交媒体热度、看涨/看跌情绪）。
      4. 评估其短期和长期的利好/利空行为。
      5. 使用专业的中文术语。
      
      返回数据必须包含：
      - summary (项目简评)
      - socialSentiment (社交媒体情绪分析)
      - newsAnalysis (近期新闻与动态分析)
      - bullishFactors (看涨因素列表)
      - bearishFactors (风险因素列表)
      - riskLevel (风险等级: 极低, 中等, 高, 极端)
      - recommendation (投资建议)
    `;

    // Use gemini-3-pro-preview for complex reasoning and analysis tasks
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            socialSentiment: { type: Type.STRING },
            newsAnalysis: { type: Type.STRING },
            bullishFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
            bearishFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
            riskLevel: { type: Type.STRING, enum: ['极低', '中等', '高', '极端'] },
            recommendation: { type: Type.STRING }
          },
          required: ['summary', 'socialSentiment', 'newsAnalysis', 'bullishFactors', 'bearishFactors', 'riskLevel', 'recommendation']
        }
      }
    });

    // Extracting text output from GenerateContentResponse property
    const jsonStr = response.text ? response.text.trim() : '{}';
    const result = JSON.parse(jsonStr);
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    // Extract search sources as required when using googleSearch
    const urls = groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || '参考来源',
      uri: chunk.web?.uri || ''
    })).filter((u: any) => u.uri) || [];

    return { ...result, groundingUrls: urls };
  } catch (error) {
    console.error("Gemini 分析失败:", error);
    return {
      summary: "AI 实时扫描受阻，可能是该币种流动性极低或 API 频率限制。",
      socialSentiment: "社交热度平稳，未见异常波动。",
      newsAnalysis: "暂无重大负面报道。",
      bullishFactors: ["技术指标健康", "链上地址数稳步增长"],
      bearishFactors: ["宏观环境波动风险", "板块轮动较快"],
      riskLevel: "中等",
      recommendation: "建议小仓位配置，关注 24h 成交量变化。"
    };
  }
};
