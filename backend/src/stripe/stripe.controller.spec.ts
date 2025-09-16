// stripe.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';

describe('StripeController', () => {
  let controller: StripeController;
  let service: StripeService;

  const mockStripeService = {
    getProducts: jest.fn(),
    getCustomers: jest.fn(),
    createPaymentIntent: jest.fn(),
    createSubscription: jest.fn(),
    createCustomer: jest.fn(),
    createProduct: jest.fn(),
    createPaymentLink: jest.fn(),
    getBalance: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StripeController],
      providers: [{ provide: StripeService, useValue: mockStripeService }],
    }).compile();

    controller = module.get<StripeController>(StripeController);
    service = module.get<StripeService>(StripeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProducts', () => {
    it('should return products from service', async () => {
      const products = [{ id: 'prod_123' }];
      mockStripeService.getProducts.mockResolvedValue(products);

      const result = await controller.getProducts();
      expect(service.getProducts).toHaveBeenCalled();
      expect(result).toEqual(products);
    });
  });

  describe('getCustomers', () => {
    it('should return customers from service', async () => {
      const customers = [{ id: 'cus_123' }];
      mockStripeService.getCustomers.mockResolvedValue(customers);

      const result = await controller.getCustomers();
      expect(service.getCustomers).toHaveBeenCalled();
      expect(result).toEqual(customers);
    });
  });

  describe('createPaymentIntent', () => {
    it('should call service with dto', async () => {
      const dto = { amount: 5000, currency: 'usd' };
      const response = { client_secret: 'secret_123' };
      mockStripeService.createPaymentIntent.mockResolvedValue(response);

      const result = await controller.createPaymentIntent(dto);
      expect(service.createPaymentIntent).toHaveBeenCalledWith(dto);
      expect(result).toEqual(response);
    });
  });

  describe('createSubscription', () => {
    it('should call service with dto', async () => {
      const dto = { customerId: 'cus_123', priceId: 'price_abc' };
      const response = { subscriptionId: 'sub_123' };
      mockStripeService.createSubscription.mockResolvedValue(response);

      const result = await controller.createSubscription(dto);
      expect(service.createSubscription).toHaveBeenCalledWith(dto);
      expect(result).toEqual(response);
    });
  });

  describe('createCustomer', () => {
    it('should call service with dto', async () => {
      const dto = { email: 'test@example.com' };
      const response = { id: 'cus_123' };
      mockStripeService.createCustomer.mockResolvedValue(response);

      const result = await controller.createCustomer(dto);
      expect(service.createCustomer).toHaveBeenCalledWith(dto);
      expect(result).toEqual(response);
    });
  });

  describe('createProduct', () => {
    it('should call service with dto', async () => {
      const dto = { name: 'Test Product', price: 1000 };
      const response = { id: 'prod_123' };
      mockStripeService.createProduct.mockResolvedValue(response);

      const result = await controller.createProduct(dto);
      expect(service.createProduct).toHaveBeenCalledWith(dto);
      expect(result).toEqual(response);
    });
  });

  describe('createPaymentLink', () => {
    it('should call service with dto', async () => {
      const dto = { priceId: 'price_123' };
      const response = { url: 'https://stripe.com/pay/xyz' };
      mockStripeService.createPaymentLink.mockResolvedValue(response);

      const result = await controller.createPaymentLink(dto);
      expect(service.createPaymentLink).toHaveBeenCalledWith(dto);
      expect(result).toEqual(response);
    });
  });

  describe('getBalance', () => {
    it('should return balance from service', async () => {
      const balance = { available: [{ amount: 10000, currency: 'usd' }] };
      mockStripeService.getBalance.mockResolvedValue(balance);

      const result = await controller.getBalance();
      expect(service.getBalance).toHaveBeenCalled();
      expect(result).toEqual(balance);
    });
  });
});
