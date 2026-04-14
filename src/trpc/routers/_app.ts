import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { WorkflowsRoute } from './workflows';

export const appRouter = createTRPCRouter({
  workflows:WorkflowsRoute
});

// export type definition of API
export type AppRouter = typeof appRouter;