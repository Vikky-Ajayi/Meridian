import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { Layout } from '@/components/layout/Layout';

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [location]);
  return null;
}

import Home from '@/pages/Home';
import About from '@/pages/About';
import AMLPolicy from '@/pages/AMLPolicy';
import MoveMoneyAbroad from '@/pages/MoveMoneyAbroad';
import MoveMoneySuccess from '@/pages/MoveMoneySuccess';
import PrivateBankingIntroduction from '@/pages/PrivateBankingIntroduction';
import PrivateBankingSuccess from '@/pages/PrivateBankingSuccess';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/move-money-abroad" component={MoveMoneyAbroad} />
      <Route path="/move-money-success" component={MoveMoneySuccess} />
      <Route path="/private-banking-introduction" component={PrivateBankingIntroduction} />
      <Route path="/private-banking-success" component={PrivateBankingSuccess} />
      <Route path="/">
        <Layout><Home /></Layout>
      </Route>
      <Route path="/about">
        <Layout><About /></Layout>
      </Route>
      <Route path="/aml-policy">
        <Layout><AMLPolicy /></Layout>
      </Route>
      <Route>
        <Layout><NotFound /></Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <ScrollToTop />
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
