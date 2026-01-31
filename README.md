# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Supabase backend

This app uses [Supabase](https://supabase.com) for data and auth.

1. **Create a Supabase project** at [supabase.com](https://supabase.com).
2. **Run the schema**: In the Supabase Dashboard → SQL Editor, run the SQL in `supabase/migrations/00001_initial_schema.sql`.
3. **Storage (image uploads)**: In Dashboard → Storage, create a new bucket named **uploads** and set it to **Public**. Then run `supabase/migrations/00002_storage_uploads_bucket.sql` in the SQL Editor to add policies so admins can upload album covers, logo, and about photo.
4. **Create an admin user**: Dashboard → Authentication → Users → Add user (email + password). Use this to sign in at `/admin/login`.
5. **Env vars**: Copy `.env.example` to `.env` and set:
   - `VITE_SUPABASE_URL` – from Dashboard → Settings → API → Project URL
   - `VITE_SUPABASE_ANON_KEY` – from Dashboard → Settings → API → anon public key

Without `.env`, the app still runs but data and auth will fail until Supabase is configured.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (database + auth)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
