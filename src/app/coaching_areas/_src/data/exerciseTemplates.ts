export interface ExerciseField {
  id: string;
  label: string;
  subtitle?: string;
  prompts?: string[];
  color: string;
  type?: "text" | "list" | "table" | "rated-list";
  /** Column headers for table type */
  columns?: string[];
  /** Fixed items for rated-list type */
  items?: string[];
}

export interface ExerciseTemplate {
  id: string;
  title: string;
  description: string;
  importantNote?: string;
  footerNote?: string;
  fields: ExerciseField[];
}

export const exerciseTemplates: Record<string, ExerciseTemplate> = {
  "improvement-canvas": {
    id: "improvement-canvas",
    title: "Improvement Canvas",
    description:
      'The improvement canvas is based upon the "Toyota Kata" Approach. It\'s a visual way to explore your vision, where are you now, where you want to go next and the first steps you can take. This exercise can be used for any major change effort, may it be personal, team, or organisational change. It acts as a living reminder of why you are changing and the steps you are taking.',
    fields: [
      { id: "vision", label: "Vision – The Why?", subtitle: "Why are we embarking on this change?", color: "hsl(350,70%,55%)" },
      { id: "current", label: "Current State – The Where?", subtitle: "Where are we now?", color: "hsl(30,90%,55%)" },
      { id: "target", label: "Target State – The Want", subtitle: "Where we want to be next, e.g. 3 months from now?", color: "hsl(175,60%,40%)" },
      { id: "next-steps", label: "Next Steps – The First Step", subtitle: "What are the first steps you are going to take?", color: "hsl(210,75%,50%)" },
    ],
  },
  "swot-analysis": {
    id: "swot-analysis",
    title: "Personal SWOT Analysis",
    description:
      "A SWOT analysis is a frequently employed business technique aimed at pinpointing strengths, weaknesses, opportunities, and threats within an organization or team. However, it's worth noting that this analysis can also be applied personally. Conducting your own Personal SWOT analysis can be incredibly beneficial. It allows you to differentiate yourself at work or in life, acknowledge your distinct abilities, strengths, and talents, devise tactics to address weaknesses and threats, and capitalize on available opportunities!",
    importantNote:
      "This involves avoiding excessive modesty or self-criticism. Simply respond to the questions truthfully, considering your perspective as well as how those around you might perceive you.",
    footerNote:
      "Trends and Threats refers to changing technology, government, professional or organizational policy or environmental, market, social, economic, lifestyle, or demographic trends.",
    fields: [
      {
        id: "strengths",
        label: "STRENGTHS",
        color: "hsl(175,60%,40%)",
        type: "list",
        prompts: [
          "What do you do well? What do you do better than others?",
          "What unique skills and talents do you have?",
          "What do others see as your strengths?",
          "What are you proud of, like about yourself, enjoy doing?",
        ],
      },
      {
        id: "weaknesses",
        label: "WEAKNESSES",
        color: "hsl(350,70%,55%)",
        type: "list",
        prompts: [
          "What could you do better? What do you avoid?",
          "Where do you have less skill or talent than others?",
          "What are others likely to see as weaknesses?",
          "What do need to face up to?",
        ],
      },
      {
        id: "opportunities",
        label: "OPPORTUNITIES",
        color: "hsl(210,75%,50%)",
        type: "list",
        prompts: [
          "What opportunities are out there for you?",
          "What trends could you take advantage of?",
          "What strengths could you turn into opportunities?",
          "What is going on locally that you could capitalize on?",
        ],
      },
      {
        id: "threats",
        label: "THREATS",
        color: "hsl(30,90%,55%)",
        type: "list",
        prompts: [
          "What trends and threats could harm you?",
          "What is your competition doing?",
          "What threats do your weaknesses expose you to?",
          "What obstacles do you have coming up?",
        ],
      },
    ],
  },
  "not-to-do-list": {
    id: "not-to-do-list",
    title: "Not-to-do List",
    description:
      "The things on your not-to-do list are usually all the things that you know and feel deep down you shouldn't be spending time on, but somehow are unable to stop doing. A not-to-do list can help you systematically take care of those kinds of tasks once and for all.",
    fields: [
      { id: "list", label: "Your Not-to-do Items", subtitle: "List the things you need to stop doing", color: "hsl(265,55%,45%)", type: "list" },
    ],
  },
  grow: {
    id: "grow",
    title: "GROW",
    description:
      "Goal setting (define objectives), Reality check (assess current situation), Options exploration (consider strategies), and Way Forward (create actionable plan). It's a coaching tool that will help you in setting clear goals, understanding reality, brainstorming solutions, and devising a practical path toward achieving your aspirations.",
    fields: [
      { id: "goal", label: "GOAL", subtitle: "What do you want?", color: "hsl(350,70%,55%)" },
      { id: "reality", label: "REALITY", subtitle: "Where are you now?", color: "hsl(210,75%,50%)" },
      { id: "options", label: "OPTIONS", subtitle: "What could you do?", color: "hsl(30,90%,55%)" },
      { id: "will", label: "WILL", subtitle: "What will you do?", color: "hsl(175,60%,40%)" },
    ],
  },

  // ── Wellness / Leadership ──
  "make-heart-sing": {
    id: "make-heart-sing",
    title: "What Makes My Heart Sing?",
    description:
      "This exploration guides you toward discovering the essence of joy in your life. It invites you to briefly envision a state of pure, blissful happiness—a moment where worries fade away, leaving you free and light. A smile naturally finds its way to your face, bringing relaxation and a sense of inner peace that extends to the world around you. Perhaps you'll even sense an inner radiance and a sense of expansiveness within your heart.",
    importantNote:
      "INSTRUCTIONS:\n1. Take roughly 10 minutes in a peaceful space to jot down your response below.\n2. Focus on writing without analyzing too much. If your answers feel straightforward, that's perfectly alright—it might indicate something significant.\n3. Feel open to expanding this list with any additional ideas that arise in the days or weeks ahead.\n\nHELPFUL TIPS:\n• Recall moments from your childhood when you felt utmost happiness.\n• Engage each of your five senses—sight, hearing, touch/feel, smell, and taste—to identify a joyful memory associated with each.\n• For instance, watching a sunset, the playful sounds of children or dogs, the sensation of hiking up a mountain, the aroma of cooking, observing the world from a window, expressing love, the comfort of fresh bedsheets, or any other distinct experiences that resonate uniquely with you.",
    footerNote:
      "REFLECT: As you review your list, what patterns, strong messages, or unexpected discoveries emerge? Are there recurring themes among these experiences? How feasible do these activities seem? And why do you believe you don't engage in them more frequently?",
    fields: [
      {
        id: "joys",
        label: "Now answer the question:",
        subtitle: "What are My Top 10 Joys in Life? What Makes My Heart Sing?",
        color: "hsl(210,75%,50%)",
        type: "list",
      },
    ],
  },

  "detox-relationship": {
    id: "detox-relationship",
    title: "Detox Your Relationship",
    description:
      "Throughout our lives, the majority of our time is spent alongside a select group of five individuals. Specialists in success emphasize that the company we keep significantly shapes our happiness and our outcomes in life. It's evident that content, accomplished individuals tend to surround themselves with others who exude similar positivity and achievement.\n\nGiven this, why not pinpoint those who motivate and propel you toward greater heights while also recognizing those who may hinder your progress? Engaging in this practice naturally prompts a shift in how you choose your companions, enabling you to gravitate toward a more uplifting circle.",
    importantNote:
      'INSTRUCTIONS:\n1. Create a roster of the 20 individuals who constitute the bulk of your time. Alongside each name, designate a symbol:\n\n"+" signifies feeling uplifted and positive post-interaction. These are individuals whose company brings joy and contentment, fostering your happiness and success. They\'re the ones you eagerly anticipate spending time with.\n\n"-" indicates a sense of diminishment after spending time together. It might manifest as feeling smaller, less spirited, or unnecessarily burdened either before or after meeting them. You likely already have an inkling of who these individuals are.\n\n2. Following this, assign a (gut-feeling) score ranging from -5 to +5 to gauge their impact on you.\n\n3. Lastly, for those with the highest and lowest scores, allocate actions in the final column to navigate your relationships.',
    fields: [
      {
        id: "roster",
        label: "Your Relationship Roster",
        color: "hsl(210,75%,50%)",
        type: "table",
        columns: ["Name", "+/- Score", "Action"],
      },
    ],
  },

  "energy-zappers": {
    id: "energy-zappers",
    title: "Identify Your Energy Zappers",
    description:
      "Jot down the challenges you're facing both at home and in your primary work or daily occupation. This exercise will aid in identifying the factors that might currently restrict you. If your list extends beyond ten items, simply continue adding them below.\n\nExamples of energy zappers can encompass various aspects such as situations, personal or others' behaviors, unresolved issues, unfulfilled needs, clutter, breached boundaries, incomplete tasks, neglected plants, overdue library materials, an outdated wardrobe, guilt or lingering concerns, dietary habits, indecision, relationship dynamics, and sleep patterns.",
    fields: [
      {
        id: "zappers",
        label: "Energy Zappers",
        color: "hsl(30,90%,55%)",
        type: "list",
      },
      {
        id: "one-thing",
        label: "If there was ONE THING that TOTALLY ZAPPED your energy it would be:",
        color: "hsl(350,70%,55%)",
        type: "text",
      },
    ],
  },

  "putting-up-with": {
    id: "putting-up-with",
    title: "What Are You Putting Up With?",
    description:
      "Often, we find ourselves weighed down and inundated by matters we endure without addressing. These accumulate gradually, cluttering our minds.\n\nWhile you may not feel inclined to tackle them immediately, simply listing them here heightens your awareness. Naturally, this awareness can spur you to address, fix, and resolve these issues over time. Take a moment to catalog what you're tolerating below, uncovering what might be cluttering your mind, sapping your energy, and impeding your progress!\n\nExamples: Incomplete tasks, frustrations, poor processes/procedures, unresolved problems, other people's or your own behaviour, clutter, 'shoulds', unmet needs, crossed boundaries, poor morale, overdue bills or invoices, outdated design, guilt, exercise/eating/sleep habits, office cleanliness/tidiness, undone filing, indecision, procrastination etc.",
    footerNote:
      'Finally, pick ONE action to reduce your "Tolerations" (aim to take action now – or in the next day or so)',
    fields: [
      {
        id: "tolerations",
        label: "Now is the time to identify what you're tolerating!",
        subtitle: "Write as many items as you can now. Then over time, as you think of more things, add them to your list below.",
        color: "hsl(210,75%,50%)",
        type: "list",
      },
      {
        id: "one-action",
        label: "Pick ONE action to reduce your Tolerations:",
        color: "hsl(175,60%,40%)",
        type: "text",
      },
    ],
  },

  // ── Finance ──
  "urgent-vs-important": {
    id: "urgent-vs-important",
    title: "Urgent vs. Important",
    description:
      'Most of us have many needs, wants, and goals. It can be hard to focus on one at a time. This matrix can help you determine which types of spending are urgent or important, or both, or neither. Make sure your "basics" are covered first – things that are both urgent and important, and are necessary for living day-to-day. If you have items that are not urgent and not important, then reflect on whether you really need to spend money on them. These might be opportunities to "find money" to spend on other more necessary things.',
    fields: [
      {
        id: "spending-items",
        label: "Write down things you need or want to spend money on:",
        color: "hsl(210,75%,50%)",
        type: "list",
      },
      {
        id: "urgent-important",
        label: "Urgent + Important",
        subtitle: "Basic needs: Things you can't live without, such as Food, Rent or mortgage, Utility payments, Transit",
        color: "hsl(350,70%,55%)",
        type: "text",
      },
      {
        id: "not-urgent-important",
        label: "Not urgent + Important",
        subtitle: "Your personal goals: Longer-term planning, spending that will help you lead the life you want, such as Larger home purchases, Education, Travel",
        color: "hsl(210,75%,50%)",
        type: "text",
      },
      {
        id: "urgent-not-important",
        label: "Urgent + Not important",
        subtitle: "Short term needs: Things that are less important long term but help you get through your day-to-day, such as Daily coffee, McDonald's lunch once a week",
        color: "hsl(30,90%,55%)",
        type: "text",
      },
      {
        id: "not-urgent-not-important",
        label: "Not urgent + Not important",
        subtitle: "Wants, not needs: Spending that isn't meeting a need, and isn't urgent, such as Impulse buys at the checkout line, Emotional spending",
        color: "hsl(175,60%,40%)",
        type: "text",
      },
    ],
  },

  "plan-do-review": {
    id: "plan-do-review",
    title: "Plan, Do and Review Action Plan",
    description:
      'The "Plan, Do, Review" action plan is a structured tool for outlining goals, actions, and assessments. It helps plan objectives, execute tasks, and evaluate outcomes, fostering accountability and progress tracking. It encourages a cyclical approach, enabling reflection and refinement for continuous improvement.',
    fields: [
      {
        id: "plan-goal",
        label: "PLAN",
        subtitle: "Define clear financial goals and SMART objectives. Implement tactics such as acquiring new skills, expanding networks, and investing in education.",
        color: "hsl(350,70%,55%)",
        prompts: ["The financial goal I am working towards is:"],
        type: "text",
      },
      {
        id: "plan-start",
        label: "I will start by doing:",
        color: "hsl(350,70%,55%)",
        type: "text",
      },
      {
        id: "plan-future",
        label: "Future steps I will need to take:",
        color: "hsl(350,70%,55%)",
        type: "text",
      },
      {
        id: "do-complete",
        label: "DO",
        subtitle: "Follow through by enrolling in relevant courses, accumulating experience, and actively networking. Remain flexible and adaptable to evolving circumstances.",
        color: "hsl(210,75%,50%)",
        prompts: ["I will complete this by (date):"],
        type: "text",
      },
      {
        id: "do-resources",
        label: "Resources I can access to help me are:",
        color: "hsl(210,75%,50%)",
        type: "text",
      },
      {
        id: "review-support",
        label: "REVIEW",
        subtitle: "Consistently track financial progress, analyze both achievements and setbacks, and adjust strategies to consistently enhance prospects for financial growth.",
        color: "hsl(175,60%,40%)",
        prompts: ["I would like support from my coach/Caseworker/counsellor to:"],
        type: "text",
      },
    ],
  },

  "my-money-priorities": {
    id: "my-money-priorities",
    title: "My Money Priorities",
    description:
      'Go through the list and prioritize your spending by writing a "1" next to the most important spending item, a "2" to the second most important spending item, and so on until the whole list is numbered. There is no right or wrong way for the list to be arranged.',
    fields: [
      {
        id: "priorities",
        label: "Rate each item by priority",
        color: "hsl(210,75%,50%)",
        type: "rated-list",
        items: [
          "Automobile or other transportation",
          "Bills paid on time",
          "Groceries",
          "Housing",
          "Church/worship contributions",
          "Saving for emergencies",
          "Education for children",
          "Television/cable",
          "Clothes and shoes",
          "Family or religious celebrations",
          "Paying off debt",
          "Furniture and home repairs",
          "Going on vacation",
          "Medicine and medical care",
          "Eating out at restaurants",
          "Life insurance",
          "Books, newspapers, magazines",
          "Beer and other alcohol",
          "Sports",
          "Retirement",
        ],
      },
      {
        id: "other-priorities",
        label: "Other",
        color: "hsl(30,90%,55%)",
        type: "text",
      },
    ],
  },

  // ── Performance ──
  "unstick-yourself": {
    id: "unstick-yourself",
    title: "Unstick Yourself Now!",
    description:
      "This is a super simple exercise, anytime you're stuck, just ask these 5 easy questions below to brainstorm and come up with lots of new ideas – then choose 3 actions to move you forwards.",
    fields: [
      {
        id: "goal",
        label: "Firstly, what's your goal – how would you like things to be different?",
        color: "hsl(210,75%,50%)",
        type: "text",
      },
      {
        id: "stop",
        label: "What could you STOP doing?",
        subtitle: "Identify at least 3 answers for each question to move you closer to your goal above.\nDon't think too hard, just read the question, write whatever springs to your mind.",
        color: "hsl(350,70%,55%)",
        type: "list",
      },
      {
        id: "less",
        label: "What could you do LESS of?",
        color: "hsl(30,90%,55%)",
        type: "list",
      },
      {
        id: "more",
        label: "What could you do MORE of?",
        color: "hsl(175,60%,40%)",
        type: "list",
      },
      {
        id: "continue",
        label: "What could you CONTINUE doing?",
        color: "hsl(210,75%,50%)",
        type: "list",
      },
      {
        id: "start",
        label: "What could you START doing?",
        color: "hsl(265,55%,45%)",
        type: "list",
      },
      {
        id: "actions",
        label: "So, what actions will you take now to empower yourself, get unstuck and get moving?",
        subtitle: "Choose actions that are easily do-able and write them below.",
        color: "hsl(350,70%,55%)",
        type: "table",
        columns: ["Action", "by When"],
      },
    ],
  },

  "love-your-weaknesses": {
    id: "love-your-weaknesses",
    title: "Love Your Weaknesses",
    description:
      "We live in a world that likes to focus and 'work on' our 'weaknesses'. But these kinds of faults are usually subjective. Instead consider the idea that they're only true weaknesses when they get in the way of what we want to do – not just because someone says so... This exercise gives you a different perspective: to loosen the hold your so-called 'weaknesses' have on you by reframing how you see them.\n\nSimply list below your weakness and adjacent to each weakness mention how this weakness could be USEFUL or where it serves as a purpose. If you get struck, try thinking of weird, extreme, unusual or unlikely situations.",
    fields: [
      {
        id: "weaknesses",
        label: "Your Weaknesses & Their Purpose",
        color: "hsl(265,55%,45%)",
        type: "table",
        columns: ["Weakness", "Purpose"],
      },
    ],
  },

  // ── Mindset / Corporate ──
  "build-a-bridge": {
    id: "build-a-bridge",
    title: "Build a Bridge",
    description:
      "If you fell stuck or overwhelmed then this exercise is for you. Sometimes we get stuck when we focus on everything that could go wrong. And sometimes we get overwhelmed by worrying about everything to do on the road ahead. This is when we need to Build a Bridge! You don't need to see the other side – you just need to see your first 3 steps. Once you've taken those 3 steps you'll be able to see the next 3 steps. Then the next 3 and so on. Simple yet very effective!\n\nSimply answer the questions below, then complete the \"no fail\" action section to get you moving forwards. Use this exercise weekly to maintain momentum or simply to get moving whenever you feel overwhelmed or stuck. And don't think too hard just trust and write down whatever comes into your head.",
    fields: [
      {
        id: "goal-dream",
        label: "So, what is your goal or dream?",
        color: "hsl(210,75%,50%)",
        type: "text",
      },
      {
        id: "where-ultimately",
        label: "Where ultimately do you want to get to?",
        color: "hsl(175,60%,40%)",
        type: "text",
      },
      {
        id: "done-so-far",
        label: "What have you done so far towards your goal or dream?",
        color: "hsl(30,90%,55%)",
        type: "text",
      },
      {
        id: "big-thing",
        label: "If there was one big thing getting in the way of you moving forwards, what would it be?",
        color: "hsl(350,70%,55%)",
        type: "text",
      },
      {
        id: "no-fear",
        label: "If you could do anything with no fear or limits, what would it be?",
        color: "hsl(265,55%,45%)",
        type: "text",
      },
      {
        id: "bridge-actions",
        label: "Now, write down your very first 3 steps to Build a Bridge",
        subtitle: "What are the 3 Things You Could Do in the next week WITHOUT FAIL that would move you closer to your goals? These actions can be as small or as big as you like, but must be easily do-able within the next week.",
        color: "hsl(175,60%,40%)",
        type: "list",
      },
    ],
  },

  // ── Spiritual ──
  "mentor-magic": {
    id: "mentor-magic",
    title: "Mentor Magic!",
    description:
      "Take a few quiet moments and think about who you consider to be wise, perhaps someone spiritual, but definitely someone who has life experience and wisdom to share. Now simply answer the questions below to get unstuck or get insights on a goal, problem or your career.",
    importantNote:
      "TIP: Use a short version of this technique at any time to quickly gain ideas and insights towards resolving any issue or achieving a goal. Simply imagine yourself in the shoes of someone wise, experienced and perhaps knowledgeable and see what advice they have for you.",
    fields: [
      {
        id: "who-pick",
        label: "If you could step into absolutely anyone's shoes for half an hour–who you could learn from and gain valuable insights – who would you pick?",
        subtitle: "(go as far back in history or into your imagination as you like).",
        color: "hsl(210,75%,50%)",
        type: "text",
      },
      {
        id: "advice",
        label: "Now take a few moments and imagine you are that person. Think about the advice they would give you and write it here",
        subtitle: "(this could be advice for a specific issue or career goal, or general career advice–you choose).",
        color: "hsl(175,60%,40%)",
        type: "text",
      },
      {
        id: "additional-mentors",
        label: "Who else can you think of that could give you valuable insights? Imagine being each mentor–and what they would do or say–if they were in your position.",
        color: "hsl(30,90%,55%)",
        type: "table",
        columns: ["Additional Mentors", "Advice"],
      },
      {
        id: "what-will-you-do",
        label: "What will you do with all these ideas, and advice?",
        subtitle: "Now, step back into YOU and review the advice your mentors have given you. Write down 3 specific ideas, actions to get unstuck, or specific situations where you might use these learnings:",
        color: "hsl(350,70%,55%)",
        type: "list",
      },
    ],
  },

  // ── Mental Health ──
  "let-go": {
    id: "let-go",
    title: "What Do You Need to Let Go of?",
    description:
      "Although you might not feel inclined to take immediate action, jotting down what you need to release can heighten your awareness and naturally ease your grip. Read the story and ideas below, then create a simple list. What are you clinging to? What saps your energy or hinders your progress? What triggers frustration? What obstructs you from reaching your fullest potential?\n\nTwo Buddhist monks return to their monastery after the rains. They reach a swollen river and in front of them is a woman in a delicate silk kimono, distressed because she is unable to cross the river by herself. The older monk scoops her up, carries her safely to the other side and the two monks continue on their way in silence. Later, as the monks reach their destination, the younger monk (who has fumed for the last 5 hours) finally bursts out, \"How could you? We're not allowed to touch a woman!\" The older monk, surprised, replies: \"I put her down 5 hours ago, but you are still carrying her with you.\"",
    importantNote:
      "• As with the younger monk in the story, the things we hold onto (eg. that we feel angry, guilty, hurt about etc.) cloud our mind and stop us from fully enjoying life. The irony is that whatever you're holding onto, it probably bothers you much more than it does anyone else.\n• Letting go usually involves some form of forgiveness or acceptance – whether it's of yourself, someone else, a situation or even an unknown third party.\n• Letting go doesn't mean we condone a situation or behaviour, it's about lightening our load. When we let go of whatever is bothering us we set ourselves free – and get to reclaim that energy for ourselves.\n• While you can't change the past, you can learn from it and change how you feel going forwards. And remember – whatever you find the hardest to let go of is probably what you need to let go of the most.\n• If you need to let go of something you did ask, \"What could I do that will allow me to let this go?\" You may need to make note of what you learned, make some kind of amends, apologise or find a meaningful way to make it up to yourself or someone else.\n• Final thought: You don't need to know how to let go, you just need to be willing.",
    fields: [
      {
        id: "let-go-table",
        label: "What do I need to let go of?",
        color: "hsl(210,75%,50%)",
        type: "table",
        columns: ["What do I need to let go of?", "How I can benefit by 'holding on'"],
      },
      {
        id: "imagine-letting-go",
        label: "Just for a second, imagine letting go of everything on this list. How does it feel?",
        color: "hsl(175,60%,40%)",
        type: "text",
      },
      {
        id: "learned",
        label: "What have you learned about yourself from doing this exercise?",
        color: "hsl(350,70%,55%)",
        type: "text",
      },
    ],
  },

  // ── Wellness / Mental Health ──
  "too-comfortable": {
    id: "too-comfortable",
    title: "Are you sitting (too) comfortably?",
    description:
      "While in our comfort zone, we cruise on autopilot, feeling confident, relaxed, and secure, almost snug—it's effortless. But, could it be time to move on? Have you overstayed your welcome in this cozy space?",
    fields: [
      {
        id: "tried-new",
        label: "When was the last time you tried something new?",
        color: "hsl(210,75%,50%)",
        type: "text",
      },
      {
        id: "learning-growing",
        label: "How much are you learning and growing right now?",
        color: "hsl(175,60%,40%)",
        type: "text",
      },
      {
        id: "too-much-not-enough",
        label: "Do you feel you're doing too much – or not enough?",
        color: "hsl(30,90%,55%)",
        type: "text",
      },
      {
        id: "last-risk",
        label: "When was the last time you took a risk?",
        color: "hsl(350,70%,55%)",
        type: "text",
      },
      {
        id: "shift-change",
        label: "Do you feel its time for a shift – or a change?",
        color: "hsl(265,55%,45%)",
        type: "text",
      },
      {
        id: "comfort-continuum",
        label: "So, where are you on the \"Comfort Continuum\"?",
        subtitle: "Use your gut feeling to represent how you feel in your life right now:",
        color: "hsl(210,75%,50%)",
        type: "text",
      },
      {
        id: "serve-goals",
        label: "Does where you are on the \"Comfort Continuum\" serve you and your goals?",
        color: "hsl(175,60%,40%)",
        type: "text",
      },
    ],
    footerNote: "Do you need time in your comfort zone to rest and recharge? Are you just right, or are you heading towards Snoozeville?",
  },

  // ── Employee / Confidence ──
  "daily-success-habits": {
    id: "daily-success-habits",
    title: "Daily Success Habits",
    description:
      "We tend to overlook the importance of simple daily habits in managing ourselves and our lives. But it's often the small changes we make to our daily routines that enable the big changes in our lives and careers.\n\nThis tool helps you build a simple personal framework around which the rest of the day's activities fall into place.\n\nUse this tool to create a daily infrastructure so that no matter what happens you feel calm and assured.",
    importantNote:
      "What supportive daily habits – SPECIFIC DAILY ACTIONS – could you introduce?\n\nWrite up to 5 actions that best support you. Include your home, personal, and work-life. These must be specific and measurable actions so you know exactly what to do, and can easily show you've completed it.\n\nYou know yourself best: Where do you sabotage yourself regularly? what ideas do you already have? What ideas have you had but are pretending not to know?\n\nEXAMPLES:\n• Have 15 minutes of silence or alone time each day\n• Drink 6 glasses of water a day\n• Be at my desk by 8:00am / leave by 6:00pm every day\n• Eat a healthy breakfast every morning\n• Be in bed by 10:30pm\n• Do at least 30 mins exercise/activity every day\n• Set a timer: spend 15 mins max on social media daily\n• Make all calls in the first hour of the day\n• Write my top 3 priorities for the day, every morning before starting work\n• Eat lunch away from my desk\n• Connect daily with partner/spouse (5 mins listening)\n• Write all appointments down – in one place\n• Meditate for 30 minutes each morning before breakfast",
    footerNote:
      "REMEMBER: It takes time and practice to implement new habits. They start as simple actions and gradually, as you do them regularly, become habits. It can take anything from 21-30 days to implement a new habit and a few months to cement a habit. So be kind to yourself on the days you don't remember – and just start again the next day!",
    fields: [
      {
        id: "priorities",
        label: "My Top 3 PRIORITIES in life right now are",
        color: "hsl(210,75%,50%)",
        type: "list",
      },
      {
        id: "stressors",
        label: "My Top 3 STRESSORS in life right now are",
        color: "hsl(350,70%,55%)",
        type: "list",
      },
      {
        id: "habits-table",
        label: "Daily Habits",
        color: "hsl(175,60%,40%)",
        type: "table",
        columns: ["Habit", "Benefit"],
      },
      {
        id: "commit-tomorrow",
        label: "I will start.... (tomorrow)",
        color: "hsl(30,90%,55%)",
        type: "text",
      },
      {
        id: "commit-next-week",
        label: "I will start.... (next week)",
        color: "hsl(30,90%,55%)",
        type: "text",
      },
      {
        id: "commit-next-month",
        label: "I will start.... (next month)",
        color: "hsl(30,90%,55%)",
        type: "text",
      },
      {
        id: "who-to-be",
        label: "Who do I need to BE to implement these habits? I will be someone who is ....",
        color: "hsl(265,55%,45%)",
        type: "list",
      },
    ],
  },

  // ── Communicate / Confidence ──
  "positive-visualisation": {
    id: "positive-visualisation",
    title: "Positive Visualisation",
    description:
      "1. Find a quiet place to sit down and relax\n2. Close your eyes\n3. Think back to an experience you have had that made you feel really good. It can be anything – a personal accomplishment, a youthful memory, a successful project at work\n4. Take yourself back there and replay the sequence of events\n5. Be as detailed as you can in reliving the moment for yourself\n6. Hear the sounds, see the sights and feel the emotions\n7. Replay this a few times until you are immersed in this event\n8. Now open your eyes",
    fields: [
      {
        id: "event",
        label: "Briefly explain your event",
        color: "hsl(210,75%,50%)",
        type: "text",
      },
    ],
  },

  // ── Organization ──
  "get-perspective": {
    id: "get-perspective",
    title: "Get Perspective",
    description:
      "Allow yourself 30mins of quiet time to consider these questions that help you create and shape a vision for your future.\n\nWork through the questions in the order below and write your answers in the PRESENT tense.",
    fields: [
      {
        id: "ultimate-goal",
        label: "Where do you ultimately want to get to in your life/career?",
        subtitle: "Consider areas like your home/family, work/career, health & well-being, finances, community/friendships, and personal growth/learning",
        color: "hsl(210,75%,50%)",
        type: "text",
      },
      {
        id: "how-feel",
        label: "Take a moment to imagine this. how would you feel?",
        color: "hsl(175,60%,40%)",
        type: "text",
      },
      {
        id: "10-years",
        label: "i) 10 years from now",
        subtitle: "What do you want to be doing (work and personal life):",
        color: "hsl(350,70%,55%)",
        type: "text",
      },
      {
        id: "5-years",
        label: "ii) 5 years from now",
        color: "hsl(30,90%,55%)",
        type: "text",
      },
      {
        id: "2-years",
        label: "iii) 2 years from now",
        color: "hsl(265,55%,45%)",
        type: "text",
      },
      {
        id: "1-year",
        label: "iv) 1 year from now",
        color: "hsl(210,75%,50%)",
        type: "text",
      },
      {
        id: "6-months",
        label: "v) 6 months from now",
        color: "hsl(175,60%,40%)",
        type: "text",
      },
      {
        id: "3-months",
        label: "vi) 3 months from now",
        color: "hsl(350,70%,55%)",
        type: "text",
      },
    ],
  },

  // ── Communicate ──
  "talk-to-yourself": {
    id: "talk-to-yourself",
    title: "Talk to Yourself!",
    description:
      "Do you ever find yourself talking to yourself? Well, here's a secret – it's actually a great way to improve your speaking skills alone and improve your English skills! Creating a monologue is a fun and engaging exercise that allows you to express yourself freely and practice speaking without any interruptions or distractions.\n\nTo create a monologue, simply choose a topic that interests you or something that you're passionate about. It could be anything from your favorite hobby, a recent trip you took, or even a movie you watched. Once you have your topic, start talking about it out loud as if you're having a conversation with someone. Pretend that you're explaining it to a friend or teaching someone about it.",
    fields: [
      {
        id: "topic",
        label: "Mention your topic here",
        color: "hsl(210,75%,50%)",
        type: "text",
      },
      {
        id: "writing",
        label: "Start Writing",
        color: "hsl(175,60%,40%)",
        type: "text",
      },
    ],
  },

  // ── Finance ──
  "financial-goals-chart": {
    id: "financial-goals-chart",
    title: "Financial Goals Chart",
    description:
      "This exercise helps to map out your monetary aspirations. It outlines short and long-term objectives, such as savings, investments, and debt management. This chart helps you track progress, set priorities, and stay focused on achieving financial milestones for greater stability and success.",
    fields: [
      { id: "budgeting-status", label: "Current status", subtitle: "", color: "hsl(0,80%,55%)" },
      { id: "budgeting-goal", label: "Goal", color: "hsl(0,80%,55%)" },
      { id: "budgeting-date", label: "Date to achieve goal", color: "hsl(0,80%,55%)" },
      { id: "budgeting-steps", label: "Steps needed to achieve goal", color: "hsl(0,80%,55%)" },
      { id: "budgeting-accountability", label: "Accountability: Who will help me reach the goal?", color: "hsl(0,80%,55%)" },

      { id: "banking-status", label: "Current status", color: "hsl(210,75%,50%)" },
      { id: "banking-goal", label: "Goal", color: "hsl(210,75%,50%)" },
      { id: "banking-date", label: "Date to achieve goal", color: "hsl(210,75%,50%)" },
      { id: "banking-steps", label: "Steps needed to achieve goal", color: "hsl(210,75%,50%)" },
      { id: "banking-accountability", label: "Accountability: Who will help me reach the goal?", color: "hsl(210,75%,50%)" },

      { id: "credit-status", label: "Current status", color: "hsl(175,60%,40%)" },
      { id: "credit-goal", label: "Goal", color: "hsl(175,60%,40%)" },
      { id: "credit-date", label: "Date to achieve goal", color: "hsl(175,60%,40%)" },
      { id: "credit-steps", label: "Steps needed to achieve goal", color: "hsl(175,60%,40%)" },
      { id: "credit-accountability", label: "Accountability: Who will help me reach the goal?", color: "hsl(175,60%,40%)" },

      { id: "debt-status", label: "Current status", color: "hsl(350,70%,55%)" },
      { id: "debt-goal", label: "Goal", color: "hsl(350,70%,55%)" },
      { id: "debt-date", label: "Date to achieve goal", color: "hsl(350,70%,55%)" },
      { id: "debt-steps", label: "Steps needed to achieve goal", color: "hsl(350,70%,55%)" },
      { id: "debt-accountability", label: "Accountability: Who will help me reach the goal?", color: "hsl(350,70%,55%)" },

      { id: "saving-status", label: "Current status", color: "hsl(30,90%,55%)" },
      { id: "saving-goal", label: "Goal", color: "hsl(30,90%,55%)" },
      { id: "saving-date", label: "Date to achieve goal", color: "hsl(30,90%,55%)" },
      { id: "saving-steps", label: "Steps needed to achieve goal", color: "hsl(30,90%,55%)" },
      { id: "saving-accountability", label: "Accountability: Who will help me reach the goal?", color: "hsl(30,90%,55%)" },

      { id: "tax-status", label: "Current status", color: "hsl(265,55%,45%)" },
      { id: "tax-goal", label: "Goal", color: "hsl(265,55%,45%)" },
      { id: "tax-date", label: "Date to achieve goal", color: "hsl(265,55%,45%)" },
      { id: "tax-steps", label: "Steps needed to achieve goal", color: "hsl(265,55%,45%)" },
      { id: "tax-accountability", label: "Accountability: Who will help me reach the goal?", color: "hsl(265,55%,45%)" },
    ],
  },

// ── Mindset ──
  "three-month-vision": {
    id: "three-month-vision",
    title: "3 Month Vision Worksheet",
    description: "Allow yourself 20 minutes of quiet time to consider these questions to create and shape your vision for the next 3 months. Write your answers in the PRESENT tense. And be as SPECIFIC as you can as this clarity makes your vision easier to achieve.",
    fields: [
      {
        id: "vision-intro",
        label: "How do I want my life to be?",
        subtitle: "Write below how you'd like each area to be in 3 months' time:",
        type: "text",
        color: "#dc2626",
      },
      {
        id: "personal-life",
        label: "Personal life, Home and Family",
        type: "text",
        color: "#1e3a5f",
      },
      {
        id: "career-work",
        label: "Career, Work and Business Life",
        type: "text",
        color: "#1e3a5f",
      },
      {
        id: "health-wellbeing",
        label: "Health and Well-being",
        type: "text",
        color: "#1e3a5f",
      },
      {
        id: "finances",
        label: "Finances",
        type: "text",
        color: "#1e3a5f",
      },
      {
        id: "community-friendships",
        label: "Community and Friendships",
        type: "text",
        color: "#1e3a5f",
      },
      {
        id: "spiritual-learning",
        label: "Spiritual and Learning",
        type: "text",
        color: "#1e3a5f",
      },
      {
        id: "anything-else",
        label: "Write anything else, that you perhaps haven't mentioned yet, here:",
        type: "text",
        color: "#dc2626",
      },
      {
        id: "how-would-it-feel",
        label: "Take a moment to review your vision above and imagine it. How would this feel?",
        type: "text",
        color: "#1e3a5f",
      },
      {
        id: "obstacles",
        label: "What obstacles do you anticipate? What do you need to BE to achieve this? I need to be someone who is:",
        type: "text",
        color: "#1e3a5f",
      },
      {
        id: "one-important-change",
        label: "If there was just ONE important CHANGE you could make over the next 3 months, what would it be?",
        type: "text",
        color: "#1e3a5f",
      },
      {
        id: "theme",
        label: "My THEME for the next 3 months is:",
        type: "text",
        color: "#dc2626",
      },
    ],
  },

  // ── Spiritual ──
  "powerful-questions": {
    id: "powerful-questions",
    title: "Powerful Pondering Questions",
    description: "Please answer each of these questions as clearly and thoughtfully as possible, expressing the best of who you are. A short answer – a few words or a couple of sentences are usually enough. But if you want to write more, then do. If there are any questions you don't feel comfortable with, you don't have to answer them. But know that it is often through exploring our discomfort, that we achieve our greatest learnings and growth.",
    fields: [
      { id: "role-in-world", label: "What do you consider to be your role in the world you live in?", type: "text", color: "#1e3a5f" },
      { id: "secret-passion", label: "If there was a secret passion in your life, what would it be?", type: "text", color: "#0891b2" },
      { id: "avoiding", label: "If there was something you were avoiding or running away from, what would it be?", type: "text", color: "#0891b2" },
      { id: "motivates", label: "What motivates you?", type: "text", color: "#1e3a5f" },
      { id: "sabotage", label: "How do you tend to sabotage yourself?", type: "text", color: "#0891b2" },
      { id: "missing-fulfilling", label: "What is missing in your life? What would make life more fulfilling?", type: "text", color: "#0891b2" },
      { id: "dream", label: "What is your dream?", type: "text", color: "#1e3a5f" },
      { id: "higher-power", label: "Do you believe in God or the concept of some form of higher power? How does this fit into your life?", type: "text", color: "#0891b2" },
      { id: "success-meaning", label: "What does success mean for you? What would a successful life look and feel like?", type: "text", color: "#0891b2" },
      { id: "anything-in-world", label: "If you could have anything in the world what would it be?", type: "text", color: "#0891b2" },
      { id: "rest-of-life", label: "What do you want the rest of your life to be about?", type: "text", color: "#0891b2" },
      { id: "out-of-coaching", label: "What do you most want to get out of coaching?", type: "text", color: "#0891b2" },
      { id: "tips-for-coach", label: "What tips could you give me, so that I can manage our coaching relationship as effectively as possible?", type: "text", color: "#0891b2" },
      { id: "how-rigorous", label: "How rigorous do you want me to be as your coach?", type: "text", color: "#0891b2" },
      { id: "learning-style", label: "How do you best learn? What is your learning style?", type: "text", color: "#0891b2" },
      { id: "enjoy-yourself", label: "How do you enjoy yourself?", type: "text", color: "#0891b2" },
      { id: "release-stress", label: "How specifically do you release stress?", type: "text", color: "#0891b2" },
      { id: "look-after-self", label: "What do you do to look after yourself on a regular basis?", type: "text", color: "#0891b2" },
      { id: "weak-points", label: "What do you think are your weak points in life?", type: "text", color: "#0891b2" },
      { id: "strong-points", label: "What are your strong points?", type: "text", color: "#0891b2" },
      { id: "happiest-unhappiest", label: "When were you happiest – and – unhappiest in your life? What made it so?", type: "text", color: "#0891b2" },
      { id: "given-up", label: "If there was something you had given up on in your life, what would it be?", type: "text", color: "#0891b2" },
    ],
  },


  "goals-motivator": {
    id: "goals-motivator",
    title: "Goals Motivator",
    description:
      "Why we want our goals is totally unique to us, a pay-rise may mean self-esteem and validation, or it could mean security, a holiday or getting married. Once we understand WHY we want our goals – and why we want our goals NOW, it's easier to focus, go the 'extra mile' and find energy to take action towards our goals.\n\nTo get the most out of this exercise, be totally honest with yourself and let go of all self-judgements. Write whatever pops into your head – however random, silly or boring your answers might seem.",
    fields: [
      { id: "goal", label: "Write Your Goal Here:", color: "hsl(210,75%,50%)", type: "text" },
      { id: "motivation-score-start", label: "First, score how motivated you are currently to achieve this goal:", subtitle: "Rate from 1 (not motivated) to 10 (extremely motivated)", color: "hsl(30,90%,55%)", type: "text" },
      { id: "why-want-goal", label: "Why do you want this Goal?", color: "hsl(210,75%,50%)", type: "text" },
      { id: "why-want-that-1", label: "Why do you want that? What does it give you?", color: "hsl(210,75%,50%)", type: "text" },
      { id: "why-want-that-2", label: "Why do you want that? What does it give you?", subtitle: "These questions relate to the answer immediately before. Keep answering even if you repeat answers.", color: "hsl(350,70%,55%)", type: "text" },
      { id: "why-want-that-3", label: "Why do you want that? What does it give you?", color: "hsl(350,70%,55%)", type: "text" },
      { id: "why-want-that-4", label: "Why do you want that? What does it give you?", color: "hsl(350,70%,55%)", type: "text" },
      { id: "achieving-feeling", label: "Achieving this goal will leave me feeling:", color: "hsl(175,60%,40%)", type: "text" },
      { id: "why-now", label: "What circumstances in your life make this goal important to you right now? Why NOW and not next (or last) year?", subtitle: "Now you understand why you want your goal and how you want to feel. But to be really motivated, you need to be clear on why you want this goal now", color: "hsl(30,90%,55%)", type: "text" },
      { id: "how-feel-about-goal", label: "So, now you understand your true motivations, how does this change the way you feel about your goal?", color: "hsl(175,60%,40%)", type: "text" },
      { id: "motivation-score-end", label: "I am now motivated to achieve this goal:", subtitle: "Rate from 1 to 10. If your motivation score is not 8 or above, why do you have this goal? Is it really your goal?", color: "hsl(30,90%,55%)", type: "text" },
      { id: "learned", label: "What did you learn about yourself and your goal? What will you do differently?", color: "hsl(265,55%,45%)", type: "text" },
    ],
  },

  // ── Communicate ──
  "35-questions-to-ponder": {
    id: "35-questions-to-ponder",
    title: "35 Questions to Ponder",
    description:
      "Closeness within any team is important. When people know each other well, whether in the workplace, a sports team, or any other group setting, they are more likely to trust, respect, and understand one another.",
    fields: [
      { id: "q1", label: "Given the choice of anyone in the world, whom would you want as a dinner guest?", color: "hsl(210,75%,50%)", type: "text" },
      { id: "q2", label: "Would you like to be famous? In what way?", color: "hsl(210,75%,50%)", type: "text" },
      { id: "q3", label: "Before making a telephone call, do you ever rehearse what you are going to say? Why?", color: "hsl(210,75%,50%)", type: "text" },
      { id: "q4", label: 'What would constitute a "perfect" day for you?', color: "hsl(210,75%,50%)", type: "text" },
      { id: "q5", label: "When did you last sing to yourself? To someone else?", color: "hsl(210,75%,50%)", type: "text" },
      { id: "q6", label: "If you were able to live to the age of 90 and retain either the mind or body of a 30-year-old for the last 60 years of your life, which would you want?", color: "hsl(210,75%,50%)", type: "text" },
      { id: "q7", label: "Do you have a secret hunch about how you will die?", color: "hsl(210,75%,50%)", type: "text" },
      { id: "q8", label: "Name three things you and the other person appear to have in common", color: "hsl(210,75%,50%)", type: "text" },
      { id: "q9", label: "For what in your life do you feel most grateful?", color: "hsl(210,75%,50%)", type: "text" },
      { id: "q10", label: "If you could change anything about the way you were raised, what would it be?", color: "hsl(210,75%,50%)", type: "text" },
      { id: "q11", label: "Take four minutes and tell the other person your life story in as much detail as possible", color: "hsl(210,75%,50%)", type: "text" },
      { id: "q12", label: "If you could wake up tomorrow having gained any one quality or ability, what would it be?", color: "hsl(175,60%,40%)", type: "text" },
      { id: "q13", label: "If a crystal ball could tell you the truth about yourself, your life, the future, or anything else, what would you want to know?", color: "hsl(175,60%,40%)", type: "text" },
      { id: "q14", label: "Is there something that you've dreamed of doing for a long time? Why haven't you done it?", color: "hsl(175,60%,40%)", type: "text" },
      { id: "q15", label: "What is the greatest accomplishment of your life?", color: "hsl(175,60%,40%)", type: "text" },
      { id: "q16", label: "What do you value most in a friendship?", color: "hsl(175,60%,40%)", type: "text" },
      { id: "q17", label: "What is your most treasured memory?", color: "hsl(175,60%,40%)", type: "text" },
      { id: "q18", label: "What is your most terrible memory?", color: "hsl(175,60%,40%)", type: "text" },
      { id: "q19", label: "If you knew that you would die suddenly in one year, would you change anything about how you are now living? Why?", color: "hsl(175,60%,40%)", type: "text" },
      { id: "q20", label: "What does friendship mean to you?", color: "hsl(175,60%,40%)", type: "text" },
      { id: "q21", label: "What roles do love and affection play in your life?", color: "hsl(175,60%,40%)", type: "text" },
      { id: "q22", label: "With your partner, alternate in sharing something you consider a positive characteristic of the other person. Share a total of five items.", color: "hsl(350,70%,55%)", type: "text" },
      { id: "q23", label: "How close and warm is your family? Do you feel your childhood was happier than most other people's?", color: "hsl(350,70%,55%)", type: "text" },
      { id: "q24", label: "How do you feel about your relationship with your mother?", color: "hsl(350,70%,55%)", type: "text" },
      { id: "q25", label: 'Complete this sentence: "I wish I had someone with whom I could share ... "', color: "hsl(350,70%,55%)", type: "text" },
      { id: "q26", label: "If you were going to become a close friend with the other person, share what would be important for them to know", color: "hsl(350,70%,55%)", type: "text" },
      { id: "q27", label: "Tell the other person what you like about them; be very honest, saying things that you might not say to someone you've just met.", color: "hsl(350,70%,55%)", type: "text" },
      { id: "q28", label: "Share an embarrassing moment in your life.", color: "hsl(350,70%,55%)", type: "text" },
      { id: "q29", label: "When did you last cry in front of another person? By yourself?", color: "hsl(350,70%,55%)", type: "text" },
      { id: "q30", label: "Tell the other person something that you like about them already", color: "hsl(350,70%,55%)", type: "text" },
      { id: "q31", label: "What is too serious to joke about, if anything?", color: "hsl(30,90%,55%)", type: "text" },
      { id: "q32", label: "If you were to die this evening with no opportunity to communicate with anyone, what would you most regret not having told someone? Why haven't you told them yet?", color: "hsl(30,90%,55%)", type: "text" },
      { id: "q33", label: "Your house, containing everything you own, catches fire. After saving your loved ones and pets, you have time to make a final dash to save any one item safely. What would it be? Why?", color: "hsl(30,90%,55%)", type: "text" },
      { id: "q34", label: "Of all the people in your family, whose death would you find most disturbing? Why?", color: "hsl(30,90%,55%)", type: "text" },
      { id: "q35", label: "Share a personal problem and ask the other person's advice on how he or she might handle it. Additionally, ask your partner to reflect on how you seem to be feeling about your chosen problem.", color: "hsl(30,90%,55%)", type: "text" },
    ],
  },

  "softened-start-up": {
    id: "softened-start-up",
    title: "The Softened Start-Up",
    description:
      'While conflict is an inevitable part of life, how we choose to approach potential conflict determines how that conversation will play out. If you are critical or judgmental, you will likely receive negativity and defensiveness in return. A harsh start-up can feel like a direct attack on someone\'s character. For example, "You always spend too much money!", "Why can you never get things are done on time?" or "You never do anything around here."\n\nSoftening the start of a conversation is crucial to managing and resolving conflicts with your spouse or partner, your children, friends, or coworkers. A softened start-up allows you to voice your concerns and needs without blaming the other person. This makes it more likely they will be receptive to your complaint because your words and tone are not accusatory, judgmental, or negative.\n\nUsing the examples above, softened alternatives include, "I would like to sit down together and work out how we can budget our money better," "We talked about a deadline for the project and agreed on a schedule, please give this all of your attention," and "I like when we work together to get things done."',
    fields: [
      { id: "past-conflict", label: "Take a moment to think of a conflict you had in the past. This could be with a work colleague, family member, spouse, or partner, for example. Using the space below, describe what happened, including what was said and the outcome of the disagreement.", color: "hsl(210,75%,50%)", type: "text" },
      { id: "i-feel", label: 'I feel....', subtitle: 'Now that you have recalled a past conflict, you will think about how you might have approached the conversation in a gentler, non-confrontational way. A useful formula to follow when creating a softened start-up is:\n• Make an "I" statement\n• Describe how you feel\n• Describe the situation, be neutral, do not blame\n• Explain what you need so that things can be improved', color: "hsl(175,60%,40%)", type: "text" },
      { id: "about", label: "About....", color: "hsl(175,60%,40%)", type: "text" },
      { id: "i-need", label: "I need.....", color: "hsl(175,60%,40%)", type: "text" },
      { id: "complete-exercise", label: "What was it like to complete this exercise?", color: "hsl(30,90%,55%)", type: "text" },
      { id: "teach-about-conflict", label: "What did this exercise teach you about conflict?", color: "hsl(30,90%,55%)", type: "text" },
      { id: "changed-thinking", label: "In what ways has this exercise changed how you think about approaching potential conflict?", color: "hsl(30,90%,55%)", type: "text" },
      { id: "helpful", label: "In what ways did you find this exercise to be helpful?", color: "hsl(350,70%,55%)", type: "text" },
      { id: "insights", label: "What insights have you gained from this exercise?", color: "hsl(350,70%,55%)", type: "text" },
    ],
  },

  // ── Organization ──
  "career-discovery": {
    id: "career-discovery",
    title: "Career Discovery",
    description:
      "Below are 21 thoughtful questions designed to stimulate your thinking and help you look for the threads and patterns that weave throughout your life. These threads may point to possible careers, or they may simply be qualities to build into your work-life.",
    importantNote:
      "INSTRUCTIONS:\n• These questions will take time. So answer a few, then take a break when you get tired or stop enjoying the process.\n• It's helpful to take quiet time so you enjoy this process. Then you can answer each question as clearly and thoughtfully as possible, expressing your best response – and one that connects you to your deepest truth.\n• A few words or sentences can be enough, but often the 'gems' are found in the detail. And sometimes, just when we think we're finished, we pause and reflect, and a great new idea pops up – so be as thorough as you can.\n• Finally, if you find you're repeating answers in different questions – GREAT! Keep going! This is exactly what we're looking for – the common and repeating threads that keep popping up and can't be ignored.",
    fields: [
      { id: "grew-up-wanted", label: "When you were younger, what did you want to be when you grew up?", subtitle: "Consider this from as far back as you can remember. Write down as much detail as you can – however boring, silly or outrageous. Start with I remember ...", color: "hsl(210,75%,50%)", type: "text" },
      { id: "attracted-at-time", label: "What attracted you, at the time, to these careers or occupations?", color: "hsl(210,75%,50%)", type: "text" },
      { id: "still-attractive", label: "Knowing what you know now, which careers – or part of them – are still:\ni) attractive - and why?", color: "hsl(210,75%,50%)", type: "text" },
      { id: "now-unattractive", label: "ii) are now unattractive - and why?", color: "hsl(210,75%,50%)", type: "text" },
      { id: "work-currently", label: "What aspects of these careers (whether good or bad) do you have in your work:\ni) currently", color: "hsl(175,60%,40%)", type: "text" },
      { id: "work-past", label: "ii) in past roles", color: "hsl(175,60%,40%)", type: "text" },
      { id: "enjoy-at-work", label: "How do you currently enjoy yourself at work? What are you doing and how are you being that makes this so?", color: "hsl(175,60%,40%)", type: "text" },
      { id: "lottery-what", label: "If you won the lottery and became a multi-millionaire and could choose to be or do anything\ni) what would you be and what would you do with your time?", color: "hsl(30,90%,55%)", type: "text" },
      { id: "lottery-attracts", label: "ii) what attracts you to these areas above? Answer as fully as you can:", color: "hsl(30,90%,55%)", type: "text" },
      { id: "hobbies-past", label: "What hobbies or interests have you had in the past (from your earliest rememberings to now)?\nStart with I remember ...", color: "hsl(0,80%,55%)", type: "text" },
      { id: "hobbies-now", label: "What hobbies or interests do you have now?", color: "hsl(0,80%,55%)", type: "text" },
      { id: "hobbies-time", label: "What hobbies or interests would you take up if you had more:\ni) Time?", color: "hsl(0,80%,55%)", type: "text" },
      { id: "hobbies-money", label: "ii) Money", color: "hsl(0,80%,55%)", type: "text" },
      { id: "hobbies-freedom", label: "iii) Freedom", color: "hsl(0,80%,55%)", type: "text" },
      { id: "hobbies-attracts", label: "What attracts you to the various hobbies and interests you mention above?", color: "hsl(0,80%,55%)", type: "text" },
      { id: "love-working-with", label: "Who have you (in the past) or do you (currently) really love working with?", color: "hsl(265,55%,45%)", type: "text" },
      { id: "people-qualities", label: "What qualities do these people have? What qualities do they have in common?", color: "hsl(265,55%,45%)", type: "text" },
      { id: "find-people", label: "Where might you find people with these qualities?", color: "hsl(265,55%,45%)", type: "text" },
      { id: "your-qualities", label: "Which of your qualities do you most enjoy using?", color: "hsl(265,55%,45%)", type: "text" },
      { id: "given-up", label: "If there was something you had given up on in your life, what would it be?", color: "hsl(350,70%,55%)", type: "text" },
      { id: "your-dream", label: "What is your dream?", color: "hsl(350,70%,55%)", type: "text" },
      { id: "rest-of-life", label: "What do you want the rest of your life to be about?", color: "hsl(350,70%,55%)", type: "text" },
      { id: "want-from-work", label: "Deep down, what do you really, really want from your work life?", color: "hsl(350,70%,55%)", type: "text" },
      { id: "no-obstacles", label: "What would you do next if there was no obstacles whatsoever?", color: "hsl(350,70%,55%)", type: "text" },
      { id: "10-15-20-years", label: "What do you want to be doing with your life in 10, 15, and 20 years' time?", color: "hsl(350,70%,55%)", type: "text" },
      { id: "common-threads", label: "Finally, review the answers to all your questions above. Then list out the common threads, themes, building blocks or key pieces of information you observe below:", color: "hsl(210,75%,50%)", type: "list" },
      { id: "really-helpful", label: "What is really helpful and why?", color: "hsl(175,60%,40%)", type: "text" },
      { id: "ponder-more", label: "What would you like to ponder on more?", color: "hsl(175,60%,40%)", type: "text" },
      { id: "feel-differently", label: "How do you feel differently now about your goal or decision?", color: "hsl(175,60%,40%)", type: "text" },
      { id: "values-reflected", label: "What values (things that are really important to you) can you see reflected in your responses?", color: "hsl(175,60%,40%)", type: "text" },
      { id: "biggest-win", label: "What is your biggest win for completing this exercise?", color: "hsl(175,60%,40%)", type: "text" },
      { id: "next-steps", label: "Finally, what will you do with this information? What are your next steps?", color: "hsl(30,90%,55%)", type: "table", columns: ["Action", "by When"] },
    ],
  },

  "priority-matrix": {
    id: "priority-matrix",
    title: "Action/Priority Matrix",
    description:
      "Would you like to be more productive with the time you have? Achieve more with less effort? Delegate time-consuming tasks? Well, you can! Achieve more by identifying QUICK Win Tasks that are LOW Effort yet HIGH Impact, and letting go of Hard SLOGS: HIGH Effort, LOW Impact tasks.",
    importantNote:
      "INSTRUCTIONS:\nMany of us spend time on big project tasks. But what quick wins could focus on or let go of that would maximize your productivity? Use the empty spaces below to review your task-list and see what you learn.\n\n• Mention the % of time you currently spend in each state. Where do you spend most of your time?\n• Review your tasks for the week and then assign them to the states below.",
    fields: [
      { id: "quick-wins", label: "HIGH Impact, LOW Effort (Easy): QUICK Wins!", subtitle: "Spend 5 mins brainstorming these every week. Do as many as you can, identify one to complete daily!", color: "hsl(175,60%,40%)", type: "list" },
      { id: "quick-wins-time", label: "Time Spent:", color: "hsl(175,60%,40%)", type: "text" },
      { id: "big-projects", label: "HIGH Impact, HIGH Effort (Hard): Big PROJECTS", subtitle: "Block out time to do the work. Plan and clarify required outputs. Break down tasks into smaller chunks.", color: "hsl(210,75%,50%)", type: "list" },
      { id: "big-projects-time", label: "Time Spent:", color: "hsl(210,75%,50%)", type: "text" },
      { id: "filler-tasks", label: "LOW Impact, LOW Effort: FILLER Tasks", subtitle: "First ask: Is this low impact task really necessary? Use these to fill 15-30min gaps or take breaks from bigger tasks.", color: "hsl(30,90%,55%)", type: "list" },
      { id: "filler-tasks-time", label: "Time Spent:", color: "hsl(30,90%,55%)", type: "text" },
      { id: "hard-slogs", label: "LOW Impact, HIGH Effort: Hard SLOGS!", subtitle: "Is this task really necessary? Who could you delegate to? Break it into smaller pieces if you HAVE to do it.", color: "hsl(350,70%,55%)", type: "list" },
      { id: "hard-slogs-time", label: "Time Spent:", color: "hsl(350,70%,55%)", type: "text" },
      { id: "focus-quick-wins", label: "The Quick Wins I will focus on are", color: "hsl(175,60%,40%)", type: "text" },
      { id: "delegate-hard-slogs", label: "The Hard Slogs I will delegate or drop are", color: "hsl(350,70%,55%)", type: "text" },
      { id: "other-actions", label: "Other Action's I will take are", color: "hsl(210,75%,50%)", type: "text" },
    ],
  },

  // ── Creativity ──
  "dictionary-story": {
    id: "dictionary-story",
    title: "Dictionary Story",
    description:
      "Discovering how to weave a captivating and unified narrative from seemingly disparate elements can enhance your skill in establishing connections and melding unrelated ideas.\n\nSelect a word at random from the dictionary. Use the word you chose, the word above it and the word below it to create a short story.",
    fields: [
      { id: "selected-word", label: "Selected Word from Dictionary:", color: "hsl(210,75%,50%)", type: "text" },
      { id: "your-story", label: "Your Story", subtitle: "You can start with Once upon a time, Long time ago....", color: "hsl(175,60%,40%)", type: "text" },
    ],
  },

  "alternate-uses": {
    id: "alternate-uses",
    title: "Alternate Uses",
    description:
      "Alternate uses is an exercise that encourages divergent thinking – the ability to generate ideas or solutions from a single idea or a piece of information. This skill is thought to be one of the most important factors of creativity.\n\nThe Alternate Uses exercise requires you to come up with as many ideas as possible of how to use a given item, with a limit of 3 minutes. A great thing about it is that the more you practice, the easier it gets, because your mind starts to apply this way of thinking to any situation of life automatically.",
    fields: [
      { id: "object", label: "What is the object that came to your mind?", color: "hsl(210,75%,50%)", type: "text" },
      { id: "ideas", label: "Come up with as many ideas as possible of how to use the above item", color: "hsl(175,60%,40%)", type: "list" },
    ],
  },

  "my-day": {
    id: "my-day",
    title: "My Day",
    description:
      "Compose a poetic reflection on your day, drawing inspiration from the distinctive style of your preferred poet or adhering to the structured format of a classic poem such as a sonnet or haiku. The discipline of adhering to a defined structure compels you to seek the perfect words or phrases that seamlessly fit the constraints, thereby enhancing your proficiency in the art of writing.",
    fields: [
      { id: "my-day-poem", label: "My Day", color: "hsl(265,55%,45%)", type: "text" },
    ],
  },

  "compound-collaborative": {
    id: "compound-collaborative",
    title: "Compound Collaborative",
    description:
      "Discovering how to weave a captivating and unified narrative from seemingly disparate elements can enhance your skill in establishing connections and melding unrelated ideas.\n\nSelect a word at random from the dictionary. Use the word you chose, the word above it and the word below it to create a short story.",
    fields: [
      { id: "compound-word", label: "Your Compound Word:", color: "hsl(210,75%,50%)", type: "text" },
      { id: "your-story", label: "Start Your Story Here:", subtitle: "You can start with Once upon a time, A long time ago...", color: "hsl(175,60%,40%)", type: "text" },
    ],
  },

  // ── Employee ──
  "reminder-list": {
    id: "reminder-list",
    title: "Reminder List",
    description:
      "Each exercise is special. It's a unique exchange of ideas, thoughts, questions, observations and reflections that you perceive.\n\nThis list helps you prepare and make the most of your ideas that occur at different points.",
    importantNote:
      "Consider these categories as you reflect:\n\nFeelings about....\n• self/other, health, work/career, finances, life/meaning, attitudes/habits, a recent experience, what else?\n\nFuture events....\n• plans/commitments, visits/meetings, goals/actions, strategies to get there, what else?\n\nOther events....\n• disappointments, decisions, concerns, what else?\n\nPositive events....\n• achievements, changes, insights, happiness/joy, what else?\n\nAreas to get help....\n• stuck, missing/would like, patterns/habits, unsure about/confused, fears and worry, focus/motivation, what else?",
    fields: [
      { id: "ideas-to-discuss", label: "If you like, write some ideas below from the above list that you might like to discuss:", color: "hsl(210,75%,50%)", type: "text" },
    ],
  },

  "intake-questions": {
    id: "intake-questions",
    title: "Intake Questions",
    description:
      "These questions are to stimulate your thinking and make our work together more productive. And because the personal affects business and vice versa.",
    importantNote:
      "• Answer each of these questions as clearly and thoughtfully as possible, expressing the best of who you are. A short answer – a few words or a couple of sentences are usually enough. But if you want to write more, then do.\n• Finally, if there are any questions you don't feel comfortable with, you don't have to answer them. But know that it is often through exploring our discomfort, that we achieve our greatest learnings and growth.",
    fields: [
      { id: "vision-mission", label: "What is your vision or mission statement? What do you consider your role to be professionally in the world?", color: "hsl(210,75%,50%)", type: "text" },
      { id: "biggest-successes", label: "What have been the biggest successes professionally, so far?", color: "hsl(210,75%,50%)", type: "text" },
      { id: "challenges", label: "What challenges are you currently facing in your office? What challenges do you foresee?", color: "hsl(210,75%,50%)", type: "text" },
      { id: "key-goals", label: "If you had 3 absolutely key goals professionally, what would they be?", color: "hsl(210,75%,50%)", type: "text" },
      { id: "strengths-achieve", label: "What strengths will help you achieve these goals?", color: "hsl(175,60%,40%)", type: "text" },
      { id: "key-measures", label: "What are the key measures you use in your job?", color: "hsl(175,60%,40%)", type: "text" },
      { id: "avoiding-at-work", label: "If there was something in your job that you were avoiding or running away from, what would it be?", color: "hsl(350,70%,55%)", type: "text" },
      { id: "secret-change", label: "If there was a change you'd secretly like to make to your job, what would it be?", color: "hsl(350,70%,55%)", type: "text" },
      { id: "whats-missing", label: "What's missing in your job? Eg. systems, processes, tools, technology, leadership, staff, a product or service etc.?", color: "hsl(350,70%,55%)", type: "text" },
      { id: "out-of-coaching", label: "What do you personally want to get out of coaching?", color: "hsl(30,90%,55%)", type: "text" },
      { id: "success-meaning", label: "What does success mean to you?", color: "hsl(30,90%,55%)", type: "text" },
      { id: "biggest-strengths", label: "What are your 3 biggest strengths?", color: "hsl(30,90%,55%)", type: "text" },
      { id: "sabotage", label: "How do you tend to sabotage yourself?", color: "hsl(265,55%,45%)", type: "text" },
      { id: "personal-values", label: "Which personal values come through in your job? How are you different at work compared to at home?", color: "hsl(265,55%,45%)", type: "text" },
      { id: "learning-style", label: "How do you best learn? What is your learning style?", color: "hsl(265,55%,45%)", type: "text" },
      { id: "release-stress", label: "How specifically do you release stress? What do you do to look after yourself on a regular basis?", color: "hsl(265,55%,45%)", type: "text" },
      { id: "enjoy-yourself", label: "How do you enjoy yourself?", color: "hsl(175,60%,40%)", type: "text" },
      { id: "given-up", label: "If there was something you had given up on in your life – what would it be?", color: "hsl(175,60%,40%)", type: "text" },
    ],
  },

  "take-stock-take-action": {
    id: "take-stock-take-action",
    title: "Take Stock and Take Action",
    description:
      "This is a great exercise to do over a cup of tea or coffee to pause, take stock and then take action.",
    importantNote:
      "INSTRUCTIONS:\n• Answer the questions below, then look for the key points, patterns and similarities you notice from your responses.\n• Finally, note down your Top 3 Observations and identify an action to move forwards for each one!\n\nNOTE: Feel free to take your time and get temporarily side-tracked as you consider your responses: the questions are deliberately vague – so just trust and write down whatever comes to your mind.",
    fields: [
      { id: "tolerances", label: "TOLERANCES: What are you PUTTING UP WITH at the moment?", color: "hsl(210,75%,50%)", type: "text" },
      { id: "shoulds", label: "SHOULDS: What so you think you 'SHOULD' be doing right now, professionally & personally?", color: "hsl(210,75%,50%)", type: "text" },
      { id: "frustrations", label: "FRUSTRATIONS: What things are FRUSTRATING you about yourself, your life, health, work, other?", color: "hsl(350,70%,55%)", type: "text" },
      { id: "desires", label: "DESIRES: What do you REALLY, REALLY WANT right now in your personal and/or professional life?", color: "hsl(350,70%,55%)", type: "text" },
      { id: "feelings-current", label: "FEELINGS: How do you CURRENTLY feel?", color: "hsl(30,90%,55%)", type: "text" },
      { id: "feelings-want", label: "FEELINGS: How do you WANT to feel?", color: "hsl(30,90%,55%)", type: "text" },
      { id: "key-observations", label: "Now, review your answers above. What do you notice? Put the most important thing first, then the second and third in order. Then considering your key learnings below, think of an action to address each one within the next week:", color: "hsl(175,60%,40%)", type: "table", columns: ["Key observation", "Action"] },
    ],
  },

  // ── Corporate ──
  "reclaim-your-power": {
    id: "reclaim-your-power",
    title: "Reclaim Your Power at Work",
    description:
      "We all have feelings while working – it's where most of us spend our prime years and the bulk of our time. These feelings change over time, and can be anything from misery to enthusiasm and joy.\n\nPeople who enjoy their work are usually good at making a distinction between who they are and the results of their work. This brings a healthy detachment that allows for enjoyment of work independent of circumstances. If you don't maintain this distinction, your enjoyment will always be dependent on whether or not things are going 'well'.\n\nIn order to make changes in your career it helps to understand what you enjoy – and what you don't – in your current work. Then you can make yourself more comfortable where you are while you ponder and take action on alternative careers, new ideas or new directions.\n\nRemember that it's very important, when making big changes in our lives, to move from a position of strength – and not from a position of weakness or unhappiness. This helps us avoid hasty or regrettable decisions.",
    importantNote:
      "INSTRUCTIONS:\n• The purpose of this exercise is to empower yourself in your current working situation.\n• First, find out what contributes to how you feel at work by answering the questions below.\n• Then use what you learn to identify 3 actions to reclaim your power at work.\n\nNOTE: It's important to be honest with yourself – awareness is a powerful tool for change. If you deny the truth of a situation, you also deny yourself the opportunity to make meaningful change.",
    fields: [
      { id: "time-enjoyment", label: "What % of your time at work are you feeling: ENJOYMENT / IN BETWEEN / MISERY", color: "hsl(210,75%,50%)", type: "text" },
      { id: "contribute-enjoyment", label: "What would you say most contribute to your enjoyment at work?", color: "hsl(175,60%,40%)", type: "text" },
      { id: "contribute-misery", label: "What would you say most contribute to your misery at work?", color: "hsl(350,70%,55%)", type: "text" },
      { id: "critical-variables", label: "What would you say are the underlying critical variables that affect your enjoyment of your work?", color: "hsl(30,90%,55%)", type: "text" },
      { id: "do-differently", label: "What COULD you do differently at your CURRENT work to feel better?", color: "hsl(30,90%,55%)", type: "text" },
      { id: "biggest-difference", label: "What is the biggest 'difference that makes the difference' as to whether you enjoy your work or not?", color: "hsl(265,55%,45%)", type: "text" },
      { id: "empower-actions", label: "Now, what WILL you do differently to empower yourself in your CURRENT work situation?", color: "hsl(175,60%,40%)", type: "table", columns: ["Action", "by When"] },
    ],
  },

  "spheres-of-influence": {
    id: "spheres-of-influence",
    title: "My Spheres of Influence",
    description:
      "This exercise helps you understand the areas of your life and work where you have influence – and where you don't. By getting clear on what you CAN control, you empower yourself to focus your energy where it matters most, letting go of what's outside your control.",
    fields: [
      { id: "can-control", label: "What CAN you control or influence in your work/life right now?", color: "hsl(175,60%,40%)", type: "list" },
      { id: "cannot-control", label: "What can you NOT control?", color: "hsl(350,70%,55%)", type: "list" },
      { id: "energy-wasted", label: "Where are you wasting energy on things you can't control?", color: "hsl(30,90%,55%)", type: "text" },
      { id: "redirect-energy", label: "How could you redirect that energy to things within your sphere of influence?", color: "hsl(210,75%,50%)", type: "text" },
      { id: "actions", label: "What 3 actions will you take this week to focus on what you CAN influence?", color: "hsl(175,60%,40%)", type: "list" },
    ],
  },
};

