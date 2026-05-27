import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Providers } from './pages/Providers';
import { Clients } from './pages/Clients';
import { Services } from './pages/Services';
import { Permissions } from './pages/Permissions';
import { LogLinkage } from './pages/LogLinkage';
import { LogLicense } from './pages/LogLicense';
import { AuditLog } from './pages/AuditLog';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'providers', Component: Providers },
      { path: 'clients', Component: Clients },
      { path: 'services', Component: Services },
      { path: 'permissions', Component: Permissions },
      { path: 'log-linkage', Component: LogLinkage },
      { path: 'log-license', Component: LogLicense },
      { path: 'audit', Component: AuditLog },
    ],
  },
]);
