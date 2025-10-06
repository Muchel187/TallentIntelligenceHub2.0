/**
 * OpenAI Service
 * Handles AI chat interactions and report generation
 */

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface BigFiveScores {
  O: number;
  C: number;
  E: number;
  A: number;
  N: number;
}

interface UserDetails {
  age: number;
  currentJob: string;
  industry: string;
  careerGoal: string;
  biggestChallenge: string;
  experienceLevel: string;
  workEnvironment: string;
}

/**
 * Generate AI-powered career coaching response
 */
export async function generateChatResponse(
  message: string,
  scores: BigFiveScores,
  userDetails: UserDetails,
  chatHistory: ChatMessage[] = []
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  // Build system prompt with personality context
  const systemPrompt = `You are an expert career coach and personality psychologist.
You are helping a professional with the following Big Five personality profile:
- Openness: ${scores.O} (${interpretScore(scores.O)})
- Conscientiousness: ${scores.C} (${interpretScore(scores.C)})
- Extraversion: ${scores.E} (${interpretScore(scores.E)})
- Agreeableness: ${scores.A} (${interpretScore(scores.A)})
- Neuroticism: ${scores.N} (${interpretScore(scores.N)})

User background:
- Role: ${userDetails.currentJob}
- Industry: ${userDetails.industry}
- Experience Level: ${userDetails.experienceLevel}
- Work Environment: ${userDetails.workEnvironment}
- Career Goal: ${userDetails.careerGoal}
- Biggest Challenge: ${userDetails.biggestChallenge}

Provide specific, actionable advice that considers their personality traits and professional context.
Be encouraging but honest. Use concrete examples when possible.`;

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    ...chatHistory.slice(-10), // Last 10 messages for context
    { role: 'user', content: message },
  ];

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API request failed');
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'I apologize, I could not generate a response.';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

/**
 * Generate streaming AI chat response
 */
export async function generateStreamingChatResponse(
  message: string,
  scores: BigFiveScores,
  userDetails: UserDetails,
  chatHistory: ChatMessage[] = []
): Promise<ReadableStream> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const systemPrompt = `You are an expert career coach and personality psychologist.
You are helping a professional with the following Big Five personality profile:
- Openness: ${scores.O} (${interpretScore(scores.O)})
- Conscientiousness: ${scores.C} (${interpretScore(scores.C)})
- Extraversion: ${scores.E} (${interpretScore(scores.E)})
- Agreeableness: ${scores.A} (${interpretScore(scores.A)})
- Neuroticism: ${scores.N} (${interpretScore(scores.N)})

User background:
- Role: ${userDetails.currentJob}
- Industry: ${userDetails.industry}
- Experience Level: ${userDetails.experienceLevel}
- Work Environment: ${userDetails.workEnvironment}
- Career Goal: ${userDetails.careerGoal}
- Biggest Challenge: ${userDetails.biggestChallenge}

Provide specific, actionable advice that considers their personality traits and professional context.
Be encouraging but honest. Use concrete examples when possible.`;

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    ...chatHistory.slice(-10),
    { role: 'user', content: message },
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo-preview',
      messages,
      temperature: 0.7,
      max_tokens: 1000,
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'OpenAI API request failed');
  }

  // Transform OpenAI stream to text stream
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  return new ReadableStream({
    async start(controller) {
      const reader = response.body?.getReader();
      if (!reader) {
        controller.close();
        return;
      }

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter((line) => line.trim() !== '');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices[0]?.delta?.content;
                if (content) {
                  controller.enqueue(encoder.encode(content));
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      } catch (error) {
        controller.error(error);
      } finally {
        controller.close();
      }
    },
  });
}

/**
 * Generate comprehensive personality report
 */
export async function generatePersonalityReport(
  scores: BigFiveScores,
  userDetails: UserDetails
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const prompt = `Create a comprehensive, personalized career development report based on this Big Five personality assessment:

**Personality Profile:**
- Openness: ${scores.O}/120 (${interpretScore(scores.O)})
- Conscientiousness: ${scores.C}/120 (${interpretScore(scores.C)})
- Extraversion: ${scores.E}/120 (${interpretScore(scores.E)})
- Agreeableness: ${scores.A}/120 (${interpretScore(scores.A)})
- Neuroticism: ${scores.N}/120 (${interpretScore(scores.N)})

**Professional Context:**
- Age: ${userDetails.age}
- Current Job: ${userDetails.currentJob}
- Industry: ${userDetails.industry}
- Experience Level: ${userDetails.experienceLevel}
- Work Environment: ${userDetails.workEnvironment}
- Career Goal: ${userDetails.careerGoal}
- Biggest Challenge: ${userDetails.biggestChallenge}

Create a detailed 5-6 page report with these sections:

## 1. Executive Summary
Brief overview of personality strengths and areas for development

## 2. Detailed Trait Analysis
Deep dive into each Big Five dimension with specific examples relevant to their industry

## 3. Career Recommendations
Specific role types, work environments, and career paths that align with this profile

## 4. Leadership & Team Dynamics
How this personality impacts leadership style and team collaboration

## 5. Development Plan
Concrete action steps to leverage strengths and address challenges

## 6. Resources & Next Steps
Books, courses, podcasts, and practices tailored to this profile

Use a professional but encouraging tone. Be specific and actionable. Avoid generic platitudes.
Format in Markdown.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: 'You are an expert career coach and organizational psychologist.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API request failed');
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenAI report generation error:', error);
    throw error;
  }
}

/**
 * Interpret score level
 */
function interpretScore(score: number): string {
  if (score < 60) return 'Low';
  if (score > 90) return 'High';
  return 'Average';
}
