import {NextFunction, Request, Response} from 'express';
import {apiValidationError} from "./api";

/**
 * Change a type of id field in URL parameters from string to number
 */
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

/**
 * Change a type of the field value in query string from string to number
 */
export const QueryStrToNumber = (field: string) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = (req: Request, res: Response, next: NextFunction) => {
      const id = req.query[field] as string
      const numericId = parseInt(id, 10);

      if (isNaN(numericId)) {
        return apiValidationError(res, 'id', 'Invalid userId provided. Expected an integer.');
      }

      req.query[field] = numericId as any; // TypeScript requires 'as any' to bypass type checks here

      return originalMethod.apply(this, [req, res, next]);
    }

    return descriptor;
  }
}

/**
 * Change a type of the field value in query string from comma-separated string to array of numbers
 */
export const QueryStrToNumArray = (field: string) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = (req: Request, res: Response, next: NextFunction) => {
      let numArr: number[] = [];
      const csv = req.query[field] as string
      if (csv) {
        const strArr: string[] = csv.split(',');
        numArr = strArr.map(val => parseInt(val, 10));
      }

      req.query[field] = numArr as any; // TypeScript requires 'as any' to bypass type checks here

      return originalMethod.apply(this, [req, res, next]);
    }

    return descriptor;
  }
}
