import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const notFoundMiddleWare = (_req: Request, res: Response) => {
  return res.status(StatusCodes.NOT_FOUND).json({
    status: 'Not Found',
    details: [{ message: 'Route does not exist' }]
  });
};

export default notFoundMiddleWare;
