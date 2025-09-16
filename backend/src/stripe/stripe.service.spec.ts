import { Test, TestingModule } from '@nestjs/testing';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';

jest.mock('stripe');

describe('StripeService', () => {
  let service: StripeService;
  let stripeMock: jest.Mocked<Stripe>;

  beforeEach(async () => {
   
    stripeMock = {
      products: {
        list: jest.fn().mockResolvedValue({ data: [{ id: 'prod_123', name: 'Test Product' }] }),
        create: jest.fn().mockResolvedValue({ id: 'prod_456', name: 'New Product' }),
      },
      customers: {
        list: jest.fn().mockResolvedValue({ data: [{ id: 'cus_123', email: 'test@example.com' }] }),
        create: jest.fn().mockResolvedValue({ id: 'cus_456', email: 'new@example.com' }),
      },
      prices: {
        create: jest.fn().mockResolvedValue({ id: 'price_123' }),
      },
      paymentIntents: {
        create: jest.fn().mockResolvedValue({ id: 'pi_123', amount: 1000 }),
      },
      subscriptions: {
        create: jest.fn().mockResolvedValue({ id: 'sub_123', status: 'active' }),
      },
      refunds: {
        create: jest.fn().mockResolvedValue({ id: 're_123', status: 'succeeded' }),
      },
      paymentMethods: {
        attach: jest.fn().mockResolvedValue({ id: 'pm_123' }),
      },
      balance: {
        retrieve: jest.fn().mockResolvedValue({ available: [{ amount: 5000 }] }),
      },
      paymentLinks: {
        create: jest.fn().mockResolvedValue({ id: 'plink_123', url: 'https://test-link' }),
      },
    } as any;

    (Stripe as unknown as jest.Mock).mockImplementation(() => stripeMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StripeService,
        { provide: 'STRIPE_API_KEY', useValue: 'sk_test_dummy_key' },
      ],
    }).compile();

    service = module.get<StripeService>(StripeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch products', async () => {
    const products = await service.getProducts();
    expect(products).toEqual([{ id: 'prod_123', name: 'Test Product' }]);
    expect(stripeMock.products.list).toHaveBeenCalled();
  });

  it('should fetch customers', async () => {
    const customers = await service.getCustomers();
    expect(customers).toEqual([{ id: 'cus_123', email: 'test@example.com' }]);
    expect(stripeMock.customers.list).toHaveBeenCalled();
  });

  it('should create product with price', async () => {
    const dto = { name: 'New Product', description: 'Test Desc', price: 50 };
    const product = await service.createProduct(dto);
    expect(product).toEqual({ id: 'prod_456', name: 'New Product' });
    expect(stripeMock.products.create).toHaveBeenCalledWith({
      name: 'New Product',
      description: 'Test Desc',
    });
    expect(stripeMock.prices.create).toHaveBeenCalledWith({
      product: 'prod_456',
      unit_amount: 5000,
      currency: 'usd',
    });
  });

  it('should create customer', async () => {
    const dto = { email: 'new@example.com', name: 'John Doe' };
    const customer = await service.createCustomer(dto);
    expect(customer).toEqual({ id: 'cus_456', email: 'new@example.com' });
    expect(stripeMock.customers.create).toHaveBeenCalledWith({
      email: 'new@example.com',
      name: 'John Doe',
    });
  });

  it('should create payment intent', async () => {
    const dto = { amount: 1000, currency: 'usd' };
    const pi = await service.createPaymentIntent(dto);
    expect(pi).toEqual({ id: 'pi_123', amount: 1000 });
    expect(stripeMock.paymentIntents.create).toHaveBeenCalledWith(dto);
  });

  it('should create subscription', async () => {
    const dto = { customerId: 'cus_123', priceId: 'price_123' };
    const sub = await service.createSubscription(dto);
    expect(sub).toEqual({ id: 'sub_123', status: 'active' });
    expect(stripeMock.subscriptions.create).toHaveBeenCalledWith({
      customer: 'cus_123',
      items: [{ price: 'price_123' }],
    });
  });

  it('should refund payment', async () => {
    const refund = await service.refundPayment('pi_123');
    expect(refund).toEqual({ id: 're_123', status: 'succeeded' });
    expect(stripeMock.refunds.create).toHaveBeenCalledWith({
      payment_intent: 'pi_123',
    });
  });

  it('should attach payment method', async () => {
    await service.attachPaymentMethod('cus_123', 'pm_123');
    expect(stripeMock.paymentMethods.attach).toHaveBeenCalledWith('pm_123', {
      customer: 'cus_123',
    });
  });

  it('should get balance', async () => {
    const balance = await service.getBalance();
    expect(balance).toEqual({ available: [{ amount: 5000 }] });
    expect(stripeMock.balance.retrieve).toHaveBeenCalled();
  });

  it('should create payment link', async () => {
    const dto = { priceId: 'price_123' };
    const link = await service.createPaymentLink(dto);
    expect(link).toEqual({ id: 'plink_123', url: 'https://test-link' });
    expect(stripeMock.paymentLinks.create).toHaveBeenCalledWith({
      line_items: [{ price: 'price_123', quantity: 1 }],
    });
  });
});
