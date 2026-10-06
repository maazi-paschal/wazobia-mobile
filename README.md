# Wazobia Mobile (React Native / Expo)

A production-ready luxury Afro-minimalist fashion e-commerce mobile application built for **Wazobia Couture**.

---

## 🎨 Design System & Palette
- **Background:** `#fcfbf9` (Warm Alabaster Cream)
- **Cards & Surfaces:** `#ffffff` (Pure Crisp White)
- **Primary Text & Buttons:** `#111111` (Obsidian Charcoal)
- **Accent:** `#c85a32` (Terracotta Clay)
- **Subtle Borders:** `#e8e6df` (Muted Linen)
- **Image Aspect Ratio:** 3:4 portrait product cards in a clean 2-column grid

---

## 📱 Bottom Tab Navigation (4 Tabs)

1. **🏛️ Shop (Home Feed):**
   - Afro-luxury brand header with quick search trigger
   - Category filter pills (`All`, `Men`, `Women`, `Accessories`)
   - 2-Column product feed featuring 3:4 portrait photography, interactive size selector (`S`, `M`, `L`, `XL`, `XXL`), and `ADD TO BAG` CTA
   - Tap-to-view detailed modal with full garment specifications

2. **🔍 Search (Live Filter & Sort):**
   - Instant search across product titles, descriptions, and categories
   - Category filter chips & price sorting (`Price: Low to High`, `Price: High to Low`)
   - 2-Column matching results grid

3. **🛍️ Bag (Cart):**
   - Dynamic real-time item count badge on bottom tab icon
   - Item rows with portrait thumbnails, size tags, unit prices, and stepper quantity controls (`-` / `+`)
   - Highlighted **Pay on Delivery (POD)** notice banner for Nigeria & Ghana
   - Order subtotal breakdown & checkout button

4. **👤 Profile (Account & Orders):**
   - Live Supabase Authentication (Email Login & Registration)
   - **Instant Demo Login** for rapid evaluation
   - Real-time **Two-Way Cloud Cart Sync** status indicator
   - Persistent **Order History** tracking previous Pay on Delivery orders, order references, dates, and status

---

## ⚡ Two-Way Cloud Cart Sync (Supabase `user_carts`)

- **On Login / Active Session:**
  Fetches user's cloud cart:
  ```javascript
  supabase.from('user_carts').select('items').eq('user_email', user.email).maybeSingle()
  ```
- **On Cart Modification (Add / Remove / Quantity change):**
  If authenticated, immediately syncs to Supabase:
  ```javascript
  supabase.from('user_carts').upsert({
    user_email: user.email,
    items: updatedCart,
    updated_at: new Date().toISOString()
  })
  ```
- **Guest / Offline Fallback:** Automatically persists cart state to `@react-native-async-storage/async-storage`.

---

## 📦 Standalone APK Build & Expo Configuration

- **`app.json`:** Configured with `android.package`: `"com.wazobia.shop"`, `name`: `"Wazobia"`, `slug`: `"wazobia-mobile"`.
- **`eas.json`:** Configured for preview APK builds:
  ```json
  {
    "build": {
      "preview": {
        "android": {
          "buildType": "apk"
        }
      }
    }
  }
  ```

---

## 🚀 Setup & Launch Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Expo Server
```bash
npx expo start
```
- Press `a` for Android Emulator
- Press `i` for iOS Simulator
- Scan QR code with Expo Go app on mobile

### 3. Build Android APK
```bash
npx eas-cli build -p android --profile preview
```

---

## 🌐 Supabase SQL Schema (`user_carts`)

```sql
create table if not exists public.user_carts (
  id uuid default gen_random_uuid() primary key,
  user_email text unique not null,
  items jsonb default '[]'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.user_carts enable row level security;

-- Policy for seamless 2-way read/upsert by email
create policy "Allow all authenticated/anon read/upsert by email" on public.user_carts
  for all using (true) with check (true);
```
