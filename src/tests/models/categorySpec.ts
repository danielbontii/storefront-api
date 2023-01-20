import supertest = require('supertest');

import { ValidationError } from 'joi';

import { CategoryStore } from '../../models/Category';
import app from '../../server';
import { getCategoryError } from '../../utils/get-errors';
import { CustomError } from '../../errors';
import { API_BASE_URL } from '../../utils/constants';

const req = supertest(app);

describe('Category store', () => {
  it('should contain an index method', () => {
    expect(CategoryStore.index).toBeDefined();
  });
  it('should contain a create method', () => {
    expect(CategoryStore.create).toBeDefined();
  });
});

describe('Category store index method', () => {
  it('should be empty to start with', async () => {
    expect(await CategoryStore.index()).toEqual([]);
  });
  it('should contain a all categories', async () => {
    const category = await CategoryStore.create('Fashion');
    expect(await CategoryStore.index()).toEqual([
      {
        id: category.id,
        name: 'Fashion'
      }
    ]);
  });
});

describe('Category store create method', () => {
  it('should create category given a valid name', async () => {
    const category = await CategoryStore.create('Electronics');
    expect(category).toEqual({
      id: category.id,
      name: 'Electronics'
    });
  });
  it('should throw ValidationError given an invalid name', async () => {
    const customError = await getCategoryError(
      CategoryStore.create,
      'Electronics@'
    );
    expect(customError).toBeInstanceOf(ValidationError);
  });
  it('should throw CustomError category exists', async () => {
    await CategoryStore.create('Robots');
    const conflictError = await getCategoryError(
      CategoryStore.create,
      'Robots'
    );
    expect(conflictError).toEqual(
      new CustomError(`Category 'Robots' already exists`, 409)
    );
  });
});

describe('Create category route should send status code', () => {
  it('201 if category created', async () => {
    const res = await req
      .post(`${API_BASE_URL}/categories`)
      .send({ name: 'Fresh' });
    expect(res.statusCode).toBe(201);
  });
  it('200 when all categories routes is accessed', async () => {
    const res = await req.get(`${API_BASE_URL}/categories`);
    expect(res.statusCode).toBe(200);
  });
  it('409 when category alreay exists', async () => {
    await req.post(`${API_BASE_URL}/categories`).send({ name: 'Family' });
    const conflictingRes = await req
      .post(`${API_BASE_URL}/categories`)
      .send({ name: 'family' });
    expect(conflictingRes.statusCode).toBe(409);
  });
});
