import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter, Redirect } from 'wouter';

import LandingPage from '@/pages/Landing';
import LoginPage from '@/pages/Login';
import RegisterPage from '@/pages/Register';
import DashboardPage from '@/pages/Dashboard';
import ShowroomPage from '@/pages/Showroom';
import InvestPage from '@/pages/Invest';
import DepositPage from '@/pages/Deposit';
import WithdrawPage from '@/pages/Withdraw';
import TransactionsPage from '@/pages/Transactions';
import AdminOverview from '@/pages/admin/Overview';
import AdminUsers from '@/pages/admin/Users';
import AdminOrders from '@/pages/admin/Orders';
import AdminTransactions from '@/pages/admin/Transactions';
import ChangePasswordPage from '@/pages/ChangePassword';
import OrdersPage from '@/pages/Orders';
import GiveawayEntriesPage from '@/pages/GiveawayEntries';
import DigitalAssetsPage from '@/pages/DigitalAssets';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/showroom" component={ShowroomPage} />
      <Route path="/invest" component={InvestPage} />
      <Route path="/deposit" component={DepositPage} />
      <Route path="/withdraw" component={WithdrawPage} />
      <Route path="/transactions" component={TransactionsPage} />
      <Route path="/change-password" component={ChangePasswordPage} />
      <Route path="/orders" component={OrdersPage} />
      <Route path="/entries" component={GiveawayEntriesPage} />
      <Route path="/assets" component={DigitalAssetsPage} />
      {/* Admin */}
      <Route path="/admin/overview" component={AdminOverview} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/admin/orders" component={AdminOrders} />
      <Route path="/admin/transactions" component={AdminTransactions} />
      {/* Public */}
      <Route path="/" component={LandingPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
