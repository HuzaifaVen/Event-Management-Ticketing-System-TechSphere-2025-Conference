export abstract class EventErrors{
    static readonly VALID_TITLE = "Title must be a string";
    static readonly REQUIRED_TITLE = "Title is required!";
    static readonly VALID_DESCRIPTION = "Description must be a string";
    static readonly REQUIRED_DESCRIPTION = "Description is required";
    static readonly EVENT_EXISTS = "Event already exists!";
    static readonly EVENT_NOT_FOUND = "Event not found!";
    static readonly EVENT_NOT_EXIST = "Event doesn't exist!";
    static readonly FAILED_EVENT_CREATION = "Event could not be created!";
    static readonly VALID_START_DATE = "Start date must be a valid date";
    static readonly VALID_END_DATE = "End date must be a valid date";
    static readonly VALID_USERID = "User ID must be a string";
    static readonly VALID_LOCATION = "Location must be a string";
    static readonly REQUIRED_LOCATION = "Location is required";
    static readonly VALID_PRICING = "Pricings must be an array";
}