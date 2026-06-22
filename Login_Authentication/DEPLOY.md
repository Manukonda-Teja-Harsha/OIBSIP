# Deploy to Netlify

## Quick Start

### Option 1: Using Git (Recommended)
1. Push your code to GitHub, GitLab, or Bitbucket
2. Go to [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Connect your repository
5. Build command: `npm run build`
6. Publish directory: `dist`
7. Click "Deploy"

### Option 2: Manual Deployment
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

## Configuration
The `.netlify.toml` file is already configured with:
- Build command: `npm run build`
- Publish directory: `dist`
- SPA routing (single page app redirects)

## Environment Variables
If needed for backend API:
1. Go to Site Settings → Build & Deploy → Environment
2. Add your variables (API_URL, etc.)

## Deployment Checklist
- ✅ All dependencies in package.json
- ✅ Build script configured
- ✅ Netlify config (.netlify.toml) included
- ✅ SPA routing configured for React Router
- ✅ Production build optimized (minified, no sourcemaps)

Ready to deploy! 🚀
