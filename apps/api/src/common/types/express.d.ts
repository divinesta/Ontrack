export interface ValidatedData<TBody = unknown, TQuery = unknown, TParams = unknown> {
   body: TBody;
   query: TQuery;
   params: TParams;
}

declare global {
   namespace Express {
      interface Request {
         id: string;
         rawBody?: Buffer;
         wideEvent: Record<string, unknown>;
         validated: ValidatedData;
         user?: {
            id: string;
            role?: string;
         };
      }
   }
}

export {};
