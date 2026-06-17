import type { QuizTemplate } from "@/components/SelfCareQuizExercise";
import type { CheckinTemplate } from "@/components/SelfCareCheckinExercise";

export const selfCareQuiz: QuizTemplate = {
  id: "self-care-quiz",
  title: "Self-Care Quiz",
  description:
    "How good are you to yourself? Read the questions, then select what seems the most appropriate. There are no 'wrong' answers – simply choose the response that seems the most relevant for you right now.",
  questions: [
    {
      text: "I am up-to-date with my optometrist, dentist, and other health check-ups.",
      options: ["Yes", "Sometimes", "No"],
    },
    {
      text: "I am happy with my physical fitness and energy levels.",
      options: ["Yes", "Sometimes", "No"],
    },
    {
      text: "I eat a well-balanced diet most of the time and do not abuse my body with caffeine, alcohol or similar.",
      options: ["Yes", "Sometimes", "No"],
    },
    {
      text: "I get enough sleep and wake up feeling rested and refreshed.",
      options: ["Yes", "Sometimes", "No"],
    },
    {
      text: "I take time to relax and unwind regularly without feeling guilty.",
      options: ["Yes", "Sometimes", "No"],
    },
    {
      text: "I have hobbies or activities I enjoy outside of work that I do regularly.",
      options: ["Yes", "Sometimes", "No"],
    },
    {
      text: "I manage my stress levels well and have healthy coping mechanisms.",
      options: ["Yes", "Sometimes", "No"],
    },
    {
      text: "I set healthy boundaries with others and feel comfortable saying 'no'.",
      options: ["Yes", "Sometimes", "No"],
    },
    {
      text: "I take regular breaks during the day to stretch, walk, or breathe.",
      options: ["Yes", "Sometimes", "No"],
    },
    {
      text: "I make time for social connections and nurture my important relationships.",
      options: ["Yes", "Sometimes", "No"],
    },
    {
      text: "I drink enough water throughout the day to stay properly hydrated.",
      options: ["Yes", "Sometimes", "No"],
    },
    {
      text: "I practice mindfulness, meditation, or gratitude regularly.",
      options: ["Yes", "Sometimes", "No"],
    },
  ],
};

export const selfCareCheckin: CheckinTemplate = {
  id: "self-care-checkin",
  title: "Self-Care Check-In",
  description:
    "This brief activity aims to foster self-connection and identify your needs. Evaluate each question on a scale of 1 to 10, and ask yourself, \"What do I need?\". Then, address the quick questions below, focusing on just ONE action for yourself! Trust your initial instinct for scores; avoid 'should' scores and rely on your gut reaction.",
  categories: [
    { label: "My Energy Levels", color: "hsl(210,75%,50%)" },
    { label: "How Inspired I'm Feeling", color: "hsl(30,90%,55%)" },
    { label: "Fun and Play", color: "hsl(175,60%,40%)" },
    { label: "Physical Health & Fitness", color: "hsl(350,70%,55%)" },
    { label: "Emotional Well-being", color: "hsl(265,55%,45%)" },
    { label: "Quality of Sleep", color: "hsl(210,75%,50%)" },
    { label: "Work-Life Balance", color: "hsl(30,90%,55%)" },
    { label: "Connection with Others", color: "hsl(175,60%,40%)" },
  ],
};
