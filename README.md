## About

Authentication feature implementation in the Next.js application

- sign up ( credentials )
- sign in ( credentials )
- change password
- forgotten password
- pages protection by middleware

## Tech stack

- Next.js@latest (15 at this time) / typescript
- Auth.js, latest next-auth v5
- zod, react-hook-form
- Chadcn UI, tailwind scc
- Drizzle ORM, Postgres db hosted on Neon.
- Mailing by [`nodemailer`](https://nodemailer.com/) SMTP with [`https://resend.com`](https://resend.com/)
- 2FA auth libraries: [`otplib`](https://www.npmjs.com/package/otplib), [`qrcode.react`](https://www.npmjs.com/package/qrcode.react)

## Database

Hosted at [`NEON / next_auth_masterclass`](https://console.neon.tech/)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

- It is using the latest React RC canary version - to install packages you'll need to use `--force` flag
- Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
