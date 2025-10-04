import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import { webSearchAgent } from "../agents/web-search-agent";
import websiteScrapeTool from "../tools/website-scrape-tool";
import { resultSummarizerAgent } from "../agents/result-summarizer-agent";

const webSearchResultsSchema = z.object({
  url: z.string().url().describe("Relevant website URL for ski accommodations"),
});

const webSearchStep = createStep({
  id: "web-search",
  description: "Searches the web with the given query",
  inputSchema: z.object({
    region: z.string().describe("The region to scout ski accommodations for"),
    month: z.string().describe("The month to scout ski accommodations for"),
  }),
  outputSchema: webSearchResultsSchema,
  execute: async ({ inputData }) => {
    const { region, month } = inputData;
    const query = `Find ski accommodations in ${region} for the month of ${month}. Return a single relevant website URL to do further research on.`;
    const results = await webSearchAgent.generate(
      [{ role: "user", content: query }],
      {
        structuredOutput: {
          schema: webSearchResultsSchema,
        },
        providerOptions: {
          openai: {
            webSearch: true,
          },
        },
      }
    );
    return results.object;
  },
});

const scoutWorkflow = createWorkflow({
  id: "scout-workflow",
  inputSchema: z.object({
    region: z.string().describe("The region to scout ski accommodations for"),
    month: z.string().describe("The month to scout ski accommodations for"),
  }),
  outputSchema: z.object({
    recommendations: z.string(),
  }),
})
  .then(webSearchStep)
  .then(createStep(websiteScrapeTool))
  .map(
    async ({ inputData }) => {
      const { rawHtml, markdown, summary, links } = inputData;
      return {
        prompt: `Summarize the following website content according to its relevance to finding ski accommodations. 
        Raw HTML: ${rawHtml}
        Markdown: ${markdown}
        Summary: ${summary}
        Links: ${links}`,
      };
    },
    { id: "map-step" }
  )
  .then(createStep(resultSummarizerAgent));

scoutWorkflow.commit();

export { scoutWorkflow };
