# Security Posture

## Authentication
- Handled via stateless JWT.
- Tokens are signed with a securely managed `JWT_SECRET`.
- No plaintext passwords (passwords must be hashed).

## Authorization
- Role-based access control (`authMiddleware` and `requireRole`).
- Admin endpoints explicitly reject non-ADMIN tokens.
- Carriers cannot act on Loads they do not own or are not assigned to.

## Document Storage
- Documents are stored in Cloudflare R2 securely.
- Bucket is NOT public.
- File streaming is proxied through the authenticated `/api/documents/:id` endpoint.
- File types are validated before upload.

## Database (D1)
- Uses parameterized queries for all operations, preventing SQL injection.
- Migrations manage schema alterations.
