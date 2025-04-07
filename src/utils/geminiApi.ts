
/**
 * Gemini API integration for intelligent chat responses
 */

// Note: In a production app, this key should not be exposed in frontend code
// For a hackathon, we'll use it directly for demo purposes
const GEMINI_API_KEY = "AIzaSyDE9QXM1Ppi-bEdkdxqHi89lPzc5adZ4wg";
const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";

export interface GeminiResponse {
  text: string;
  isComplaint: boolean;
  isEscalation: boolean;
  suggestedSolution?: string;
  category?: 'hostel' | 'mess' | 'other';
}

/**
 * Process a user message using Gemini API
 * @param message User message to process
 * @param history Previous chat history for context
 */
export const processWithGemini = async (
  message: string,
  history: Array<{role: string, content: string}> = []
): Promise<GeminiResponse> => {
  try {
    // Build prompt with system instructions and history
    const systemPrompt = `You are an AI assistant for a university hostel and mess system. 
    Your role is to help students with their queries and complaints. 
    
    If a student has a complaint:
    1. Identify if it's related to hostel facilities, mess food, or something else
    2. Determine if it needs escalation (serious issues like safety concerns, major facility breakdowns, health hazards)
    3. Suggest a possible solution
    
    Respond in JSON format with these fields:
    - text: Your helpful response to the student
    - isComplaint: true if this is a complaint, false if it's just a query
    - isEscalation: true if this requires escalation to administration
    - category: "hostel", "mess", or "other"
    - suggestedSolution: your recommendation to solve the issue (only if isComplaint is true)
    
    Keep your responses helpful, empathetic, and concise.`;
    
    // Build the complete prompt with history and current message
    const fullPrompt = [
      { role: "system", content: systemPrompt },
      ...history,
      { role: "user", content: message }
    ];
    
    // Prepare request to Gemini API
    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: fullPrompt.map(item => ({
          role: item.role === 'system' ? 'user' : item.role,
          parts: [{ text: item.content }]
        })),
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        }
      })
    });

    if (!response.ok) {
      console.error('Gemini API error:', await response.text());
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Try to parse JSON response
    try {
      // Extract JSON from the response (might be wrapped in code blocks)
      const jsonMatch = generatedText.match(/```json\n([\s\S]*?)\n```/) || 
                        generatedText.match(/```([\s\S]*?)```/) ||
                        [null, generatedText];
      
      const jsonString = jsonMatch[1] || generatedText;
      const parsedResponse = JSON.parse(jsonString);
      
      return {
        text: parsedResponse.text || 'Sorry, I had trouble understanding. Could you rephrase that?',
        isComplaint: Boolean(parsedResponse.isComplaint),
        isEscalation: Boolean(parsedResponse.isEscalation), 
        suggestedSolution: parsedResponse.suggestedSolution,
        category: parsedResponse.category as 'hostel' | 'mess' | 'other'
      };
    } catch (e) {
      console.error('Error parsing Gemini response as JSON:', e);
      // Fallback response if parsing fails
      return {
        text: generatedText || 'I encountered an error processing your request. Please try again.',
        isComplaint: /complaint|issue|problem|broken|not working/i.test(message),
        isEscalation: false
      };
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // Fallback to basic processing if API fails
    return {
      text: "I'm having trouble connecting to my intelligence service. Let me help you with basic assistance instead.",
      isComplaint: /complaint|issue|problem|broken|not working/i.test(message),
      isEscalation: false
    };
  }
};
