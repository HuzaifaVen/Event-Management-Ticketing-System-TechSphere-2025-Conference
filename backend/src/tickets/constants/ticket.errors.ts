export abstract class TicketErrors {
  static readonly ALREADY_BOOKED = 'Ticket already booked for this event!';
  static readonly NO_TICKETS_FOUND = 'No tickets found for this event!';
  static readonly TICKET_NOT_FOUND = 'Ticket not found!';
  static readonly ALREADY_SCANNED = 'Ticket has already been scanned!';
  static readonly DELETE_FAILED = 'Failed to delete ticket!';
}
