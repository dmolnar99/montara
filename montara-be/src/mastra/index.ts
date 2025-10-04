import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { LibSQLStore } from "@mastra/libsql";
import { weatherWorkflow } from "./workflows/weather-workflow";
import { weatherAgent } from "./agents/weather-agent";
import { scoutWorkflow } from "./workflows/scout-workflow";
import { webSearchAgent } from "./agents/web-search-agent";
import { resultSummarizerAgent } from "./agents/result-summarizer-agent";
import { MastraJwtAuth } from "@mastra/auth";

export const mastra = new Mastra({
  workflows: { weatherWorkflow, scoutWorkflow },
  agents: { weatherAgent, webSearchAgent, resultSummarizerAgent },
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
  server: {
    experimental_auth: new MastraJwtAuth({
      secret: process.env.MASTRA_JWT_SECRET,
    }),
  },
});
