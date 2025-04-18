import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  qaItems: defineTable({
    question: v.string(),
    answer: v.string(),
    keywords: v.array(v.string()),
  }).searchIndex("search", {
    searchField: "question",
    filterFields: ["keywords"],
  }),
  adminSessions: defineTable({
    isValid: v.boolean(),
    createdAt: v.number(),
  }),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
