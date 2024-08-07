import {Response} from 'express';
import {ApiError} from "../types/declarations";
import {ZodError} from "zod";

export const apiValidationError = (res: Response, field: string, message: string): Response<ApiError> => {
  return res.status(400).json([
    { field, message }
  ])
};

export const apiZodError = (res: Response, errors: ZodError) => {
  const json: ApiError[] = [];
  errors.issues.map(err => json.push({
    field: err.path[0].toString(),
    message: `${err.path[0]}: ${err.message}`
  }));

  return res.status(400).json(json);
}
