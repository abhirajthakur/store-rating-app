import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

type RequestPart = "body" | "query" | "params";

export const validate = (schema: ZodType, part: RequestPart = "body") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[part]);

    if (!result.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: result.error.issues,
      });
    }

    const parsed = result.data;

    if (part !== "body") {
      Object.defineProperty(req, part, {
        value: parsed,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    } else {
      req.body = parsed;
    }

    next();
  };
};