// Special exercise IDs that use dedicated components
export const specialExercises: Record<string, "quiz" | "checkin" | "planner" | "procrastinating" | "get-motivated" | "intuition" | "love-loathe" | "discover-yourself" | "gratitude-diary" | "wacky-wild-goal" | "big-rocks" | "rocking-chair" | "smart-goals"> = {
  "Self-Care Quiz": "quiz",
  "Self-care List": "checkin",
  "Success Planner": "planner",
  "Eliminate Delaying": "procrastinating",
  "Get Motivated!": "get-motivated",
  "Intuition Exercise": "intuition",
  "Love And Loathe List": "love-loathe",
  "Discover Yourself": "discover-yourself",
  "Gratitude Diary": "gratitude-diary",
  "Wacky Wild Goal": "wacky-wild-goal",
  "Big & Little Rocks": "big-rocks",
  "Rocking Chair": "rocking-chair",
  "SMART! Goals": "smart-goals",
};

// Map exercise titles to template IDs
export const exerciseTitleToTemplateId: Record<string, string> = {
  "Improvement Canvas": "improvement-canvas",
  "SWOT Analysis": "swot-analysis",
  "Not To-Do List": "not-to-do-list",
  "GROW": "grow",
  "Make Heart Sing": "make-heart-sing",
  "Detox Toxic Relationships": "detox-relationship",
  "Identify Your Zappers": "energy-zappers",
  "Putting Up With?": "putting-up-with",
  "Urgent vs. Important": "urgent-vs-important",
  "Plan, Do and Review": "plan-do-review",
  "My Money Priorities": "my-money-priorities",
  "Financial Goals Chart": "financial-goals-chart",
  "Unstick Yourself!": "unstick-yourself",
  "Love Your Weaknesses": "love-your-weaknesses",
  "Build a Bridge": "build-a-bridge",
  "Mentor Magic!": "mentor-magic",
  "Let Go": "let-go",
  "Too Comfortable?": "too-comfortable",
  "Daily Success Habits": "daily-success-habits",
  "Positive Visualisation": "positive-visualisation",
  "Get Perspective": "get-perspective",
  "Talk to Yourself!": "talk-to-yourself",
  "3 Month Vision": "three-month-vision",
  "Powerful Questions": "powerful-questions",
  "Goals Motivator": "goals-motivator",
  "35 Questions to Ponder": "35-questions-to-ponder",
  "The Softened Start-Up": "softened-start-up",
  "Career Discovery": "career-discovery",
  "Priority Matrix": "priority-matrix",
  "Expand Your Mind": "career-discovery",
  "Dictionary Story": "dictionary-story",
  "Alternate Uses": "alternate-uses",
  "My Day": "my-day",
  "Compound Collaborative": "compound-collaborative",
  "Reminder List": "reminder-list",
  "Intake Questions": "intake-questions",
  "Take Stock – Take Action!": "take-stock-take-action",
  "Reclaim Your Power": "reclaim-your-power",
  "My Spheres of Influence": "spheres-of-influence",
};
