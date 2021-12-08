import { IRouterConfig, lazy } from 'ice';
import UserLayout from '@/layouts/UserLayout';
import BasicLayout from '@/layouts/BasicLayout';
import LoginWrapperPage from '@/components/LoginWrapperPage';

// const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Dashboard = lazy(() => import(/* webpackChunkName: 'dashboard' */'@/pages/Dashboard'));
// const Login = lazy(() => import('@/pages/Login'));
const Login = lazy(() => import(/* webpackChunkName: 'user-login' */'@/pages/Login'));
const routerConfig: IRouterConfig[] = [
  {
    path: '/user',
    component: UserLayout,
    children: [
      {
        path: '/login',
        component: Login,
      },
      {
        path: '/',
        redirect: '/user/login',
      },
    ],
  },
  {
    path: '/',
    component: BasicLayout,
    wrappers: [LoginWrapperPage],
    children: [
      { path: '/', exact: true, component: Dashboard },
    ],
  },
];

export default routerConfig;
