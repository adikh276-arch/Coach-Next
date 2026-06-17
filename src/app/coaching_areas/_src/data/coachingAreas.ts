// Category images are no longer used in favor of professional Lucide icons.

export type ExerciseColor = "navy" | "red" | "blue" | "purple" | "orange" | "teal" | "yellow" | "salmon";

export interface Exercise {
  title: string;
  lucideIcon: string;
  color: ExerciseColor;
}

export interface LearnItem {
  title: string;
}

export interface CoachingArea {
  id: string;
  name: string;
  image?: string;
  lucideIcon: string;
  bgColor: string;
  iconColor: string;
  exercises: Exercise[];
  learn: LearnItem[];
  resources: { type: "tips" | "quotes" | "ebooks"; title: string; subtitle: string }[];
}

export const exerciseColorMap: Record<ExerciseColor, string> = {
  navy: "bg-[hsl(220,55%,32%)]",
  red: "bg-[hsl(350,70%,55%)]",
  blue: "bg-[hsl(210,75%,50%)]",
  purple: "bg-[hsl(265,55%,45%)]",
  orange: "bg-[hsl(30,90%,55%)]",
  teal: "bg-[hsl(175,60%,40%)]",
  yellow: "bg-[hsl(45,90%,55%)]",
  salmon: "bg-[hsl(5,65%,65%)]",
};

