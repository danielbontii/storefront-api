import supertest = require('supertest');

import { OrderStore } from '../../models/Order';
import { ProductStore } from '../../models/Product';
import { UserStore } from '../../models/User';
import { Order } from '../../types/order';
import app from '../../server';
import { TEST_USER_PASSWORD, API_BASE_URL } from '../../utils/constants';

const req = supertest(app);

describe('OrderStore should have ', () => {
  it('create method', () => {
    expect(OrderStore.create).toBeDefined();
  });
  it('currentOrdersByUser method', () => {
    expect(OrderStore.currentOrdersByUser).toBeDefined();
  });
  it('completedOrdersByUser method', () => {
    expect(OrderStore.completedOrdersByUser).toBeDefined();
  });
  it('completeUserOrder method', () => {
    expect(OrderStore.completeUserOrder).toBeDefined();
  });
});

describe('OrderStore should', () => {
  it('create order', async () => {
    const user = await UserStore.create({
      firstName: 'John',
      lastName: 'Doe',
      password: 'JohnDo$123'
    });
    const product = await ProductStore.create({
      name: 'Test Product',
      price: '10',
      category: 'Test'
    });

    const order = (await OrderStore.create({
      productId: product.id,
      quantity: 3,
      userId: user.id
    })) as Order;

    expect(order).toEqual({
      id: order.id,
      productId: order.productId,
      quantity: 3,
      cost: '30.00',
      status: order.status,
      userId: order.userId,
      createdAt: order.createdAt,
      completedAt: null
    });
  });

  it('should create multiple orders', async () => {
    const user = await UserStore.create({
      firstName: 'Logan',
      lastName: 'Lopez',
      password: '1og@nloG'
    });

    const product = await ProductStore.create({
      name: 'Test Product I',
      price: '10',
      category: 'Test I'
    });

    const orderOne = {
      productId: product.id,
      quantity: 4,
      userId: user.id
    };

    const orderTwo = {
      productId: product.id,
      quantity: 3,
      userId: user.id
    };

    const orders = (await OrderStore.create([orderOne, orderTwo])) as Order[];

    expect(orders).toEqual([orders[0], orders[1]]);
  });

  it('should complete order', async () => {
    const user = await UserStore.create({
      firstName: 'Daniel',
      lastName: 'Michealson',
      password: '1og@nloG'
    });
    const product = await ProductStore.create({
      name: 'Gorilla doll',
      price: '25.4',
      category: 'Boys'
    });
    const compOrder = (await OrderStore.create({
      productId: product.id,
      quantity: 3,
      userId: user.id
    })) as Order;

    const orderToComplete = {
      orderId: compOrder.id,
      productId: product.id,
      userId: user.id
    };
    const completedOrder = (await OrderStore.completeUserOrder(
      orderToComplete
    )) as Order;

    expect(completedOrder).toEqual({
      id: completedOrder.id,
      productId: completedOrder.productId,
      userId: completedOrder.userId,
      quantity: completedOrder.quantity,
      cost: completedOrder.cost,
      status: completedOrder.status,
      createdAt: completedOrder.createdAt,
      completedAt: completedOrder.completedAt
    });
  });

  it('should show active orders by user', async () => {
    const activeUser = await UserStore.create({
      firstName: 'John',
      lastName: 'Johnson',
      password: 'JohnDo$123'
    });

    const activeProduct = await ProductStore.create({
      name: 'Active Product',
      price: '200',
      category: 'General purpose'
    });

    const orderFour = {
      productId: activeProduct.id,
      quantity: 5,
      userId: activeUser.id
    };

    const activeOrder = (await OrderStore.create(orderFour)) as Order;

    expect(await OrderStore.currentOrdersByUser(activeUser.id)).toEqual([
      activeOrder
    ]);
  });

  it('should complete multiple orders', async () => {
    const multiProduct = await ProductStore.create({
      name: 'Multi Product',
      price: '100',
      category: 'Multi purpose'
    });

    const multiUser = await UserStore.create({
      firstName: 'Micheal',
      lastName: 'Smith',
      password: 'JohnDo$123'
    });

    const multiOrder = (await OrderStore.create({
      productId: multiProduct.id,
      quantity: 5,
      userId: multiUser.id
    })) as Order;

    const multiOrderTwo = (await OrderStore.create({
      productId: multiProduct.id,
      quantity: 5,
      userId: multiUser.id
    })) as Order;

    const completedOrders = (await OrderStore.completeUserOrder([
      {
        orderId: multiOrder.id,
        productId: multiProduct.id,
        userId: multiUser.id
      },
      {
        orderId: multiOrderTwo.id,
        productId: multiProduct.id,
        userId: multiUser.id
      }
    ])) as Order[];

    expect(completedOrders).toEqual([
      {
        id: completedOrders[0].id,
        productId: completedOrders[0].productId,
        userId: completedOrders[0].userId,
        quantity: completedOrders[0].quantity,
        cost: completedOrders[0].cost,
        status: completedOrders[0].status,
        createdAt: completedOrders[0].createdAt,
        completedAt: completedOrders[0].completedAt
      },
      {
        id: completedOrders[1].id,
        productId: completedOrders[1].productId,
        userId: completedOrders[1].userId,
        quantity: completedOrders[1].quantity,
        cost: completedOrders[1].cost,
        status: completedOrders[1].status,
        createdAt: completedOrders[1].createdAt,
        completedAt: completedOrders[1].completedAt
      }
    ]);
  });

  it('should show completed orders by user', async () => {
    const compProduct = await ProductStore.create({
      name: 'Dummy knife',
      price: '25.02',
      category: 'Gentlemen'
    });

    const compUser = await UserStore.create({
      firstName: 'Damien',
      lastName: 'Dark',
      password: '1og@nloG'
    });

    const compOrderFive = (await OrderStore.create({
      productId: compProduct.id,
      quantity: 7,
      userId: compUser.id
    })) as Order;

    const completedOrderFive = (await OrderStore.completeUserOrder({
      userId: compUser.id,
      productId: compProduct.id,
      orderId: compOrderFive.id
    })) as Order;

    const result = await OrderStore.completedOrdersByUser(compUser.id);

    expect(result).toEqual([completedOrderFive]);
  });
});

