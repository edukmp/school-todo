# Category Management Setup Guide

## 📋 Create Categories Table in Supabase

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor** (left sidebar)
3. Click **"New query"**
4. **Paste and Run** this SQL:

```sql
-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT 'tag',
    color TEXT NOT NULL DEFAULT '#5B9EF8',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for categories table
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read categories
CREATE POLICY "Allow public read categories"
ON public.categories FOR SELECT
USING (true);

-- Allow authenticated users to insert/update/delete categories
CREATE POLICY "Allow authenticated manage categories"
ON public.categories FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Insert default categories
INSERT INTO public.categories (name, icon, color) VALUES
    ('Work', 'briefcase.fill', '#FF9F47'),
    ('Music', 'headphones', '#FF7EB6'),
    ('Travel', 'airplane', '#54E69D'),
    ('Study', 'book.fill', '#9F7AEA'),
    ('Home', 'house.fill', '#FF5757')
ON CONFLICT DO NOTHING;
```

5. Click **Run** (or press F5)

## ✨ Features

### Admin Can:
- ✅ **Create** new categories with custom name, icon, and color
- ✅ **Edit** existing categories
- ✅ **Delete** categories (except "All")
- ✅ View task count per category

### After Saving:
- When you click **"Save Changes"** in the Branding tab, you'll be automatically redirected to the landing page
- All changes are immediately reflected across the app

## 🎨 Available Icons
- `briefcase.fill` (Work)
- `book.fill` (Study)  
- `headphones` (Music)
- `airplane` (Travel)
- `house.fill` (Home)
- `tag` (Label)
- `bell` (Notifications)
- `checkmark` (Check)

## 🎨 Available Colors
- `#5B9EF8` (Blue)
- `#FF9F47` (Orange)
- `#FF7EB6` (Pink)
- `#54E69D` (Green)
- `#9F7AEA` (Purple)
- `#FF5757` (Red)
- `#FFA500` (Gold)
- `#20B2AA` (Teal)

## 🚀 How to Use

1. **Login** as admin (use the "Admin Login" button on landing page)
2. Navigate to **Settings**
3. Select the **"Categories"** tab
4. Click **"Add New"** to create a category
5. Fill in the name, choose an icon and color
6. Click **"Save"**
7. Your new category will appear in the main Lists screen!

## 📝 Notes
- The **"All"** category is automatically generated and cannot be deleted
- Task counts update in real-time
- Categories are stored in Supabase and synced across all devices
