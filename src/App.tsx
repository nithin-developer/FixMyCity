import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { NavigationProgress } from "@/components/navigation-progress";
import { useAuthStore } from "@/stores/authStore";
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";
import { handleServerError } from "@/utils/handle-server-error";
import { AxiosError } from "axios";

// Import debug utilities in development
if (import.meta.env.DEV) {
  import("@/utils/debug-auth");
}

// Pages
import Dashboard from "@/pages/dashboard";
import SignIn from "@/pages/auth/sign-in";
import IssuesPage from "@/pages/issues1";
import IssuesDetailPage from "@/pages/issues1/detail";
import TwoFAVerify from "@/pages/auth/two-fa-verify";
import ForgotPassword from "@/pages/auth/forgot-password";
import Otp from "@/pages/auth/otp";
import NotFoundError from "@/pages/errors/not-found-error";
import GeneralError from "@/pages/errors/general-error";
import UnauthorizedError from "@/pages/errors/unauthorized-error";
import ForbiddenError from "@/pages/errors/forbidden";
import MaintenanceError from "@/pages/errors/maintenance-error";

// Protected Route Component
import { ProtectedRoute } from "@/components/auth/protected-route";

import TrainersPage from "@/pages/trainers";
import CreateTrainerPage from "@/pages/trainers/create";
import EditTrainerPage from "@/pages/trainers/edit";
import EventsIndexPage from "@/pages/events";
import CreateEventPage from "@/pages/events/create";
import EditEventPage from "@/pages/events/edit";
import EventDetailPage from "@/pages/events/detail";
import MySessionsPage from "@/pages/sessions/my-sessions";
import AttendancePage from "@/pages/sessions/attendance";
import MyEventsPage from "@/pages/sessions/my-events";
import ReportsIndexPage from "@/pages/reports";
import ReportEventDetailPage from "@/pages/reports/event-detail";

// Settings Pages
import SettingsPage from "@/pages/settings";
import SettingsAccount from "@/pages/settings/account";
import SettingsAppearance from "@/pages/settings/appearance";
import SettingsSecurity from "@/pages/settings/security";
import SettingsTwoFA from "@/pages/settings/two-factor-authentication";

// Admin Pages
import AdminsPage from "@/pages/administrators";
import CollectorsPage from "@/pages/collectors";

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry during development to surface issues quickly
        if (import.meta.env.DEV) return false;

        // In production, stop retrying after 3 attempts
        if (failureCount > 3) return false;

        // Do not retry for auth errors (401/403)
        if (error instanceof AxiosError) {
          const status = error.response?.status ?? 0;
          if ([401, 403].includes(status)) return false;
        }

        return true;
      },
      refetchOnWindowFocus: import.meta.env.PROD,
      staleTime: 10 * 1000, // 10s
    },
    mutations: {
      onError: (error) => {
        handleServerError(error);

        if (error instanceof AxiosError) {
          if (error.response?.status === 304) {
            return; // Do nothing for 304
          }
        }
      },
    },
  },
});

// Authentication Guard Component
function AuthGuard({ children }: { children: React.ReactNode }) {
  const auth = useAuthStore();

  const isAuthenticated = auth.auth.isAuthenticated?.() ?? false;
  const user = auth.auth.user ?? null;
  const debug = import.meta.env.DEV || import.meta.env.VITE_ENVIRONMENT === "development";

  if (debug) {
    console.log("AuthGuard check:", {
      isAuthenticated,
      hasUser: !!user,
      hasToken: !!auth.auth.accessToken,
      user: user
        ? {
            email: user.email,
            role: user.role,
          }
        : null,
    });
  }

  if (!isAuthenticated) {
    if (debug) console.log("User not authenticated, redirecting to sign-in");
    return <Navigate to="/sign-in" replace />;
  }

  if (debug) console.log("User authenticated, showing protected content");
  return <>{children}</>;
}

