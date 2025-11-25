# Netlify Deployment Guide

## Environment Variables Setup

Your Netlify build is failing because it needs Supabase credentials. Follow these steps:

### 1. Go to your Netlify dashboard
   - Visit: https://app.netlify.com
   - Select your site: **school-todo**

### 2. Navigate to Environment Variables
   - Click **Site configuration** in the sidebar
   - Click **Environment variables**
   - Click **Add a variable** → **Add a single variable**

### 3. Add these two variables:

**Variable 1:**
- **Key**: `EXPO_PUBLIC_SUPABASE_URL`
- **Value**: `https://sxjxbaojohoqovuszcik.supabase.co`
- **Scopes**: Check **Same value for all deploy contexts**

**Variable 2:**
- **Key**: `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: (copy from your `.env` file - the long string after `EXPO_PUBLIC_SUPABASE_ANON_KEY=`)
- **Scopes**: Check **Same value for all deploy contexts**

### 4. Save and Redeploy
   - Click **Save variables**
   - Go to **Deploys** tab
   - Click **Trigger deploy** → **Deploy site**

## Important Notes

- ✅ Variable names MUST match exactly (case-sensitive)
- ✅ Include the `EXPO_PUBLIC_` prefix
- ✅ Use your actual Supabase anon key (it's safe to use in client-side code)
- ⚠️ Never commit the `.env` file to GitHub (it's already in .gitignore)

## Quick Check

Your `.env` file should have:
```
EXPO_PUBLIC_SUPABASE_URL=https://sxjxbaojohoqovuszcik.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Copy these exact values to Netlify (excluding the `=` sign).

## After Setup

Once the environment variables are added, the build should succeed and your app will be live!