describe('order route should send status code', () => {
  it('200 if completed orders route is accessed', async () => {
    const user = await UserStore.create({
      firstName: 'George',
      lastName: 'Bush',
      password: TEST_USER_PASSWORD
    });
    const res = await req.get(`${API_BASE_URL}/orders/${user.id}/complete`);
    expect(res.statusCode).toBe(200);
  });
  it('200 if active orders route is accessed', async () => {
    const user = await UserStore.create({
      firstName: 'John',
      lastName: 'Bush',
      password: TEST_USER_PASSWORD
    });
    const res = await req.get(`${API_BASE_URL}/orders/${user.id}/active`);
    expect(res.statusCode).toBe(200);
  });
  it('201 if create order route is accessed', async () => {
    const user = await UserStore.create({
      firstName: 'John',
      lastName: 'Stone',
      password: TEST_USER_PASSWORD
    });

    const product = await ProductStore.create({
      name: 'Curtain',
      price: '7.99',
      category: 'Houses'
    });
    const res = await req.post(`${API_BASE_URL}/orders`).send({
      userId: user.id,
      productId: product.id,
      quantity: 5
    });
    expect(res.statusCode).toBe(201);
  });
  it('201 if create multiple orders route is accessed', async () => {
    const user = await UserStore.create({
      firstName: 'John',
      lastName: 'Washington',
      password: TEST_USER_PASSWORD
    });

    const product = await ProductStore.create({
      name: 'Leather wallet',
      price: '15.99',
      category: 'Wallets'
    });
    const res = await req.post(`${API_BASE_URL}/orders`).send([
      {
        userId: user.id,
        productId: product.id,
        quantity: 5
      },
      {
        userId: user.id,
        productId: product.id,
        quantity: 12
      }
    ]);
    expect(res.statusCode).toBe(201);
  });
  it('200 if complete order route is accessed', async () => {
    const user = await UserStore.create({
      firstName: 'John',
      lastName: 'Washington',
      password: TEST_USER_PASSWORD
    });

    const product = await ProductStore.create({
      name: 'Leather Purse',
      price: '13.99',
      category: 'Purses'
    });

    const order = (await OrderStore.create({
      productId: product.id,
      quantity: 3,
      userId: user.id
    })) as Order;
    const res = await req.post(`${API_BASE_URL}/orders/complete-order`).send({
      userId: user.id,
      productId: product.id,
      orderId: order.id
    });
    expect(res.statusCode).toBe(200);
  });
  it('200 if complete multiple orders route is accessed', async () => {
    const user = await UserStore.create({
      firstName: 'John',
      lastName: 'Doe',
      password: TEST_USER_PASSWORD
    });

    const product = await ProductStore.create({
      name: 'Leather Hat',
      price: '13.99',
      category: 'Hats'
    });

    const productTwo = await ProductStore.create({
      name: 'Wooden Carpet',
      price: '103.99',
      category: 'carperts'
    });

    const order = (await OrderStore.create({
      productId: product.id,
      quantity: 3,
      userId: user.id
    })) as Order;

    const orderTwo = (await OrderStore.create({
      productId: productTwo.id,
      quantity: 15,
      userId: user.id
    })) as Order;

    const res = await req.post(`${API_BASE_URL}/orders/complete-order`).send([
      {
        userId: user.id,
        productId: product.id,
        orderId: order.id
      },
      {
        userId: user.id,
        productId: productTwo.id,
        orderId: orderTwo.id
      }
    ]);
    expect(res.statusCode).toBe(200);
  });
});
