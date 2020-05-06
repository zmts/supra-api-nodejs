# Login (LoginAction)
```
POST /api/auth/login
{
    "email": "",
    "password": "",
    "fingerprint": ""
}
```
- Server check max session count (MAX_SESSIONS_COUNT === 5)
- If condition is Ok, creates new `RefreshSessionEntity`
- If not server wipe all user sessions and creates new one 
- Response with (example):
```
Set-Cookie: refreshToken='c84f18a2-c6c7-4850-be15-93f9cbaef3b3'; HttpOnly
{
  body: { 
    accessToken: 'eyJhbGciOiJIUzUxMiIsI...',
    refreshToken: 'c84f18a2-c6c7-4850-be15-93f9cbaef3b3'
  }
}
``` 

# Refresh tokens (RefreshTokensAction)
```
POST /api/auth/refresh-tokens (with refreshToken in cookie)
{
    "fingerprint": ""
}
```
- Get old session by `refreshToken` id
- Remove old session
- Verify old session fingerprint with fingerprint taken from request
- Create and store new `RefreshSessionEntity`
- Create `access token`
- Response with (example):
```
Set-Cookie: refreshToken='c84f18a2-c6c7-4850-be15-93f9cbaef3b3'; HttpOnly
{
  body: { 
    accessToken: 'eyJhbGciOiJIUzUxMiIsI...',
    refreshToken: 'c84f18a2-c6c7-4850-be15-93f9cbaef3b3'
  }
}
``` 

# Logout (current session)
```
POST /api/auth/logout (with refreshToken in cookie)
```
- Remove session by `refreshToken` id
