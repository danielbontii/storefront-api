import { Application, Request, Response, NextFunction } from 'express';

import { StatusCodes } from 'http-status-codes';

import { ProductStore } from '../models/Product';
import { Product } from '../types/product';
import { AuthService } from '../services/Auth';
import { API_BASE_URL } from '../utils/constants';

const index = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<Product[] | void> => {
  try {
    const products = await ProductStore.index();
    res.status(StatusCodes.OK).json(products);
  } catch (error) {
    next(error);
  }
};

const show = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Product | void> => {
  try {
    const product = await ProductStore.show(req.params.id);
    res.status(StatusCodes.OK).json(product);
  } catch (error) {
    next(error);
  }
};

const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Product | void> => {
  try {
    const product = await ProductStore.create(req.body);
    res.status(StatusCodes.CREATED).json(product);
  } catch (error) {
    next(error);
  }
};

const productsByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Product | void> => {
  try {
    const products = await ProductStore.productsByCategory(req.params.category);
    res.status(StatusCodes.OK).json(products);
  } catch (error) {
    next(error);
  }
};

const productRoutes = (app: Application) => {
  app
    .route(`${API_BASE_URL}/products`)
    .get(index)
    .post(AuthService.authenticate, create);
  app.route(`${API_BASE_URL}/products/:id`).get(show);
  app
    .route(`${API_BASE_URL}/products/categories/:category`)
    .get(productsByCategory);
};

export default productRoutes;
