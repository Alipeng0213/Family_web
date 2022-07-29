import { dynamicWrapper, createRoute } from '@/utils/core';

const routesConfig = (app) => ({
  path: '/main/user/center',
  title: '个人中心',
  component: dynamicWrapper(app, [], () => import('./components'))
});

export default (app) => createRoute(app, routesConfig);
