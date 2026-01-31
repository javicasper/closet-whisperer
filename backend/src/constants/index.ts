// Garment constants
export const GARMENT_STATUS = {
  AVAILABLE: 'AVAILABLE',
  IN_LAUNDRY: 'IN_LAUNDRY',
  UNAVAILABLE: 'UNAVAILABLE',
} as const;

export const GARMENT_TYPE = {
  TOP: 'TOP',
  BOTTOM: 'BOTTOM',
  DRESS: 'DRESS',
  OUTERWEAR: 'OUTERWEAR',
  SHOES: 'SHOES',
  ACCESSORY: 'ACCESSORY',
} as const;

export const GARMENT_SEASON = {
  SPRING: 'SPRING',
  SUMMER: 'SUMMER',
  FALL: 'FALL',
  WINTER: 'WINTER',
  ALL_SEASON: 'ALL_SEASON',
} as const;

// File upload constants
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES: 1,
  VALID_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
} as const;

// API limits
export const API_LIMITS = {
  MAX_COLOR_LENGTH: 50,
  MAX_OCCASION_LENGTH: 50,
  MAX_PROMPT_LENGTH: 500,
  DEFAULT_PAGE_LIMIT: 50,
  MAX_PAGE_LIMIT: 100,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NO_FILE_UPLOADED: 'No file uploaded',
  INVALID_FILE_TYPE: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.',
  FILE_TOO_LARGE: 'File size exceeds 10MB limit',
  GARMENT_NOT_FOUND: 'Garment not found',
  OUTFIT_NOT_FOUND: 'Outfit not found',
  SOME_GARMENTS_NOT_FOUND: 'Some garments not found',
  FAILED_TO_CREATE_GARMENT: 'Failed to create garment',
  FAILED_TO_UPDATE_GARMENT: 'Failed to update garment',
  FAILED_TO_DELETE_GARMENT: 'Failed to delete garment',
  FAILED_TO_LIST_GARMENTS: 'Failed to list garments',
  FAILED_TO_ADD_TO_LAUNDRY: 'Failed to add to laundry',
  FAILED_TO_REMOVE_FROM_LAUNDRY: 'Failed to remove from laundry',
  FAILED_TO_GENERATE_OUTFIT: 'Failed to generate outfit suggestions',
  FAILED_TO_CREATE_OUTFIT: 'Failed to create outfit',
  FAILED_TO_DELETE_OUTFIT: 'Failed to delete outfit',
} as const;
