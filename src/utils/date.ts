// Date formatting utilities that can be safely imported by client components
import { format } from 'date-fns';

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return format(date, 'MMMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}