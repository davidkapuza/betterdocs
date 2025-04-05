import { z } from "zod";
import { CollectionPageParamsSchema } from "./react-router.contracts";

export type CollectionPageParams = z.infer<typeof CollectionPageParamsSchema>;