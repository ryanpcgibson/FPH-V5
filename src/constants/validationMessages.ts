// Centralized so both form validation and automated testing can use the same strings
export const VALIDATION_MESSAGES = {
  PET: {
    NAME_MIN_LENGTH: "Pet name must be at least 2 characters",
    START_DATE_REQUIRED: "Start date is required",
    INVALID_DATE: "Please enter a valid date",
  },
  LOCATION: {
    NAME_MIN_LENGTH: "Location name must be at least 2 characters",
    START_DATE_REQUIRED: "Start date is required",
    INVALID_DATE: "Please enter a valid date",
  },
  MOMENT: {
    TITLE_MIN_LENGTH: "Title must be at least 2 characters",
    START_DATE_REQUIRED: "Start date is required",
    INVALID_DATE: "Please enter a valid date",
  },
} as const;
