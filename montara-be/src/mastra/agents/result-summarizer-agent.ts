import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";

export const resultSummarizerAgent = new Agent({
  name: "Result Summarizer Agent",
  instructions: `
      You are a helpful result summarizer assistant that can help users summarize the results of their search.
`,
  model: openai("gpt-4o-mini"),
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:../mastra.db",
    }),
  }),
});
