import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "./lib/auth";
import Layout from "./components/Layout";
import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Lazy load components for better performance
const Home = React.lazy(() => import("./pages/Home"));
const Login = React.lazy(() => import("./pages/Login"));
const OTPVerification = React.lazy(() => import("./pages/OTPVerification"));
const LivenessCheck = React.lazy(() => import("./pages/LivenessCheck"));
const Vote = React.lazy(() => import("./pages/Vote"));
const Explorer = React.lazy(() => import("./pages/Explorer"));
const NotFound = React.lazy(() => import("./pages/not-found"));

// Loading component
const LoadingSpinner = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <Loader2 className="h-10 w-10 animate-spin text-primary" />
  </div>
);

// Protected Route wrapper
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  React.useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('intendedPath', window.location.pathname);
      setLocation('/login');
    }
  }, [isAuthenticated, setLocation]);

  return isAuthenticated ? <Component /> : null;
}

function Router() {
  return (
    <Layout>
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/otp" component={OTPVerification} />
            <Route path="/liveness">
              {() => <ProtectedRoute component={LivenessCheck} />}
            </Route>
            <Route path="/vote">
              {() => <ProtectedRoute component={Vote} />}
            </Route>
            <Route path="/explorer" component={Explorer} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;