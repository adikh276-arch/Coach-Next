// English source strings — keys used for translation
export const EN_STRINGS: Record<string, string> = {
  // Header
  "app.title": "Emotional Regulation Tracker",
  "app.description.new": "Track your emotional patterns to build deeper self-awareness.",
  "app.description.edit": "You've already logged today — feel free to update your entry.",

  // Sliders
  "slider.stability": "Emotional Stability",
  "slider.stability.desc": "How calm, balanced, and in control of your emotions did you feel today?",
  "slider.stress": "Stress Intensity",
  "slider.stress.desc": "How much pressure or overwhelm did you experience today?",
  "slider.low": "Low",
  "slider.high": "High",

  // Challenge
  "challenge.label": "Did you face a difficult situation today?",
  "challenge.desc": "Any conflict, pressure, or emotionally tough moment you had to navigate.",
  "challenge.yes": "Yes, I did",
  "challenge.no": "Today went well",

  // Response Quality
  "response.label": "How did you handle it?",
  "response.desc": "Reflect on how you responded to the challenge.",
  "response.reactive": "Reactive",
  "response.reactive.desc": "Impulsive, emotional response",
  "response.managed": "Managed",
  "response.managed.desc": "Kept it together, some struggle",
  "response.composed": "Composed",
  "response.composed.desc": "Calm and thoughtful response",
  "response.strategic": "Strategic",
  "response.strategic.desc": "Intentional, well-planned response",

  // Context
  "context.add": "+ Add context (optional)",
  "context.hide": "Hide context",
  "context.placeholder": "Briefly describe the situation…",

  // Thoughts
  "thoughts.label": "Share Your Thoughts",
  "thoughts.optional": "Optional",
  "thoughts.placeholder": "How are you feeling right now? Any reflections on your day…",

  // Save
  "save.new": "Save Today's Reflection",
  "save.saved": "✓ Reflection Saved!",

  // Insights
  "insights.show": "Show Insights",
  "insights.hide": "Hide Insights",
  "insights.locked": "Log at least 3 days to unlock emotional insights.",
  "insights.locked.bold": "3 days",
  "insights.avg_stability": "Avg Stability",
  "insights.avg_stress": "Avg Stress",
  "insights.challenge_ratio": "Difficult Days",
  "insights.stability_title": "Emotional Stability",
  "insights.stress_title": "Stress Intensity",
  "insights.description": "Based on your logged entries — averages and trends over time.",

  // History
  "history.show": "Show History",
  "history.hide": "Hide History",
  "history.empty": "No entries yet. Start tracking today!",
  "history.stability": "Stability",
  "history.stress": "Stress",
  "history.challenge": "Difficult Situation",
  "history.response": "Response",

  // Toast
  "toast.saved": "Reflection saved successfully!",
  "toast.updated": "Entry updated",
};

export type StringKey = keyof typeof EN_STRINGS;
