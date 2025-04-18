import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Admin credentials - in a real app, these would be stored securely
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

// Example cooking questions and answers
const EXAMPLE_QA = [
  {
    question: "How do I cook perfect pasta?",
    answer: "Bring a large pot of water to a rolling boil, add salt (about 1-2 tablespoons per pound of pasta), add pasta and stir occasionally. Cook according to package instructions until al dente. Reserve some pasta water before draining.",
    keywords: ["pasta", "cooking", "boiling", "al dente"]
  },
  {
    question: "What's the best way to store fresh herbs?",
    answer: "Treat fresh herbs like flowers: trim the stems and place them in a glass with a small amount of water. Cover loosely with a plastic bag and store in the refrigerator. Change water every few days. For basil, store at room temperature.",
    keywords: ["herbs", "storage", "fresh", "refrigerator"]
  },
  {
    question: "How do I know when my steak is done?",
    answer: "Use the finger test or a meat thermometer. For medium-rare, internal temperature should be 135°F (57°C). Let it rest for 5-10 minutes after cooking. The meat should be springy but not too firm when pressed.",
    keywords: ["steak", "doneness", "cooking", "temperature"]
  },
  {
    question: "What's the secret to crispy roast potatoes?",
    answer: "Par-boil potatoes first, shake them in the pan to rough up the edges, then roast in hot oil (190°C/375°F) that's been preheated in the oven. Turn occasionally and roast until golden and crispy, about 45-60 minutes.",
    keywords: ["potatoes", "roasting", "crispy", "cooking"]
  },
  {
    question: "How do I prevent my cookies from spreading too much?",
    answer: "Chill your cookie dough for at least 30 minutes before baking. Make sure your butter isn't too soft, use the right amount of flour, and don't overbeat the mixture. Also, use cool baking sheets between batches.",
    keywords: ["cookies", "baking", "spreading", "dough"]
  },
  {
    question: "how to play football?",
    answer: "just play with ball",
    keywords: ["play", "foot", "football", "playing"]
  },
  {
    question: "how to play footballl",
    answer: "just play with ball",
    keywords: ["play", "foot", "football", "playing", "footballl"]
  },
  {
    question: "football how to play?",
    answer: "just play with ball",
    keywords: ["play", "foot", "football", "playing", "how"]
  },
  {
    question: "if you know how to play football",
    answer: "just play with ball",
    keywords: ["play", "foot", "football", "playing", "know"]
  },
  {
    question: "playing",
    answer: "just play with ball",
    keywords: ["play", "playing", "football"]
  }
];

export const search = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    if (!args.searchTerm.trim()) return null;
    
    const results = await ctx.db
      .query("qaItems")
      .withSearchIndex("search", q => 
        q.search("question", args.searchTerm)
      )
      .take(1);
    
    return results[0] || null;
  },
});

export const adminLogin = mutation({
  args: {
    username: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.username !== ADMIN_USERNAME || args.password !== ADMIN_PASSWORD) {
      throw new Error("Invalid credentials");
    }

    // Set admin session
    const adminSession = await ctx.db.insert("adminSessions", {
      isValid: true,
      createdAt: Date.now(),
    });

    return adminSession;
  },
});

export const adminLogout = mutation({
  args: {},
  handler: async (ctx) => {
    const sessions = await ctx.db
      .query("adminSessions")
      .filter(q => q.eq(q.field("isValid"), true))
      .collect();
    
    // Invalidate all active sessions
    for (const session of sessions) {
      await ctx.db.patch(session._id, { isValid: false });
    }
  },
});

export const isAdmin = query({
  args: {},
  handler: async (ctx) => {
    const sessions = await ctx.db
      .query("adminSessions")
      .filter(q => q.eq(q.field("isValid"), true))
      .collect();
    
    return sessions.length > 0;
  },
});

export const addQuestion = mutation({
  args: {
    question: v.string(),
    answer: v.string(),
    keywords: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if admin
    const sessions = await ctx.db
      .query("adminSessions")
      .filter(q => q.eq(q.field("isValid"), true))
      .collect();
    
    if (sessions.length === 0) {
      throw new Error("Not authorized");
    }

    await ctx.db.insert("qaItems", {
      question: args.question,
      answer: args.answer,
      keywords: args.keywords,
    });
  },
});

// Add initial questions
export const addInitialQuestions = mutation({
  args: {},
  handler: async (ctx) => {
    for (const qa of EXAMPLE_QA) {
      await ctx.db.insert("qaItems", qa);
    }
  },
});
