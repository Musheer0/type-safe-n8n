import { NodeType } from "@/generated/prisma/enums";
import { z } from "zod";

const NodeDataSchema = z.object({
  node_name: z.string(),
  user_data:z.object().default({})
}).passthrough(); 
// passthrough = "allow extra fields without crying"

export const ExtractedNodeSchema = z.object({
  id: z.string(),
  xCord: z.number(),
  yCord: z.number(),
  data: z.any(),
  name: z.string(),
  type:z.enum(NodeType)
});

export const ExtractedNodesArraySchema = z.array(ExtractedNodeSchema);
export const ExtractedEdgeSchema = z.object({
  id: z.string(),
  fromNode: z.string(),
  nextNode: z.string(),
});

export const ExtractedEdgesArraySchema = z.array(ExtractedEdgeSchema);