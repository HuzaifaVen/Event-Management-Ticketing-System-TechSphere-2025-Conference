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
  static readonly VALID_PRICEID = 'priceId must be a string';
  static readonly PRICEID_REQUIRED = "Price Id is required";
  static readonly VALID_CURRENCY = 'Currency must be a string';
  static readonly CURRENCY_REQUIRED = "Currency is required";
  static readonly VALID_PRICE = "Price must be a number";
  static readonly PRICE_ABOVE_ZERO = "Price must be greater than zero";
  static readonly PRICE_REQUIRED = "Price is required";
  static readonly VALID_CUSTOMERID = "Customer Id must be a string";
  static readonly CUSTOMERID_REQUIRED = "Customer ID is required";
}
