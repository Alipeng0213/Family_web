import { dynamicWrapper, createRoute } from '@/utils/core';

const routesConfig = (app) => ({
  path: '/index',
  title: '首页',
  component: dynamicWrapper(app, [], () => import('./components')),
});

export default (app) => createRoute(app, routesConfig);
