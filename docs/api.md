# API Documentation

Base URL: `/api`

## Auth
- `POST /auth/register`: Register new user
- `POST /auth/login`: Login user
- `POST /auth/logout`: Logout user
- `GET /auth/me`: Get current user profile

## Profiles
- `GET /profile`: Get own profile
- `PUT /profile`: Update profile

## Documents
- `GET /documents`: List own documents
- `POST /documents`: Upload new document
- `GET /documents/:id`: Download document (proxy from R2)

## Loads
- `GET /loads`: List available loads (paginated, filterable)
- `POST /loads`: Create new load
- `POST /loads/:id/book`: Book load (Carrier)
- `POST /loads/:id/status`: Update load status

## Admin
- `GET /admin/metrics`: Get high-level KPI counts
- `GET /admin/users`: List users
- `GET /admin/verifications/:userId`: Get user verification details + docs
- `POST /admin/verifications/:userId/approve`: Approve verification
- `POST /admin/verifications/:userId/reject`: Reject verification
- `POST /admin/users/:userId/suspend`: Suspend user
