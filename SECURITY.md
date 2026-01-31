# Security Guidelines for Closet Whisperer

## Overview
This document outlines security best practices and vulnerabilities that have been addressed or need attention.

## Implemented Security Measures

### 1. Environment Variables Validation
- ✅ Added comprehensive validation for all required environment variables
- ✅ Helpful error messages when configuration is missing
- ✅ Process exits gracefully with clear instructions

### 2. CORS Configuration
- ✅ **FIXED:** Production CORS now restricted to `closet.loopylab.app` only
- ⚠️ Development still allows all origins (acceptable for local dev)
- Credentials enabled for proper cookie/auth handling

### 3. File Upload Security
- ✅ **FIXED:** File type validation (only JPEG, PNG, GIF, WebP)
- ✅ **FIXED:** File size validation (10MB limit enforced)
- ✅ Limited to 1 file per upload
- ⚠️ **TODO:** Consider adding image dimension validation to prevent decompression bombs
- ⚠️ **TODO:** Add malware scanning for production

### 4. Input Validation
- ✅ **FIXED:** Color and occasion string length limits (50 chars)
- ✅ **FIXED:** Prompt length limit (500 chars max)
- ✅ Zod schema validation on all endpoints

### 5. API Rate Limiting
- ⚠️ **TODO:** Implement rate limiting middleware (e.g., @fastify/rate-limit)
- ⚠️ **TODO:** Add per-IP limits for file uploads
- ⚠️ **TODO:** Add per-user limits for AI generation

## Known Vulnerabilities to Address

### Critical (P0)
1. **No Authentication/Authorization**
   - Backend API is completely open
   - Traefik + Authelia only protect at reverse proxy level
   - Direct access to port 4000 bypasses auth
   - **Recommendation:** Add JWT or session-based auth to backend routes

2. **Public MinIO Bucket Policy**
   - All images are publicly accessible
   - Anyone with URL can view images
   - **Recommendation:** 
     - Use signed URLs with expiration
     - Implement private bucket with pre-signed URLs
     - Add authorization check before serving images

### High (P1)
3. **OpenRouter API Key Exposure**
   - If leaked, anyone can use your API key
   - **Mitigation:** Rotate keys immediately if exposed
   - **Recommendation:** Use rate limiting on AI endpoints

4. **No Request Rate Limiting**
   - DoS attacks possible
   - **Recommendation:** Add @fastify/rate-limit plugin

5. **Lack of Error Monitoring**
   - No Sentry or error tracking
   - **Recommendation:** Integrate Sentry or similar

### Medium (P2)
6. **SQL Injection Prevention**
   - ✅ Prisma ORM prevents SQL injection
   - But expensive queries possible (e.g., `color` contains on large datasets)
   - **Recommendation:** Add query timeouts and limits

7. **XSS Prevention**
   - React prevents most XSS by default
   - But `metadata` JSON fields could contain malicious data
   - **Recommendation:** Sanitize user-generated content in metadata

8. **HTTPS Enforcement**
   - ✅ Production uses Traefik with Let's Encrypt
   - Development uses HTTP (acceptable)

## Environment Variables Security

### Required Variables (must be set)
```bash
DATABASE_URL=postgresql://...
OPENROUTER_API_KEY=sk-or-v1-...
MINIO_ACCESS_KEY=...
MINIO_SECRET_KEY=...
```

### Recommendations
- Use secrets management (Docker secrets, Vault, etc.)
- Never commit `.env` files
- Rotate credentials regularly
- Use strong passwords (min 32 chars for secrets)

## Docker Security

### Implemented
- ✅ Non-root user in frontend Dockerfile (nextjs:nodejs)
- ✅ Multi-stage builds to minimize image size
- ✅ .dockerignore files to prevent leaking sensitive files

### TODO
- Add security scanning (Trivy, Snyk)
- Run backend as non-root user
- Use read-only root filesystem where possible

## API Security Checklist

- [x] Input validation (Zod schemas)
- [x] File upload restrictions
- [x] CORS configuration
- [ ] Rate limiting
- [ ] Authentication/Authorization
- [ ] Request size limits
- [ ] SQL injection prevention (via Prisma)
- [ ] XSS prevention (partially via React)
- [ ] CSRF protection (not needed for stateless API)
- [ ] Secure headers (helmet)

## Recommended Next Steps

1. **Implement Authentication**
   ```typescript
   // Add JWT or session-based auth
   fastify.register(require('@fastify/jwt'), {
     secret: process.env.JWT_SECRET
   });
   ```

2. **Add Rate Limiting**
   ```typescript
   fastify.register(require('@fastify/rate-limit'), {
     max: 100,
     timeWindow: '15 minutes'
   });
   ```

3. **Add Security Headers**
   ```typescript
   fastify.register(require('@fastify/helmet'));
   ```

4. **Implement Signed URLs for MinIO**
   ```typescript
   const url = await storageService.getSignedUrl(key, 3600); // 1 hour expiry
   ```

5. **Add Error Monitoring**
   ```typescript
   import * as Sentry from '@sentry/node';
   Sentry.init({ dsn: process.env.SENTRY_DSN });
   ```

## Reporting Security Issues

If you discover a security vulnerability, please email security@example.com (or create a private security advisory on GitHub).

Do NOT create public issues for security vulnerabilities.
