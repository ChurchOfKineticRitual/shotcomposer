---
description: Initialize the ShotComposer project from scratch
---

# Initialize Project

Set up the ShotComposer project with all dependencies:

1. **Create Vite + React project:**
   ```bash
   npm create vite@latest shotcomposer -- --template react
   cd shotcomposer
   ```

2. **Install core dependencies:**
   ```bash
   npm install @react-three/fiber @react-three/drei three leva camera-controls
   ```

3. **Install dev dependencies:**
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

4. **Configure Tailwind:**
   Update tailwind.config.js:
   ```javascript
   export default {
     content: ["./index.html", "./src/**/*.{js,jsx}"],
     theme: { extend: {} },
     plugins: [],
   }
   ```

5. **Add Tailwind to CSS:**
   In src/index.css:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

6. **Set up Mannequin.js:**
   - Download from https://boytchev.github.io/mannequin.js/mannequin.min.js
   - Add to public/ or create src/lib/mannequin.js

7. **Create directory structure:**
   ```
   src/
   ├── components/
   │   ├── entities/
   │   └── export/
   ├── hooks/
   ├── utils/
   ├── data/
   └── context/
   ```

8. **Verify setup:**
   ```bash
   npm run dev
   ```

After initialization, read docs/TECHNICAL_SPEC.md and start implementing components.