export const coachingAreas: CoachingArea[] = [
  {
    id: "career",
    name: "Career",
    lucideIcon: "Briefcase",
    bgColor: "bg-coaching-career",
    iconColor: "text-blue-600",
    exercises: [
      { title: "Improvement Canvas", lucideIcon: "Presentation", color: "red" },
      { title: "SWOT Analysis", lucideIcon: "LayoutGrid", color: "blue" },
      { title: "Not To-Do List", lucideIcon: "ListChecks", color: "purple" },
      { title: "GROW", lucideIcon: "TrendingUp", color: "navy" },
    ],
    learn: [
      { title: "Career Transitions" },
      { title: "Personal Branding" },
      { title: "Networking" },
      { title: "Skill Development" },
    ],
    resources: [
      { type: "tips", title: "Tips", subtitle: "Get control of your life" },
      { type: "quotes", title: "Quotes", subtitle: "One day at a time" },
      { type: "ebooks", title: "Ebooks", subtitle: "Books are a man's best friend" },
    ],
  },
  {
    id: "executive",
    name: "Executive",
    lucideIcon: "UserCog",
    bgColor: "bg-coaching-executive",
    iconColor: "text-slate-700",
    exercises: [
      { title: "GROW", lucideIcon: "TrendingUp", color: "navy" },
      { title: "Improvement Canvas", lucideIcon: "Presentation", color: "red" },
      { title: "SWOT Analysis", lucideIcon: "LayoutGrid", color: "teal" },
      { title: "Not To-Do List", lucideIcon: "ListChecks", color: "purple" },
    ],
    learn: [
      { title: "6 Coaching Principles" },
      { title: "7 Coaching Benefits" },
      { title: "Hidden Advantages" },
      { title: "Unlock Potential" },
    ],
    resources: [
      { type: "tips", title: "Tips", subtitle: "Get control of your life" },
      { type: "quotes", title: "Quotes", subtitle: "One day at a time" },
      { type: "ebooks", title: "Ebooks", subtitle: "Books are a man's best friend" },
    ],
  },
  {
    id: "wellness",
    name: "Wellness",
    lucideIcon: "HeartPulse",
    bgColor: "bg-coaching-wellness",
    iconColor: "text-pink-500",
    exercises: [
      { title: "Self-Care Quiz", lucideIcon: "ClipboardCheck", color: "blue" },
      { title: "Self-care List", lucideIcon: "CheckSquare", color: "blue" },
      { title: "Make Heart Sing", lucideIcon: "Heart", color: "red" },
      { title: "Too Comfortable?", lucideIcon: "Armchair", color: "blue" },
    ],
    learn: [
      { title: "18 Wellness Tips" },
      { title: "Wellness Coaching" },
      { title: "Health vs. Wellness" },
      { title: "27 Health Tips" },
    ],
    resources: [
      { type: "tips", title: "Tips", subtitle: "Get control of your life" },
      { type: "quotes", title: "Quotes", subtitle: "One day at a time" },
      { type: "ebooks", title: "Ebooks", subtitle: "Books are a man's best friend" },
    ],
  },
  {
    id: "leadership",
    name: "Leadership",
    lucideIcon: "Users",
    bgColor: "bg-coaching-leadership",
    iconColor: "text-teal-600",
    exercises: [
      { title: "Detox Toxic Relationships", lucideIcon: "Plus", color: "navy" },
      { title: "Make Heart Sing", lucideIcon: "Heart", color: "red" },
      { title: "Identify Your Zappers", lucideIcon: "Zap", color: "yellow" },
      { title: "Putting Up With?", lucideIcon: "Flag", color: "orange" },
    ],
    learn: [
      { title: "Embrace Change" },
      { title: "Hybrid Culture" },
      { title: "Types of Coaching" },
      { title: "Roles & Duties" },
    ],
    resources: [
      { type: "tips", title: "Tips", subtitle: "Get control of your life" },
      { type: "quotes", title: "Quotes", subtitle: "One day at a time" },
      { type: "ebooks", title: "Ebooks", subtitle: "Books are a man's best friend" },
    ],
  },
  {
    id: "finance",
    name: "Finance",
    lucideIcon: "DollarSign",
    bgColor: "bg-coaching-finance",
    iconColor: "text-emerald-600",
    exercises: [
      { title: "Urgent vs. Important", lucideIcon: "Hourglass", color: "navy" },
      { title: "Plan, Do and Review", lucideIcon: "ClipboardEdit", color: "red" },
      { title: "My Money Priorities", lucideIcon: "PiggyBank", color: "blue" },
      { title: "Financial Goals Chart", lucideIcon: "Target", color: "orange" },
    ],
    learn: [
      { title: "8 Finance Tips" },
      { title: "Personal Finance" },
      { title: "Financial Coaching" },
      { title: "Budgeting" },
    ],
    resources: [
      { type: "tips", title: "Tips", subtitle: "Get control of your life" },
      { type: "quotes", title: "Quotes", subtitle: "One day at a time" },
      { type: "ebooks", title: "Ebooks", subtitle: "Books are a man's best friend" },
    ],
  },
  {
    id: "performance",
    name: "Performance",
    lucideIcon: "TrendingUp",
    bgColor: "bg-coaching-performance",
    iconColor: "text-orange-600",
    exercises: [
      { title: "Success Planner", lucideIcon: "CalendarCheck", color: "blue" },
      { title: "Eliminate Delaying", lucideIcon: "Clock", color: "blue" },
      { title: "Unstick Yourself!", lucideIcon: "Smile", color: "red" },
      { title: "Love Your Weaknesses", lucideIcon: "Sparkles", color: "purple" },
    ],
    learn: [
      { title: "High Performance" },
      { title: "Performance Coaching" },
      { title: "Performance Benefits" },
      { title: "Finding a Coach" },
    ],
    resources: [
      { type: "tips", title: "Tips", subtitle: "Get control of your life" },
      { type: "quotes", title: "Quotes", subtitle: "One day at a time" },
      { type: "ebooks", title: "Ebooks", subtitle: "Books are a man's best friend" },
    ],
  },
  {
    id: "mindset",
    name: "Mindset",
    lucideIcon: "Brain",
    bgColor: "bg-coaching-mindset",
    iconColor: "text-indigo-600",
    exercises: [
      { title: "3 Month Vision", lucideIcon: "Binoculars", color: "navy" },
      { title: "Get Motivated!", lucideIcon: "Puzzle", color: "orange" },
      { title: "Build a Bridge", lucideIcon: "Construction", color: "yellow" },
      { title: "SMART! Goals", lucideIcon: "Target", color: "navy" },
    ],
    learn: [
      { title: "Mastering Mindset" },
      { title: "Fostering Mindset" },
      { title: "Leadership Mindset" },
      { title: "The Mindset Coach" },
    ],
    resources: [
      { type: "tips", title: "Tips", subtitle: "Get control of your life" },
      { type: "quotes", title: "Quotes", subtitle: "One day at a time" },
      { type: "ebooks", title: "Ebooks", subtitle: "Books are a man's best friend" },
    ],
  },
  {
    id: "spiritual",
    name: "Spiritual",
    lucideIcon: "Sun",
    bgColor: "bg-coaching-spiritual",
    iconColor: "text-amber-500",
    exercises: [
      { title: "Mentor Magic!", lucideIcon: "Users", color: "blue" },
      { title: "Intuition Exercise", lucideIcon: "Brain", color: "teal" },
      { title: "Love And Loathe List", lucideIcon: "HeartOff", color: "red" },
      { title: "Powerful Questions", lucideIcon: "MessageCircleQuestion", color: "blue" },
    ],
    learn: [
      { title: "10 Spiritual Tips" },
      { title: "Spiritual Essence" },
      { title: "Spiritual Mechanics" },
      { title: "Spiritual vs Life" },
    ],
    resources: [
      { type: "tips", title: "Tips", subtitle: "Get control of your life" },
      { type: "quotes", title: "Quotes", subtitle: "One day at a time" },
      { type: "ebooks", title: "Ebooks", subtitle: "Books are a man's best friend" },
    ],
  },
  {
    id: "mental-health",
    name: "Mental Health",
    lucideIcon: "Activity",
    bgColor: "bg-coaching-mental",
    iconColor: "text-rose-500",
    exercises: [
      { title: "Let Go", lucideIcon: "Bird", color: "salmon" },
      { title: "Too Comfortable?", lucideIcon: "Armchair", color: "blue" },
      { title: "Discover Yourself", lucideIcon: "SearchHeart", color: "orange" },
      { title: "Gratitude Diary", lucideIcon: "CloudSun", color: "red" },
    ],
    learn: [
      { title: "Mental Health" },
      { title: "Wellness Bases" },
      { title: "Coaching vs Counseling" },
      { title: "Well-Being Path" },
    ],
    resources: [
      { type: "tips", title: "Tips", subtitle: "Get control of your life" },
      { type: "quotes", title: "Quotes", subtitle: "One day at a time" },
      { type: "ebooks", title: "Ebooks", subtitle: "Books are a man's best friend" },
    ],
  },
  {
    id: "transform",
    name: "Transform",
    lucideIcon: "RefreshCw",
    bgColor: "bg-coaching-transform",
    iconColor: "text-purple-600",
    exercises: [
      { title: "Wacky Wild Goal", lucideIcon: "Target", color: "navy" },
      { title: "Big & Little Rocks", lucideIcon: "Gem", color: "orange" },
      { title: "Rocking Chair", lucideIcon: "ArmchairIcon", color: "purple" },
      { title: "Goals Motivator", lucideIcon: "Star", color: "red" },
    ],
    learn: [
      { title: "Transformation" },
      { title: "Why Transform?" },
      { title: "Transform Models" },
      { title: "The Transform Process" },
    ],
    resources: [
      { type: "tips", title: "Tips", subtitle: "Get control of your life" },
      { type: "quotes", title: "Quotes", subtitle: "One day at a time" },
      { type: "ebooks", title: "Ebooks", subtitle: "Books are a man's best friend" },
    ],
  },
  {
    id: "communicate",
    name: "Communicate",
    lucideIcon: "MessageSquare",
    bgColor: "bg-coaching-communicate",
    iconColor: "text-sky-500",
    exercises: [
      { title: "Talk to Yourself!", lucideIcon: "MessageCircle", color: "navy" },
      { title: "35 Questions to Ponder", lucideIcon: "HelpCircle", color: "orange" },
      { title: "Positive Visualisation", lucideIcon: "Sparkles", color: "blue" },
      { title: "The Softened Start-Up", lucideIcon: "SmilePlus", color: "red" },
    ],
    learn: [
      { title: "Team Comm" },
      { title: "Comm Coaches" },
      { title: "Tough Messages" },
      { title: "10 Comm Strategies" },
    ],
    resources: [
      { type: "tips", title: "Tips", subtitle: "Get control of your life" },
      { type: "quotes", title: "Quotes", subtitle: "One day at a time" },
      { type: "ebooks", title: "Ebooks", subtitle: "Books are a man's best friend" },
    ],
  },
  {
    id: "organization",
    name: "Organization",
    lucideIcon: "Building",
    bgColor: "bg-coaching-organization",
    iconColor: "text-violet-600",
    exercises: [
      { title: "Get Perspective", lucideIcon: "Users", color: "orange" },
      { title: "Career Discovery", lucideIcon: "Search", color: "blue" },
      { title: "Expand Your Mind", lucideIcon: "Brain", color: "red" },
      { title: "Priority Matrix", lucideIcon: "LayoutGrid", color: "purple" },
    ],
    learn: [
      { title: "4 Setup Steps" },
      { title: "Org Success" },
      { title: "Org FAQ" },
      { title: "Why Org Coaching?" },
    ],
    resources: [
      { type: "tips", title: "Tips", subtitle: "Get control of your life" },
      { type: "quotes", title: "Quotes", subtitle: "One day at a time" },
      { type: "ebooks", title: "Ebooks", subtitle: "Books are a man's best friend" },
    ],
  },
  {
    id: "creativity",
    name: "Creativity",
    lucideIcon: "Palette",
    bgColor: "bg-coaching-creativity",
    iconColor: "text-blue-500",
    exercises: [
      { title: "Dictionary Story", lucideIcon: "BookOpen", color: "navy" },
      { title: "Alternate Uses", lucideIcon: "Shuffle", color: "navy" },
      { title: "My Day", lucideIcon: "Cloud", color: "purple" },
      { title: "Compound Collaborative", lucideIcon: "Hexagon", color: "purple" },
    ],
    learn: [
      { title: "Unleash Potential" },
      { title: "4 Creative Tips" },
      { title: "Nurture Essence" },
      { title: "Creative Coaching" },
    ],
    resources: [
      { type: "tips", title: "Tips", subtitle: "Get control of your life" },
      { type: "quotes", title: "Quotes", subtitle: "One day at a time" },
      { type: "ebooks", title: "Ebooks", subtitle: "Books are a man's best friend" },
    ],
  },
  {
    id: "employee",
    name: "Employee",
    lucideIcon: "User",
    bgColor: "bg-coaching-employee",
    iconColor: "text-neutral-600",
    exercises: [
      { title: "Daily Success Habits", lucideIcon: "Clock", color: "navy" },
      { title: "Reminder List", lucideIcon: "Bell", color: "red" },
      { title: "Intake Questions", lucideIcon: "HelpCircle", color: "blue" },
      { title: "Take Stock – Take Action!", lucideIcon: "Rocket", color: "purple" },
    ],
    learn: [
      { title: "7 Techniques" },
      { title: "Guiding Employees" },
      { title: "Employee Guide" },
      { title: "Team Coaching" },
    ],
    resources: [
      { type: "tips", title: "Tips", subtitle: "Get control of your life" },
      { type: "quotes", title: "Quotes", subtitle: "One day at a time" },
      { type: "ebooks", title: "Ebooks", subtitle: "Books are a man's best friend" },
    ],
  },
  {
    id: "corporate",
    name: "Corporate",
    lucideIcon: "Building2",
    bgColor: "bg-coaching-corporate",
    iconColor: "text-slate-800",
    exercises: [
      { title: "Reclaim Your Power", lucideIcon: "Presentation", color: "navy" },
      { title: "My Spheres of Influence", lucideIcon: "Sun", color: "orange" },
      { title: "Build a Bridge", lucideIcon: "Construction", color: "blue" },
      { title: "3 Month Vision", lucideIcon: "Binoculars", color: "purple" },
    ],
    learn: [
      { title: "15 Career Topics" },
      { title: "Corporate Factors" },
      { title: "Corporate Vitality" },
      { title: "Leadership Corp" },
    ],
    resources: [
      { type: "tips", title: "Tips", subtitle: "Get control of your life" },
      { type: "quotes", title: "Quotes", subtitle: "One day at a time" },
      { type: "ebooks", title: "Ebooks", subtitle: "Books are a man's best friend" },
    ],
  },
  {
    id: "confidence",
    name: "Confidence",
    lucideIcon: "Shield",
    bgColor: "bg-coaching-confidence",
    iconColor: "text-amber-700",
    exercises: [
      { title: "Daily Success Habits", lucideIcon: "Clock", color: "blue" },
      { title: "Priority Matrix", lucideIcon: "LayoutGrid", color: "purple" },
      { title: "Positive Visualisation", lucideIcon: "Sparkles", color: "blue" },
      { title: "Expand Your Mind", lucideIcon: "Brain", color: "red" },
    ],
    learn: [
      { title: "Self-Confidence" },
      { title: "30 Questions" },
      { title: "Build Resilience" },
      { title: "Authentic Flow" },
    ],
    resources: [
      { type: "tips", title: "Tips", subtitle: "Get control of your life" },
      { type: "quotes", title: "Quotes", subtitle: "One day at a time" },
      { type: "ebooks", title: "Ebooks", subtitle: "Books are a man's best friend" },
    ],
  },
];
