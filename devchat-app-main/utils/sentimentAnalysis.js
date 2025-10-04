// Utility functions for sentiment analysis

// Get sentiment analysis for a user's chat history
const getSentimentAnalysis = async (userId, timeRange) => {
  // In a real app, this would call your backend API
  // For this demo, we'll return mock data

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Mock sentiment data
  const sentimentData = {
    overall: {
      positive: 60,
      neutral: 30,
      negative: 10,
    },
    overtime: [
      { date: "2023-01-01", positive: 65, neutral: 28, negative: 7 },
      { date: "2023-01-02", positive: 59, neutral: 31, negative: 10 },
      { date: "2023-01-03", positive: 70, neutral: 20, negative: 10 },
      { date: "2023-01-04", positive: 55, neutral: 35, negative: 10 },
      { date: "2023-01-05", positive: 62, neutral: 28, negative: 10 },
      { date: "2023-01-06", positive: 68, neutral: 22, negative: 10 },
      { date: "2023-01-07", positive: 72, neutral: 18, negative: 10 },
    ],
    channels: [
      { name: "general", positive: 55, neutral: 35, negative: 10 },
      { name: "javascript", positive: 60, neutral: 30, negative: 10 },
      { name: "react", positive: 70, neutral: 25, negative: 5 },
      { name: "python", positive: 65, neutral: 25, negative: 10 },
      { name: "beginners", positive: 75, neutral: 20, negative: 5 },
    ],
    keywords: [
      { word: "help", count: 42, sentiment: "neutral" },
      { word: "thanks", count: 38, sentiment: "positive" },
      { word: "great", count: 35, sentiment: "positive" },
      { word: "issue", count: 30, sentiment: "negative" },
      { word: "awesome", count: 25, sentiment: "positive" },
    ],
    insights: [
      "Your communication is mostly positive (60%), which helps create a supportive environment.",
      'The "React" channel shows the most positive sentiment (70%).',
      "Your messages tend to be more positive in the mornings compared to evenings.",
    ],
  }

  return sentimentData
}

// Analyze text for sentiment
const analyzeSentiment = (text) => {
  // In a real app, this would use a proper NLP library or API
  // For this demo, we'll do a very basic analysis

  if (!text) return { score: 0, label: "neutral" }

  const positiveWords = ["good", "great", "excellent", "awesome", "thanks", "love", "helpful", "appreciate"]
  const negativeWords = ["bad", "terrible", "awful", "hate", "issue", "problem", "error", "bug", "wrong"]

  const words = text.toLowerCase().split(/\W+/)

  let positiveCount = 0
  let negativeCount = 0

  words.forEach((word) => {
    if (positiveWords.includes(word)) positiveCount++
    if (negativeWords.includes(word)) negativeCount++
  })

  const score = (positiveCount - negativeCount) / words.length

  let label = "neutral"
  if (score > 0.05) label = "positive"
  if (score < -0.05) label = "negative"

  return { score, label }
}

export { getSentimentAnalysis, analyzeSentiment }