// Authentication Redirect Component - redirects authenticated users away from auth pages
function AuthRedirect({ children }: { children: React.ReactNode }) {
  const auth = useAuthStore();
  if (auth.auth.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

// Main App Component
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <NavigationProgress />
        <Routes>
          {/* Public Routes */}
          <Route
            path="/sign-in"
            element={
              <AuthRedirect>
                <SignIn />
              </AuthRedirect>
            }
          />
          <Route path="/two-fa-verify" element={<TwoFAVerify />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/otp" element={<Otp />} />

          {/* Error Routes */}
          <Route path="/401" element={<UnauthorizedError />} />
          <Route path="/403" element={<ForbiddenError />} />
          <Route path="/404" element={<NotFoundError />} />
          <Route path="/500" element={<GeneralError />} />
          <Route path="/503" element={<MaintenanceError />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <AuthGuard>
                <AuthenticatedLayout />
              </AuthGuard>
            }
          >
            {/* Dashboard */}
            <Route index element={<Dashboard />} />

            {/* Issues Routes */}
            <Route
              path="issues"
              element={
                <ProtectedRoute>
                  <IssuesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="issues/:id"
              element={
                <ProtectedRoute>
                  <IssuesDetailPage />
                </ProtectedRoute>
              }
            />

            {/* Trainers Routes */}
            <Route
              path="trainers"
              element={
                <ProtectedRoute>
                  <TrainersPage />
                </ProtectedRoute>
              }
            />

            {/* Events Routes */}
            <Route
              path="events"
              element={
                <ProtectedRoute>
                  <EventsIndexPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="events/create"
              element={
                <ProtectedRoute requiredRoles={["super_admin"]}>
                  <CreateEventPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="events/:id/edit"
              element={
                <ProtectedRoute requiredRoles={["super_admin"]}>
                  <EditEventPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="events/:id"
              element={
                <ProtectedRoute>
                  <EventDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="my-sessions"
              element={
                <ProtectedRoute requiredRoles={["Municipal_Officer"]}>
                  <MySessionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="attendance/:sessionId"
              element={
                <ProtectedRoute
                  requiredRoles={["Municipal_Officer", "super_admin", "collector"]}
                >
                  <AttendancePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="my-events"
              element={
                <ProtectedRoute requiredRoles={["Municipal_Officer"]}>
                  <MyEventsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="reports"
              element={
                <ProtectedRoute
                  requiredRoles={["municipal_officer", "admin", "collector"]}
                >
                  <ReportsIndexPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="reports/events/:id"
              element={
                <ProtectedRoute
                  requiredRoles={["municipal_officer", "admin", "collector"]}
                >
                  <ReportEventDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="trainers/create"
              element={
                <ProtectedRoute>
                  <CreateTrainerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="trainers/:id/edit"
              element={
                <ProtectedRoute>
                  <EditTrainerPage />
                </ProtectedRoute>
              }
            />

            {/* Users Routes */}
            {/* <Route
              path="users"
              element={
                <ProtectedRoute requiredRoles={["collector"]}>
                  <UsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="users/create"
              element={
                <ProtectedRoute requiredRoles={["collector"]}>
                  <CreateUserPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="users/:userId/edit"
              element={
                <ProtectedRoute requiredRoles={["collector"]}>
                  <EditUserPage />
                </ProtectedRoute>
              }
            /> */}

            {/* Settings Routes */}
            <Route
              path="settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="account" replace />} />
              <Route path="account" element={<SettingsAccount />} />
              <Route path="appearance" element={<SettingsAppearance />} />
              <Route path="security" element={<SettingsSecurity />} />
              <Route
                path="two-factor-authentication"
                element={<SettingsTwoFA />}
              />
            </Route>

            {/* Admin Routes */}
            <Route
              path="administrators"
              element={
                <ProtectedRoute requiredRoles={["admin"]}>
                  <AdminsPage />
                </ProtectedRoute>
              }
            />
            {/* Collectors Routes */}
            <Route
              path="collectors"
              element={
                <ProtectedRoute requiredRoles={["admin"]}>
                  <CollectorsPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<NotFoundError />} />
        </Routes>

        {/* Sonner Toaster for notifications */}
        <Toaster duration={5000} />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
