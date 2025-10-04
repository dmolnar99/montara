import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { Firecrawl } from "@mendable/firecrawl-js";

const firecrawl = new Firecrawl();

const documentMetadataSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    language: z.string().optional(),
    keywords: z.union([z.string(), z.array(z.string())]).optional(),
    robots: z.string().optional(),
    ogTitle: z.string().optional(),
    ogDescription: z.string().optional(),
    ogUrl: z.string().optional(),
    ogImage: z.string().optional(),
    sourceURL: z.string().optional(),
    statusCode: z.number().optional(),
    error: z.string().optional(),
  })
  .passthrough();

const websiteScrapeTool = createTool({
  id: "website-scrape",
  description: "Scrape a website and return the content",
  inputSchema: z.object({
    url: z.string().url(),
  }),
  outputSchema: z.object({
    summary: z.string().optional().describe("Summary of the page"),
    html: z.string().optional().describe("HTML version of the content on page"),
    rawHtml: z.string().optional().describe("Raw HTML content of the page"),
    markdown: z.string().optional(),
    images: z.array(z.string()).optional(),
    links: z.array(z.string()).optional().describe("List of links on the page"),
    metadata: documentMetadataSchema
      .optional()
      .describe("Metadata of the page"),
  }),
  execute: async ({ context }) => {
    const { url } = context;
    const scrapeResult = await firecrawl.scrape(url, {
      formats: ["markdown", "html", "summary", "rawHtml", "links"],
      proxy: "stealth",
    });

    return {
      summary: scrapeResult.summary,
      html: scrapeResult.html,
      rawHtml: scrapeResult.rawHtml,
      markdown: scrapeResult.markdown,
      images: scrapeResult.images,
      links: scrapeResult.links,
      metadata: scrapeResult.metadata,
    };
  },
});

export default websiteScrapeTool;
