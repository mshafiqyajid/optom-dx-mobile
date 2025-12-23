/**
 * Date and time formatting utilities for the mobile app
 */

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Format a date string to "DD Month YYYY" format
 * Example: "03 August 2025"
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options);
};

/**
 * Format a date string to short format "DD MMM YYYY"
 * Example: "03 AUG 2025"
 */
export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options).toUpperCase();
};

/**
 * Format time range from start and end dates
 * Example: "9:00 AM to 5:00 PM"
 */
export const formatTimeRange = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
  const startTime = start.toLocaleTimeString('en-US', timeOptions).toUpperCase();
  const endTime = end.toLocaleTimeString('en-US', timeOptions).toUpperCase();
  return `${startTime} to ${endTime}`;
};

/**
 * Format event date and time for list display
 * Example: "03 AUG 2025, 9:00 AM – 5:00 PM"
 */
export const formatEventDateTime = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dateOptions: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
  const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };

  const formattedDate = start.toLocaleDateString('en-GB', dateOptions).toUpperCase();
  const startTime = start.toLocaleTimeString('en-US', timeOptions);
  const endTime = end.toLocaleTimeString('en-US', timeOptions);

  return `${formattedDate}, ${startTime} – ${endTime}`;
};

/**
 * Get detailed date info for carousel display
 */
export const getCarouselDateInfo = (dateString: string): { day: string; date: string; time: string } => {
  const d = new Date(dateString);
  return {
    day: DAY_NAMES[d.getDay()],
    date: `${d.getDate().toString().padStart(2, '0')} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`,
    time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase(),
  };
};

/**
 * Format location from event address fields
 */
export const formatLocation = (event: {
  address_line_1?: string | null;
  address_line_2?: string | null;
  address_line_3?: string | null;
  city?: string | null;
  state?: string | null;
}): string => {
  const parts = [
    event.address_line_1,
    event.address_line_2,
    event.address_line_3,
    event.city,
    event.state
  ].filter(Boolean);
  return parts.join(', ') || 'Location not specified';
};
