import { Body, Controller, Get, Post } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreatePaymentIntentDto } from './dto/create-payment.dto';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { CreatePaymentLinkDto } from './dto/create-payment-link.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Stripe')
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @ApiOperation({ summary: 'Get all Stripe products' })
  @ApiResponse({ status: 200, description: 'List of products returned successfully' })
  @Get('products')
  async getProducts() {
    return this.stripeService.getProducts();
  }

  @ApiOperation({ summary: 'Get all Stripe customers' })
  @ApiResponse({ status: 200, description: 'List of customers returned successfully' })
  @Get('customers')
  async getCustomers() {
    return this.stripeService.getCustomers();
  }

  @ApiOperation({ summary: 'Create a Payment Intent' })
  @ApiResponse({ status: 201, description: 'Payment Intent created successfully' })
  @Post('create-payment-intent')
  async createPaymentIntent(@Body() createPaymentIntent: CreatePaymentIntentDto) {
    return this.stripeService.createPaymentIntent(createPaymentIntent);
  }

  @ApiOperation({ summary: 'Create a Subscription' })
  @ApiResponse({ status: 201, description: 'Subscription created successfully' })
  @Post('subscriptions')
  async createSubscription(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.stripeService.createSubscription(createSubscriptionDto);
  }

  @ApiOperation({ summary: 'Create a Customer' })
  @ApiResponse({ status: 201, description: 'Customer created successfully' })
  @Post('customers')
  async createCustomer(@Body() dto: CreateCustomerDto) {
    return this.stripeService.createCustomer(dto);
  }

  @ApiOperation({ summary: 'Create a Product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @Post('products')
  async createProduct(@Body() dto: CreateProductDto) {
    return this.stripeService.createProduct(dto);
  }

  @ApiOperation({ summary: 'Create a Payment Link' })
  @ApiResponse({ status: 201, description: 'Payment link created successfully' })
  @Post('payment-links')
  async createPaymentLink(@Body() dto: CreatePaymentLinkDto) {
    return this.stripeService.createPaymentLink(dto);
  }

  @ApiOperation({ summary: 'Get Stripe account balance' })
  @ApiResponse({ status: 200, description: 'Stripe balance fetched successfully' })
  @Get('balance')
  async getBalance() {
    return this.stripeService.getBalance();
  }
}
