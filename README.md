
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/38036248-c15b-4eae-94e2-61d8278751c9

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/38036248-c15b-4eae-94e2-61d8278751c9) and start prompting.

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

# Step 4: Set up environment variables
cp .env.example .env.local

# Step 5: Configure your API base URL in .env.local
# Edit VITE_API_BASE_URL to point to your backend API

# Step 6: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Environment Configuration

This project uses environment variables to configure the API connection:

1. Copy `.env.example` to `.env.local`
2. Update `VITE_API_BASE_URL` to point to your backend API:
   - Development: `http://localhost:3001/api`
   - Staging: `https://staging-api.yourdomain.com/api`
   - Production: `https://api.yourdomain.com/api`

## Architecture

This project follows a clean architecture with:

- **Services Layer** (`src/services/`): HTTP client and API service methods
- **Hooks Layer** (`src/hooks/`): React Query hooks for data fetching and mutations
- **Context Layer** (`src/contexts/`): Global state management
- **Pages Layer** (`src/pages/`): Route components using hooks for data
- **Components Layer** (`src/components/`): Reusable UI components

### Authentication Flow

1. User logs in via AuthContext
2. JWT token stored in localStorage via TokenManager
3. HTTP client automatically adds Bearer token to requests
4. Protected routes use `<RequireAuth>` wrapper
5. 401/403 responses automatically redirect to `/auth`

### Data Flow

1. Pages use React Query hooks (`useQuery`, `useMutation`)
2. Hooks call service methods
3. Services use HTTP client with interceptors
4. Loading states render skeletons
5. Error states render alerts
6. Success states trigger toasts and query invalidation

## Development Tools

### React Query DevTools

To enable React Query DevTools in development:

```bash
npm install @tanstack/react-query-devtools
```

Then add to your `main.tsx`:

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// Add inside your app component
{process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
```

## Testing

### End-to-End Tests

Run the test suite:

```bash
# Install test dependencies
npm install -D playwright

# Run tests
npm run test:e2e
```

### Manual Testing Checklist

- [ ] Sign up / Sign in flow
- [ ] Dashboard statistics and metrics
- [ ] Profile edit functionality
- [ ] Instance CRUD operations
- [ ] Subscription selection
- [ ] Admin user management
- [ ] Admin instance management
- [ ] All protected routes require authentication
- [ ] Logout clears tokens and redirects

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

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- React Query (@tanstack/react-query)
- React Router DOM
- shadcn-ui
- Tailwind CSS

## API Integration

The application integrates with a REST API using:

- **HTTP Client**: Custom fetch wrapper with interceptors
- **Authentication**: JWT Bearer tokens
- **Error Handling**: Automatic token refresh and logout
- **Loading States**: React Query powered loading indicators
- **Optimistic Updates**: Mutation-based UI updates

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/38036248-c15b-4eae-94e2-61d8278751c9) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
