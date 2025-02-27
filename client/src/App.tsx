import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import OTPVerification from "./pages/OTPVerification";
import LivenessCheck from "./pages/LivenessCheck";
import Vote from "./pages/Vote";
import Explorer from "./pages/Explorer";
import NotFound from "./pages/not-found";

function Router() {
  const [, setLocation] = useLocation();

  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/otp" component={OTPVerification} />
        <Route path="/liveness" component={LivenessCheck} />
        <Route path="/vote">
          {() => {
            const nin = localStorage.getItem('userNIN');
            if (!nin) {
              localStorage.setItem('intendedPath', '/vote');
              setLocation('/login');
              return null;
            }
            return <Vote />;
          }}
        </Route>
        <Route path="/explorer" component={Explorer} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;