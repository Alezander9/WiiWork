import { query } from "./_generated/server";
import { v } from "convex/values";

export const getUnprocessedMessages = query({
  args: {
    port: v.string(),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("inputMessages")
      .withIndex("by_port_and_processed", (q) =>
        q.eq("port", args.port).eq("isProcessed", false)
      )
      .order("desc")
      .collect();

    return messages;
  },
});
