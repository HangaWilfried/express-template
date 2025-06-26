npx prisma init --db --output ../generated/prisma
This will create a project for you on console.prisma.io and requires you to be authenticated.
✔ Would you like to authenticate? Yes
✔ Select an authentication method GitHub
Authenticating to Prisma Platform via browser.

Visit the following URL in your browser to authenticate:
https://console.prisma.io/auth/cli?state=eyJjbGllbnQiOiJwcmlzbWEtY2xpLWluaXQvMC4wLjUgKFNpZ25hdHVyZTogZjdjNjMzYjYtMzZhNS00ZDY4LWI5M2MtZjcxZmE4ZGZiMGUyKSIsImNvbm5lY3Rpb24iOiJnaXRodWIiLCJyZWRpcmVjdFRvIjoiaHR0cDovLzEyNy4wLjAuMTo0NjQ2Ny8ifQ%3D%3D
Successfully authenticated as Wilfriedhanga5@gmail.com.
Let's set up your Prisma Postgres database!
✔ Select your region: eu-west-3 - Europe (Paris)
✔ Enter a project name: relxnote
✔ Success! Your Prisma Postgres database is ready ✅

We found an existing schema.prisma file in your current project directory.

--- Database URL ---

Connect Prisma ORM to your Prisma Postgres database with this URL:

prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiMDFKVlJRNUZSQVJTS0I1SllFVFBKMUpaWjMiLCJ0ZW5hbnRfaWQiOiI0ZjRmMGUyMjVmZDI4NDE2Nzc0MjAwYzZhNGU1YzQ4NTNhMmRlOTI4YTU4ODUxOGJjMTg3N2M2MTI4ZWNjYWI5IiwiaW50ZXJuYWxfc2VjcmV0IjoiZDJjMGExNTUtZDQwMC00YjA5LThjZGMtYjJlODNkNzViNjA3In0.UnuXoQINRIRSUv98rinBIovgxZHkGWCT7ETAhkUPGj8

--- Next steps ---

Go to https://pris.ly/ppg-init for detailed instructions.

1. Install and use the Prisma Accelerate extension
   Prisma Postgres requires the Prisma Accelerate extension for querying. If you haven't already installed it, install it in your project:
   npm install @prisma/extension-accelerate

...and add it to your Prisma Client instance:
import { withAccelerate } from "@prisma/extension-accelerate"

const prisma = new PrismaClient().$extends(withAccelerate())

2. Apply migrations
   Run the following command to create and apply a migration:
   npx prisma migrate dev

3. Manage your data
   View and edit your data locally by running this command:
   npx prisma studio

...or online in Console:
https://console.prisma.io/cly03yewn04tqvfv2gszoeazi/cmaxjh4qe000cqgexx7vbbz6d/cmaxjh4qe000dqgex4qamqv5d/studio

4. Send queries from your app
   If you already have an existing app with Prisma ORM, you can now run it and it will send queries against your newly created Prisma Postgres instance.

5. Learn more
   For more info, visit the Prisma Postgres docs: https://pris.ly/ppg-docs
