import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { Firecrawl } from "@mendable/firecrawl-js";

const firecrawl = new Firecrawl();

const websiteScrapeTool = createTool({
  id: "website-scrape",
  description: "Scrape a website and return the content",
  inputSchema: z.object({
    url: z.string().url(),
  }),
  outputSchema: z.object({
    content: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const { url } = context;
    const scrapeResult = await firecrawl.scrape(url, {
      formats: ["markdown", "html"],
      proxy: "stealth",
    });
    return { content: scrapeResult.html };
  },
});

export default websiteScrapeTool;
