import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const sendMessage = mutation({
  args: {
    port: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("inputMessages", {
      port: args.port,
      message: args.message,
      timestamp: Date.now(),
      isProcessed: false,
    });
    return messageId;
  },
});

export const markMessageProcessed = mutation({
  args: {
    messageId: v.id("inputMessages"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, {
      isProcessed: true,
    });
  },
});
