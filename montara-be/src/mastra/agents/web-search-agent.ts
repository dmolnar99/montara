import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";

export const webSearchAgent = new Agent({
  name: "Web Search Agent",
  instructions: `
      You are a helpful web search assistant that can help users search the web for information.
      Given a query, search the web with your built-in web search tool for the most relevant information and return the results.
`,
  model: openai("gpt-4o-mini"),
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:../mastra.db",
    }),
  }),
});
