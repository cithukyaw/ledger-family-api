import {Response} from 'express';
import {ApiError} from "../types/declarations";
import {ZodError} from "zod";

export const apiValidationError = (
  res: Response, field: ZodError | string,
  message: string = '',
  code: number = 400
): Response<ApiError> => {
  const json: ApiError[] = [];

  if (field instanceof ZodError) {
    field.issues.map(err => json.push({
      field: err.path[0].toString(),
      message: `The ${err.path[0]} field: ${err.message}`
    }));
  } else {
    json.push({ field, message });
  }

  return res.status(code).json(json);
};
