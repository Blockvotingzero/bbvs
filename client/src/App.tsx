
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Router } from "wouter";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Vote from "./pages/Vote";
import Results from "./pages/Results";
import LivenessCheck from "./pages/LivenessCheck";
import { Toaster } from "./components/ui/toaster";

// Mock data that will later be replaced with blockchain API calls
import { mockCandidates, mockVotes } from "./mockData";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

// Initialize mock data
queryClient.setQueryData(["candidates"], mockCandidates);
queryClient.setQueryData(["votes"], mockVotes);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Route path="/" component={Home} />
          <Route path="/vote" component={Vote} />
          <Route path="/results" component={Results} />
          <Route path="/liveness-check" component={LivenessCheck} />
        </Layout>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}
