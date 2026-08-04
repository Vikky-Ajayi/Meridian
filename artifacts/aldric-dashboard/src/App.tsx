import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter, Redirect } from 'wouter';
import { AuthProvider, useAuth } from '@/lib/auth-context';

import RegisterCapabilityPublic from '@/pages/RegisterCapabilityPublic';
import SubmitRequirementPublic from '@/pages/SubmitRequirementPublic';
import DashboardHome from '@/pages/DashboardHome';
import RegisterCapabilityDashboard from '@/pages/RegisterCapabilityDashboard';
import SubmitRequirementDashboard from '@/pages/SubmitRequirementDashboard';
import Profile from '@/pages/Profile';
import CapabilityDetail from '@/pages/CapabilityDetail';
import RequirementDetail from '@/pages/RequirementDetail';

const queryClient = new QueryClient();

function ProtectedRoute({ component: Comp }: { component: React.ComponentType }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Redirect to="/register-capability" />;
  return <Comp />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Redirect to="/register-capability" />} />
      <Route path="/register-capability" component={RegisterCapabilityPublic} />
      <Route path="/submit-requirement" component={SubmitRequirementPublic} />
      <Route path="/dashboard" component={() => <ProtectedRoute component={DashboardHome} />} />
      <Route path="/dashboard/register-capability" component={() => <ProtectedRoute component={RegisterCapabilityDashboard} />} />
      <Route path="/dashboard/submit-requirement" component={() => <ProtectedRoute component={SubmitRequirementDashboard} />} />
      <Route path="/dashboard/profile" component={() => <ProtectedRoute component={Profile} />} />
      <Route path="/dashboard/capability/:id" component={() => <ProtectedRoute component={CapabilityDetail} />} />
      <Route path="/dashboard/requirement/:id" component={() => <ProtectedRoute component={RequirementDetail} />} />
      <Route component={() => <Redirect to="/register-capability" />} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
