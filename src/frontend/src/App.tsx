import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useUserProfile';
import AppShell from './components/shell/AppShell';
import ProfileSetupModal from './components/auth/ProfileSetupModal';
import ResumeListPage from './pages/ResumeListPage';
import ResumeEditorPage from './pages/ResumeEditorPage';
import ResumePreviewPage from './pages/ResumePreviewPage';
import CoachingPage from './pages/CoachingPage';
import LoadingState from './components/common/LoadingState';

function Layout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: ResumeListPage,
});

const editorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/editor/$resumeId',
  component: ResumeEditorPage,
});

const previewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/preview/$resumeId',
  component: ResumePreviewPage,
});

const coachingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/coaching/$resumeId',
  component: CoachingPage,
});

const routeTree = rootRoute.addChildren([indexRoute, editorRoute, previewRoute, coachingRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingState message="Initializing..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 px-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="space-y-4">
            <img
              src="/assets/generated/resume-coach-logo.dim_512x512.png"
              alt="Resume Coach"
              className="mx-auto h-24 w-24"
            />
            <h1 className="text-4xl font-bold tracking-tight">Resume Coach</h1>
            <p className="text-lg text-muted-foreground">
              Build professional resumes with AI-powered coaching
            </p>
          </div>
          <div className="pt-8">
            <p className="mb-4 text-sm text-muted-foreground">Sign in to get started</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <RouterProvider router={router} />
      {showProfileSetup && <ProfileSetupModal />}
    </>
  );
}

export default App;
