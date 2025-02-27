import { Route, Router, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import Home from './pages/Home';
import Vote from './pages/Vote';
import Results from './pages/Results';
import './index.css';
import { ToastProvider } from './components/ui/use-toast';
import { Toaster } from './components/ui/toaster';
import Login from "./pages/Login";
import OTPVerification from "./pages/OTPVerification";
import LivenessCheck from "./pages/LivenessCheck";
import Explorer from "./pages/Explorer";
import NotFound from "./pages/not-found";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <Router>
          <Layout>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/otp" component={OTPVerification} />
              <Route path="/liveness" component={LivenessCheck} />
              <Route path="/vote" component={Vote} />
              <Route path="/results" component={Results} />
              <Route path="/explorer" component={Explorer} />
              <Route component={NotFound} />
            </Switch>
          </Layout>
        </Router>
        <Toaster />
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;