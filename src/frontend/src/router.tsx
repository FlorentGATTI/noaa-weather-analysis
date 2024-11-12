import { createBrowserRouter, RouteObject } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import WeatherPage from './pages/WeatherPage';
import AnalysisPage from './pages/AnalysisPage';
import SettingsPage from './pages/SettingsPage';
import DataPage from './pages/DataPage';
import MainLayout from './layouts/MainLayout';
import { AuthProvider } from './features/auth/AuthProvider';
import PrivateRoute from './components/common/PrivateRoute';

const routes: RouteObject[] = [
  {
    element: <AuthProvider />,
    children: [
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: '/',
        element: (
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        ),
        children: [
          {
            index: true,
            element: <DashboardPage />
          },
          {
            path: 'dashboard',
            element: <DashboardPage />
          },
          {
            path: 'weather',
            element: <WeatherPage />
          },
          {
            path: 'analysis',
            element: <AnalysisPage />
          },
          {
            path: 'data',
            element: <DataPage />
          },
          {
            path: 'settings',
            element: <SettingsPage />
          }
        ]
      }
    ]
  }
];

const router = createBrowserRouter(routes);

export default router;
