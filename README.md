# Simple Cart & Discount System (Cartify)

A modern, highly interactive shopping cart and discount system simulator. Users can explore a curated product catalog, add items, modify quantities, create custom items, apply promo codes with real-time feedback, and see tax/shipping calculations. Built using vanilla web technologies and powered by Vite.

🚀 **Live Demo:** [https://simple-cart-system.vercel.app/](https://simple-cart-system.vercel.app/)

Snapshots:
<img width="1917" height="905" alt="image" src="https://github.com/user-attachments/assets/4a2f6eff-47e3-4d65-baa5-e622c663b2ad" />


<img width="1543" height="878" alt="image" src="https://github.com/user-attachments/assets/f6168c9b-251d-456e-966e-2ce547c53da6" />

---

## 🚀 Setup & Run Instructions

To run this application locally, you will need **Node.js** (v16.0.0 or later recommended) and **npm** installed on your system.

### 1. Extract / Clone the Project
Make sure you are in the project root directory:
```bash
cd C:/Users/rajat/.gemini/antigravity/scratch/simple-cart-system
```

### 2. Install Dependencies
Install Vite and other dev dependencies:
```bash
npm install
```

### 3. Run the Development Server
Launch the project locally in development mode:
```bash
npm run dev
```
Once run, Vite will open the application in your default web browser (typically at [http://localhost:3000](http://localhost:3000)).

### 4. Build for Production
To bundle the application into highly optimized, static assets ready for deployment (e.g., to Vercel, Netlify):
```bash
npm run build
```
This command generates a production-ready `dist` folder.

---

## 🛠️ Technology Stack Used

- **Vite (v5.2.0)**: Used as a fast dev server and bundler. It requires zero configuration for standard assets and enables rapid compilation.
- **HTML5**: Semantic web structure.
- **CSS3 (Vanilla)**: Includes modern CSS variables (custom properties), CSS grid and flexbox, glassmorphic backdrop-filters, custom scrollbar styling, fluid layouts, and smooth animations.
- **JavaScript (ES6+)**: Custom application state controller, reactive DOM renderer, validation systems, and local event listeners.
- **Lucide Icons**: Loaded dynamically from CDN to provide crisp, modern vectors.
- **Google Fonts (Outfit)**: Premium typography selected for readability and aesthetic.

---

## 📝 Assumptions Made During Development

1. **State Persistence**: The theme (Light vs. Dark mode) is persisted in the browser's `localStorage` so it remains sticky on page reloads. The shopping cart and product catalog states are stored in-memory (reacting instantly to inputs but resetting on hard reloads).
2. **Taxation & Shipping Policy**:
   - Estimated tax is calculated at **8%** on the subtotal *after* the coupon discount is applied.
   - Shipping is a flat **$10.00** but automatically becomes **Free ($0.00)** if the subtotal reaches or exceeds **$100.00**.
3. **Discount System**:
   - Promo codes are case-insensitive and can be typed manually or applied instantly using the Quick Coupon buttons.
   - Supported coupons:
     - `SAVE10`: 10% off subtotal.
     - `WELCOME20`: 20% off subtotal.
     - `MEGA50`: 50% off subtotal.
   - Only **one** coupon code can be applied at a time.
4. **Custom Products Creator**: Custom products are appended to the main catalog state with a default stock limit of `10` units and a perfect `5.0` rating. They support selection of matching category icons.
5. **Vercel Deployment**: The app structure complies with standard Vercel configurations for Vite. To deploy to Vercel, simply connect the Git repository and Vercel will automatically detect Vite and use `npm run build` with `dist` as the output folder.
