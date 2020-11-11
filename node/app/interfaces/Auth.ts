import { NextFunction, Request, Response } from "express";
import { IUserDoc } from "./IModelUser";

export type AuthPayload = { [key: string]: any } & {
  data: {
    id: string;
    username: string;
  };
};

export type AuthedRequestStrict = Request & {
  auth: {
    isAuthed: true;
    user: IUserDoc;
  };
};

export type AuthedRequest =
  | AuthedRequestStrict
  | (Request & {
      auth: {
        isAuthed: false;
        user: null;
      };
    });

export type AuthedRequestHandler = (
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) => any | Promise<any>;

export type AuthedRequestHandlerStrict = (
  req: AuthedRequestStrict,
  res: Response,
  next: NextFunction,
) => any | Promise<any>;
