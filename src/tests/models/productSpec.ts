import supertest = require('supertest');

import { CategoryStore } from '../../models/Category';
import { ProductStore } from '../../models/Product';
import { truncateTable } from '../../utils/dbUtils';
import app from '../../server';
import { AuthService } from '../../services/Auth';

const req = supertest(app);
const { ADMIN_PASSWORD } = process.env;
const token = AuthService.generateToken(ADMIN_PASSWORD as string);

describe('Product Store should have', () => {
  it('an index method', () => {
    expect(ProductStore.index).toBeDefined();
  });

  it('a show method', () => {
    expect(ProductStore.show).toBeDefined();
  });

  it('a create method', () => {
    expect(ProductStore.create).toBeDefined();
  });

  it('a productsByCategory method', () => {
    expect(ProductStore.productsByCategory).toBeDefined();
  });
});

describe('Product Store ', () => {
  it('should create product', async () => {
    const category = await CategoryStore.create('Ladies Wear');

    const product = await ProductStore.create({
      name: 'Test Product',
      price: '2.99',
      category: category.name
    });

    expect(product).toEqual({
      id: product.id,
      name: 'Test Product',
      price: '2.99',
      categoryId: +category.id,
      category: category.name
    });
  });

  it('should show requested product', async () => {
    const category = await CategoryStore.create('Male Toys');

    const product = await ProductStore.create({
      name: 'Tony Stark',
      price: '6.03',
      category: category.name
    });

    expect(await ProductStore.show(product.id)).toEqual({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      categoryId: product.categoryId
    });
  });

  it('should show products by category', async () => {
    const categoryOne = await CategoryStore.create('Female Toys');

    const productTwo = await ProductStore.create({
      name: 'Test Product two',
      price: '4.99',
      category: categoryOne.name
    });

    const productThree = await ProductStore.create({
      name: 'Test Product Three',
      price: '46.43',
      category: categoryOne.name
    });

    expect(await ProductStore.productsByCategory(categoryOne.name)).toEqual([
      {
        id: productTwo.id,
        name: productTwo.name,
        price: productTwo.price,
        category: productTwo.category,
        categoryId: productTwo.categoryId
      },
      {
        id: productThree.id,
        name: productThree.name,
        price: productThree.price,
        category: productThree.category,
        categoryId: productThree.categoryId
      }
    ]);
  });

  it('should show all products', async () => {
    await truncateTable('products');

    //For some weird reason I don't know
    //it doesn't come back in the order of insersion
    const categoryOne = await CategoryStore.create('Dolls');

    const categoryTwo = await CategoryStore.create("Men's underwear");

    const testProduct = await ProductStore.create({
      name: 'Test Product',
      price: '7',
      category: categoryOne.name
    });

    const testProductTwo = await ProductStore.create({
      name: 'Test Product Two',
      price: '7.36',
      category: categoryTwo.name
    });

    const testProductThree = await ProductStore.create({
      name: 'Test Product Three',
      price: '7.36',
      category: categoryOne.name
    });

    const testProductFour = await ProductStore.create({
      name: 'Test Product Four',
      price: '7.36',
      category: categoryTwo.name
    });

    expect(await ProductStore.index()).toEqual([
      {
        id: testProductThree.id,
        name: testProductThree.name,
        price: testProductThree.price,
        category: testProductThree.category,
        categoryId: testProductThree.categoryId
      },
      {
        id: testProduct.id,
        name: testProduct.name,
        price: testProduct.price,
        category: testProduct.category,
        categoryId: testProduct.categoryId
      },
      {
        id: testProductFour.id,
        name: testProductFour.name,
        price: testProductFour.price,
        category: testProductFour.category,
        categoryId: testProductFour.categoryId
      },
      {
        id: testProductTwo.id,
        name: testProductTwo.name,
        price: testProductTwo.price,
        category: testProductTwo.category,
        categoryId: testProductTwo.categoryId
      }
    ]);
  });
});

describe('products route should send status code', () => {
  it('200 if all products route is accessed', async () => {
    const res = await req.get('/products');
    expect(res.statusCode).toBe(200);
  });

  it('200 if single product route is accessed', async () => {
    const product = await ProductStore.create({
      name: 'Massage chair',
      price: '199.99',
      category: 'Luxury'
    });
    const res = await req.get(`/products/${product.id}`);
    expect(res.statusCode).toBe(200);
  });

  it('200 if products by category route is accessed', async () => {
    const category = await CategoryStore.create('Freezers');
    const res = await req.get(`/products/categories/${category.name}`);
    expect(res.statusCode).toBe(200);
  });

  it('201 if product is created', async () => {
    const res = await req
      .post('/products')
      .set({ authorization: `Bearer ${token}` })
      .send({
        name: 'Curly hair',
        price: '45.99',
        category: 'Fashion'
      });
    expect(res.statusCode).toBe(201);
  });
});
