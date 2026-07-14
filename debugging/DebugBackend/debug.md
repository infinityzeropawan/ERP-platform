# Backend Debugging Reference

## Table of Contents
- [Authentication Issues](#authentication-issues)
- [Database Problems](#database-problems)
- [API Route Errors](#api-route-errors)
- [Middleware Issues](#middleware-issues)
- [Payment Integration Bugs](#payment-integration-bugs)
- [Notification Service Errors](#notification-service-errors)

## Authentication Issues
### Login Failure
- **File:** [backend/src/routes/auth.ts](file:///home/pawan/Desktop/Buildroonix_ERP_Clean/backend/src/routes/auth.ts)
- **Description:** Issues with user authentication flow
- **Common Fixes:** Check JWT token generation, verify password hashing
- **Last Updated:** 2026-07-14

### Token Expiration
- **File:** [backend/src/middlewares/auth.ts](file:///home/pawan/Desktop/Buildroonix_ERP_Clean/backend/src/middlewares/auth.ts)
- **Description:** Problems with JWT token validation
- **Common Fixes:** Adjust token expiration time, refresh token logic
- **Last Updated:** 2026-07-14

## Database Problems
### Prisma Connection Issues
- **File:** [backend/src/config/db.ts](file:///home/pawan/Desktop/Buildroonix_ERP_Clean/backend/src/config/db.ts)
- **Description:** Database connection failures
- **Common Fixes:** Check environment variables, connection pooling
- **Last Updated:** 2026-07-14

### Schema Mismatch
- **File:** [backend/prisma/schema.prisma](file:///home/pawan/Desktop/Buildroonix_ERP_Clean/backend/prisma/schema.prisma)
- **Description:** Model inconsistencies between code and database
- **Common Fixes:** Run prisma migrate, regenerate client
- **Last Updated:** 2026-07-14

## API Route Errors
### Admin Routes
- **File:** [backend/src/routes/admin.ts](file:///home/pawan/Desktop/Buildroonix_ERP_Clean/backend/src/routes/admin.ts)
- **Description:** Issues with admin-specific endpoints
- **Common Fixes:** Check permissions, role validation
- **Last Updated:** 2026-07-14

### Student Routes
- **File:** [backend/src/routes/student.ts](file:///home/pawan/Desktop/Buildroonix_ERP_Clean/backend/src/routes/student.ts)
- **Description:** Problems with student data access
- **Common Fixes:** Verify student ID validation, permissions
- **Last Updated:** 2026-07-14

## Middleware Issues
### Security Middleware
- **File:** [backend/src/middlewares/security.ts](file:///home/pawan/Desktop/Buildroonix_ERP_Clean/backend/src/middlewares/security.ts)
- **Description:** CORS, rate limiting, or other security concerns
- **Common Fixes:** Adjust security headers, rate limit values
- **Last Updated:** 2026-07-14

## Payment Integration Bugs
### Payment Processing
- **File:** [backend/src/routes/payments.ts](file:///home/pawan/Desktop/Buildroonix_ERP_Clean/backend/src/routes/payments.ts)
- **Description:** Issues with payment gateway integration
- **Common Fixes:** Check API keys, webhook handling
- **Last Updated:** 2026-07-14

## Notification Service Errors
### WebSocket Issues
- **File:** [backend/src/services/websocketService.ts](file:///home/pawan/Desktop/Buildroonix_ERP_Clean/backend/src/services/websocketService.ts)
- **Description:** Real-time notification problems
- **Common Fixes:** Check connection handling, error recovery
- **Last Updated:** 2026-07-14