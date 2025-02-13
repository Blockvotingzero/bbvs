import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Vote from "./pages/Vote";
import OtpVerification from "./pages/OtpVerification";
import Explorer from "./pages/Explorer";
import FacialVerification from "./pages/FacialVerification";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/vote" component={Vote} />
        <Route path="/otp-verification" component={OtpVerification} />
        <Route path="/explorer" component={Explorer} />
        <Route path="/facial-verification" component={FacialVerification} />
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