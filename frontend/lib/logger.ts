/**
 * Centralized Logger Utility
 * Ensures that console logs are completely disabled in production environments
 * to prevent leaking sensitive information or cluttering the console.
 */
const isProduction = process.env.NODE_ENV === 'production';

export const logger = {
  log: (...args: any[]) => {
    if (!isProduction) {
      console.log(...args);
    }
  },
  warn: (...args: any[]) => {
    if (!isProduction) {
      console.warn(...args);
    }
  },
  error: (...args: any[]) => {
    if (!isProduction) {
      console.error(...args);
    }
  },
  info: (...args: any[]) => {
    if (!isProduction) {
      console.info(...args);
    }
  },
};
