import { Inject, Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { StripeErrors } from './constants/stripe.errors';
import { StripeMessages } from './constants/stripe.messages';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private readonly logger = new Logger(StripeService.name);

  constructor(
    @Inject('STRIPE_API_KEY')
    private readonly apiKey: string,
  ) {
    this.stripe = new Stripe(this.apiKey);
  }

  // Get Products
  async getProducts(): Promise<Stripe.Product[]> {
    try {
      const products = await this.stripe.products.list();
      this.logger.log(StripeMessages.PRODUCTS_FETCH_SUCCESS);
      return products.data;
    } catch (error) {
      this.logger.error(StripeErrors.PRODUCTS_FETCH_FAILED, error.stack);
      throw new Error(StripeErrors.PRODUCTS_FETCH_FAILED);
    }
  }

  // Get Customers
  async getCustomers(): Promise<Stripe.Customer[]> {
    try {
      const customers = await this.stripe.customers.list({});
      this.logger.log(StripeMessages.CUSTOMERS_FETCH_SUCCESS);
      return customers.data;
    } catch (error) {
      this.logger.error(StripeErrors.CUSTOMERS_FETCH_FAILED, error.stack);
      throw new Error(StripeErrors.CUSTOMERS_FETCH_FAILED);
    }
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
  ): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency,
      });
      this.logger.log(
        `PaymentIntent created successfully with amount: ${amount} ${currency}`,
      );
      return paymentIntent;
    } catch (error) {
      this.logger.error(StripeErrors.PAYMENT_INTENT_FAILED, error.stack);
      throw new Error(StripeErrors.PAYMENT_INTENT_FAILED);
    }
  }

  // Subscriptions (Create Subscription)
  async createSubscription(
    customerId: string,
    priceId: string,
  ): Promise<Stripe.Subscription> {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
      });
      this.logger.log(
        StripeMessages.SUBSCRIPTION_SUCCESS,
      );
      return subscription;
    } catch (error) {
      this.logger.error(StripeErrors.SUBSCRIPTION_FAILED, error.stack);
      throw new Error(StripeErrors.SUBSCRIPTION_FAILED);
    }
  }

  async createCustomer(email: string, name: string): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe.customers.create({ email, name });
      this.logger.log(`${StripeMessages.CUSTOMER_CREATE_SUCCESS} for ${email}`);
      return customer;
    } catch (error) {
      this.logger.error(StripeErrors.CUSTOMER_CREATE_FAILED, error.stack);
      throw new Error(StripeErrors.CUSTOMER_CREATE_FAILED);
    }
  }

  // Product & Pricing Management (Create Product with Price)
  async createProduct(
    name: string,
    description: string,
    price: number,
  ): Promise<Stripe.Product> {
    try {
      const product = await this.stripe.products.create({ name, description });
      await this.stripe.prices.create({
        product: product.id,
        unit_amount: price * 100, // amount in cents
        currency: 'usd',
      });
      this.logger.log(`${StripeMessages.PAYMENT_LINK_SUCCESS}: ${name}`);
      return product;
    } catch (error) {
      this.logger.error(StripeErrors.PRODUCT_CREATE_FAILED, error.stack);
      throw new Error(StripeErrors.PRODUCT_CREATE_FAILED);
    }
  }

  async refundPayment(paymentIntentId: string): Promise<Stripe.Refund> {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
      });
      this.logger.log(
        `Refund processed successfully for PaymentIntent: ${paymentIntentId}`,
      );
      return refund;
    } catch (error) {
      this.logger.error(StripeErrors.REFUND_FAILED, error.stack);
      throw new Error(StripeErrors.REFUND_FAILED);
    }
  }

  // Payment Method Integration (Attach Payment Method)
  async attachPaymentMethod(
    customerId: string,
    paymentMethodId: string,
  ): Promise<void> {
    try {
      await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });
      this.logger.log(
        `Payment method ${paymentMethodId} attached to customer ${customerId}`,
      );
    } catch (error) {
      this.logger.error(StripeErrors.ATTACH_PAYMENT_METHOD_FAILED, error.stack);
      throw new Error(StripeErrors.ATTACH_PAYMENT_METHOD_FAILED);
    }
  }

 
  async getBalance(): Promise<Stripe.Balance> {
    try {
      const balance = await this.stripe.balance.retrieve();
      this.logger.log(StripeMessages.BALANCE_FETCH_SUCCESS);
      return balance;
    } catch (error) {
      this.logger.error(StripeErrors.BALANCE_FETCH_FAILED, error.stack);
      throw new Error(StripeErrors.BALANCE_FETCH_FAILED);
    }
  }

  async createPaymentLink(priceId: string): Promise<Stripe.PaymentLink> {
    try {
      const paymentLink = await this.stripe.paymentLinks.create({
        line_items: [{ price: priceId, quantity: 1 }],
      });
      this.logger.log(StripeMessages.PAYMENT_LINK_SUCCESS);
      return paymentLink;
    } catch (error) {
      this.logger.error(StripeErrors.PAYMENT_LINK_FAILED, error.stack);
      throw new Error(StripeErrors.PAYMENT_LINK_FAILED);
    }
  }
}
