import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { DecodedIdToken } from "firebase-admin/auth";
import { auth } from "./app";

export type HandlerWithAuth = (
  req: NextApiRequest,
  res: NextApiResponse,
  auth: DecodedIdToken
) => Promise<void | NextApiResponse>;

export type WithAuthMiddleware = (handler: HandlerWithAuth) => NextApiHandler;

/**
 * Check if the current request have valid authorization header and calls the given handler
 * @param handler callback handler that will be called affter user authenticated successfully
 * @returns Next.js api handler
 */
const withAuthMiddleware: WithAuthMiddleware =
  (handler) => async (req, res) => {
    // check if authorization header exists
    if (!req.headers.authorization) {
      return res.status(401).send("Authentication Falied");
    }
    try {
      // verify authorization header and get associated user
      const user = await auth.verifyIdToken(req.headers.authorization);

      // call next handler and pass authenticated user
      return handler(req, res, user);
    } catch {
      return res.status(401).send("Authentication Falied");
    }
  };

export { withAuthMiddleware };
export default withAuthMiddleware;
