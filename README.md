# Data Quality Assessment Tool

This tool helps assess the quality and ethical aspects of data.

## Development

This project is built with React, TypeScript, and Vite.

```bash
# Install dependencies
yarn install

# Run development server
yarn dev

# Build for production
yarn build
```

## GitHub Pages Deployment

This project is configured to automatically deploy to GitHub Pages when changes are pushed to the main branch. The deployment workflow is defined in `.github/workflows/deploy.yml`.

### How to Enable GitHub Pages

1. Go to your repository settings
2. Navigate to "Pages" in the sidebar
3. Under "Build and deployment", select "GitHub Actions" as the source
4. Wait for the deployment workflow to complete
5. Your application will be available at `https://<username>.github.io/<repository-name>/`

### Manual Deployment

You can also trigger a manual deployment:

1. Go to the "Actions" tab in your repository
2. Select the "Build and Deploy to GitHub Pages" workflow
3. Click on "Run workflow" dropdown
4. Select the branch you want to deploy from
5. Click "Run workflow"

## Customization

For further customization of the Vite build process, refer to the [Vite documentation](https://vitejs.dev/config/).
