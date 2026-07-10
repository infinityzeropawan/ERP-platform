import { type Request, type Response, type NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';
import { env } from '../config/env';

/**
 * Middleware to enforce HTTPS in production.
 * Redirects HTTP requests to HTTPS based on the x-forwarded-proto header.
 */
export const requireHttps = (req: Request, res: Response, next: NextFunction) => {
  if (env.isProduction) {
    // If the request was routed through a load balancer, check the protocol
    if (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
  }
  next();
};

/**
 * Recursively sanitize strings in an object using sanitize-html
 */
const sanitizeObject = (obj: any): any => {
  if (typeof obj === 'string') {
    // Sanitize the string, stripping harmful tags and scripts
    return sanitizeHtml(obj, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ['src', 'alt', 'width', 'height']
      }
    });
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  if (obj !== null && typeof obj === 'object') {
    const sanitizedObj: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        sanitizedObj[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitizedObj;
  }
  
  return obj;
};

/**
 * Middleware to sanitize the request body to prevent XSS attacks.
 */
export const sanitizeBody = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  next();
};
