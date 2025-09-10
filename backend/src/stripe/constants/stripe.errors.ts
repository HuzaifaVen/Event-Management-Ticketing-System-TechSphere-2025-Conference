export abstract class StripeErrors {
  static readonly PRODUCTS_FETCH_FAILED = 'Failed to fetch products';
  static readonly CUSTOMERS_FETCH_FAILED = 'Failed to fetch customers';
  static readonly PAYMENT_INTENT_FAILED = 'Failed to create PaymentIntent';
  static readonly SUBSCRIPTION_FAILED = 'Failed to create subscription';
  static readonly CUSTOMER_CREATE_FAILED = 'Failed to create customer';
  static readonly PRODUCT_CREATE_FAILED = 'Failed to create product';
  static readonly REFUND_FAILED = 'Failed to process refund';
  static readonly ATTACH_PAYMENT_METHOD_FAILED = 'Failed to attach payment method';
  static readonly BALANCE_FETCH_FAILED = 'Failed to retrieve balance';
  static readonly PAYMENT_LINK_FAILED = 'Failed to create payment link';
}
