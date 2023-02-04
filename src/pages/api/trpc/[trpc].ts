import * as trpcNext from "@trpc/server/adapters/next";

import { createContext } from "../../../server/context";
import { appRouter } from "../../../server/routers/_app";
import { withSessionRoute } from "../../../utils/auth";

export const config = {
  api: {
    externalResolver: true,
  },
  runtime: "edge",
  regions: ["iad1"],
};
// export API handler
export default withSessionRoute(
  trpcNext.createNextApiHandler({
    router: appRouter,
    createContext,
  }),
);
