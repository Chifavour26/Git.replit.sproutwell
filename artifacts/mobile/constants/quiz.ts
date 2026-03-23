export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: "nutrition" | "activity" | "sleep" | "health";
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "How many fruits and vegetables should kids eat every day?",
    options: ["1-2 servings", "3-4 servings", "5 or more servings", "It doesn't matter"],
    correctIndex: 2,
    explanation: "Eating 5 or more fruits and veggies a day gives your body amazing vitamins and keeps you strong!",
    category: "nutrition",
  },
  {
    id: "q2",
    question: "How many minutes of active play do kids need daily?",
    options: ["15 minutes", "30 minutes", "45 minutes", "60 minutes"],
    correctIndex: 3,
    explanation: "60 minutes of movement every day helps your heart, muscles, and brain work their best!",
    category: "activity",
  },
  {
    id: "q3",
    question: "Which drink is best for staying healthy?",
    options: ["Soda", "Fruit juice", "Water", "Sports drinks"],
    correctIndex: 2,
    explanation: "Water is the ultimate superhero drink! It keeps every cell in your body working great.",
    category: "nutrition",
  },
  {
    id: "q4",
    question: "How many hours of sleep does a 10-year-old need?",
    options: ["5-6 hours", "7-8 hours", "9-11 hours", "12+ hours"],
    correctIndex: 2,
    explanation: "Kids aged 6-12 need 9-11 hours of sleep. Sleep is when your brain grows and repairs itself!",
    category: "sleep",
  },
  {
    id: "q5",
    question: "What happens when you eat breakfast every morning?",
    options: ["Nothing special", "Better focus and energy", "You feel sleepy", "Less hunger at lunch"],
    correctIndex: 1,
    explanation: "Breakfast fuels your brain for learning and keeps your energy up all morning!",
    category: "nutrition",
  },
  {
    id: "q6",
    question: "Which food group gives you the most energy?",
    options: ["Candy and sweets", "Whole grains like oats and brown rice", "Chips and crackers", "Soda"],
    correctIndex: 1,
    explanation: "Whole grains are packed with energy that lasts all day, unlike sugary foods that cause crashes!",
    category: "nutrition",
  },
  {
    id: "q7",
    question: "How much screen time is recommended for kids your age per day?",
    options: ["6 hours", "4 hours", "2 hours or less", "No limits"],
    correctIndex: 2,
    explanation: "Limiting screens to 2 hours lets your eyes rest and leaves time for other amazing activities!",
    category: "health",
  },
  {
    id: "q8",
    question: "What does exercise do for your heart?",
    options: ["Makes it weaker", "Has no effect", "Makes it stronger", "Makes it beat slower always"],
    correctIndex: 2,
    explanation: "Exercise is like a workout for your heart — the more you move, the stronger your heart gets!",
    category: "activity",
  },
  {
    id: "q9",
    question: "Which snack is the healthiest choice?",
    options: ["Potato chips", "Apple slices with peanut butter", "Gummy bears", "Chocolate cake"],
    correctIndex: 1,
    explanation: "Apple with peanut butter gives you fiber, vitamins, and protein — a triple win!",
    category: "nutrition",
  },
  {
    id: "q10",
    question: "Why is it important to wash hands before eating?",
    options: ["It's just a habit", "Hands can carry germs that make you sick", "To make food taste better", "Adults said so"],
    correctIndex: 1,
    explanation: "Washing hands removes bacteria and viruses that could make you sick. 20 seconds of soap and water does the trick!",
    category: "health",
  },
];

export const EDUCATIONAL_CONTENT = [
  {
    id: "e1",
    title: "Build Your Healthy Plate",
    category: "nutrition" as const,
    duration: "3 min",
    icon: "nutrition",
    description: "Learn how to fill your plate with colorful foods for maximum nutrition!",
    tips: [
      "Half your plate should be fruits and vegetables",
      "Choose whole grains like brown rice and whole wheat bread",
      "Include lean proteins like beans, chicken, or fish",
      "Drink water instead of sugary drinks",
      "Try one new vegetable each week",
    ],
  },
  {
    id: "e2",
    title: "60 Minutes of Fun!",
    category: "activity" as const,
    duration: "2 min",
    icon: "fitness",
    description: "Discover exciting ways to move your body every single day!",
    tips: [
      "Dance to your favorite songs",
      "Play tag or hide-and-seek with friends",
      "Ride your bike or scooter",
      "Jump rope or do jumping jacks",
      "Swim or play at the park",
    ],
  },
  {
    id: "e3",
    title: "Sleep Like a Champion",
    category: "sleep" as const,
    duration: "2 min",
    icon: "sleep",
    description: "Discover why sleep is your secret superpower for health and learning!",
    tips: [
      "Go to bed at the same time every night",
      "Keep your room cool and dark",
      "Avoid screens 1 hour before bed",
      "Read a book to wind down",
      "Your brain grows while you sleep!",
    ],
  },
  {
    id: "e4",
    title: "Heart Health Heroes",
    category: "health" as const,
    duration: "4 min",
    icon: "heart",
    description: "Learn how today's healthy choices protect your heart for life!",
    tips: [
      "Regular exercise strengthens your heart muscle",
      "Fruits and veggies reduce future disease risk",
      "Less sugar means a healthier heart long-term",
      "Good sleep keeps your blood pressure healthy",
      "You're building healthy habits that last forever!",
    ],
  },
];
