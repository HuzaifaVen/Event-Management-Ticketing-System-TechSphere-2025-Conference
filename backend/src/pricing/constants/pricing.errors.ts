export abstract class PricingErrors {
  static readonly VALID_TIER = "Tier must be a valid Tiers enum value";
  static readonly REQUIRED_TIER = "Tier is required";

  static readonly PRICING_ALREADY_EXISTS = "Pricing already exists";
  static readonly VALID_PRICING = "Pricing must be a number";
  static readonly MIN_PRICING = "Pricing must be at least 0";

  static readonly VALID_MAX_TICKETS = "Max tickets must be a number";
  static readonly MIN_MAX_TICKETS = "Max tickets must be at least 1";

  static readonly VALID_SOLD_TICKETS = "Sold tickets must be a number";
  static readonly MIN_SOLD_TICKETS = "Sold tickets cannot be negative";

  static readonly VALID_DISCOUNT_PERCENTAGE = "Discount percentage must be a number";
  static readonly MIN_DISCOUNT_PERCENTAGE = "Discount percentage cannot be negative";

  static readonly VALID_DISCOUNT_NAME = "Discount name must be a string";

  static readonly VALID_DISCOUNT_START_DATE = "Discount start date must be a valid ISO date string";
  static readonly VALID_DISCOUNT_END_DATE = "Discount end date must be a valid ISO date string";
}
