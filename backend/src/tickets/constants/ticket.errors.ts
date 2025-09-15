export abstract class TicketErrors {
  static readonly ALREADY_BOOKED = 'Ticket already booked for this event!';
  static readonly NO_TICKETS_FOUND = 'No tickets found for this event!';
  static readonly TICKET_NOT_FOUND = 'Ticket not found!';
  static readonly ALREADY_SCANNED = 'Ticket has already been scanned!';
  static readonly DELETE_FAILED = 'Failed to delete ticket!';
  static readonly EVENTID_IS_REQUIRED = "Event Id is required";
  static readonly PRICINGID_IS_REQUIRED = "Pricing Id is required";
  static readonly VALID_QRCODE ='QR code must be a string' ;
  static readonly QR_CODE_REQUIRED = "QR code is required";
}
