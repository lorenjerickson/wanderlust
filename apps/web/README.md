# @wanderlust/web

Next.js 16 app router application for Wanderlust.

## Development

Copy `.env.sample` to `.env.local` and fill in the Auth0 values from a Regular
Web Application in Auth0.

For local development, configure these Auth0 application URLs:

- Allowed Callback URL: `http://localhost:5173/auth/callback`
- Allowed Logout URL: `http://localhost:5173`

Run the app with:

```sh
pnpm dev
```
