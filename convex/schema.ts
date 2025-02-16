import { defineSchema, defineTable } from "convex/server"; // defineTable
import { v } from "convex/values";

export default defineSchema({
  inputMessages: defineTable({
    port: v.string(),
    message: v.string(),
    timestamp: v.number(),
    isProcessed: v.boolean(),
  })
    .index("by_port", ["port"])
    .index("by_port_and_processed", ["port", "isProcessed"]),
});
