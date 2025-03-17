# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Deployment with Vercel

This project is configured for easy deployment with Vercel. 

### Manual Deployment
1. Install the Vercel CLI: `npm i -g vercel`
2. Run `vercel` from the project directory to deploy to your Vercel account
3. Follow the prompts to link to your Vercel account

### GitHub Integration
For automatic deployments with GitHub:
1. Connect your GitHub repository to Vercel
2. Vercel will automatically deploy when changes are pushed to the main branch
3. The project includes a GitHub Actions workflow in `.github/workflows/vercel-deploy.yml`

### Environment Variables
If your application requires environment variables, set them in the Vercel dashboard under your project settings.
