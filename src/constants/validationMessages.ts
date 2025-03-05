// DELETE?

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
  // ... other entity messages
} as const;
