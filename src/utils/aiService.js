const API_KEY = "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";
const MODEL = "qwen/qwen2.5-vl-72b-instruct:free";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function getAIRecommendation(prompt, imageUrl = null) {
  const messages = [
    {
      role: "user",
      content: imageUrl 
        ? [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: imageUrl } }
          ]
        : prompt
    }
  ];

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
        "HTTP-Referer": "https://v0-mobile-water-tracker.vercel.app/",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: messages,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling AI service:", error);
    return "Sorry, I couldn't process your request at this time.";
  }
}

export async function getWaterRecommendation(weight, activity, climate) {
  const prompt = `Based on a weight of ${weight}kg, ${activity} activity level, and ${climate} climate, how much water should this person drink daily? Give a specific amount in ml and brief explanation.`;
  return getAIRecommendation(prompt);
}

export async function getCalorieRecommendation(weight, height, age, gender, activity) {
  const prompt = `Calculate daily calorie needs for a ${gender}, ${age} years old, ${height}cm tall, weighing ${weight}kg with ${activity} activity level. Give specific calorie amount and brief explanation.`;
  return getAIRecommendation(prompt);
}

export async function analyzeFood(imageUrl) {
  const prompt = "What food is in this image? Please estimate its calorie content and nutritional values.";
  return getAIRecommendation(prompt, imageUrl);
}
