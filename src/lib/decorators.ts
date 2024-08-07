import {NextFunction, Request, Response} from 'express';
import {apiValidationError} from "./api";

export const ParamIdToNumber = () => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const numericId = parseInt(id, 10);

      if (isNaN(numericId)) {
        return apiValidationError(res, 'id', 'Invalid ID provided. Expected an integer.');
      }

      req.params.id = numericId as any; // TypeScript requires 'as any' to bypass type checks here

      return originalMethod.apply(this, [req, res, next]);
    }

    return descriptor;
  }
}
