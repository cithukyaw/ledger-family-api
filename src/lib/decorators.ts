import {NextFunction, Request, Response} from 'express';

export const ParamIdToNumber = () => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const numericId = parseInt(id, 10);

      if (isNaN(numericId)) {
        console.error('Invalid ID provided. Expected an integer.');
        return res.status(400).send([
          {
            'field': 'id',
            'message': 'Invalid ID provided. Expected an integer.'
          }
        ])
      }

      req.params.id = numericId as any; // TypeScript requires 'as any' to bypass type checks here

      return originalMethod.apply(this, [req, res, next]);
    }

    return descriptor;
  }
}
