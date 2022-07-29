import React from 'react';
import { dynamic, router } from 'dva';
import $$ from 'cmn-utils';
import config from '@/config';
const { Route, Switch, Redirect } = router;

/**
 * 生成动态组件
 * @param {*} app
 * @param {*} models
 * @param {*} component
 */
export const dynamicWrapper = (app, models, component) =>
  dynamic({
    app,
    models: () => models,
    component
  });


/**
 * 生成一组路由
 * @param {*} app
 * @param {*} routesConfig
 */
export const createRoutes = (app, routesConfig) => {
  if(typeof routesConfig == "function") {
    routesConfig = routesConfig(app)
  }
  const routes = routesConfig.map(config => createRoute(app, config))
      .reduce((p, n) => {
        if (n.length) {
          return [...p, ...n];
        } else {
          return p.concat(n);
        }
      }, []);
  return <Switch>{routes}</Switch>;
};

// 路由映射表
window.dva_router_pathMap = {};

/**
 * 生成单个路由
 * @param {*} app
 * @param {*} routesConfig
 */
export const createRoute = (app, routesConfig) => {
  if(typeof routesConfig == "function") {
    routesConfig = routesConfig(app)
  }
  let {
    component: Comp,
    path,
    indexRoute,
    title,
    exact,
    ...otherProps
  } = routesConfig;

  // 生成子路由
  if (otherProps.childRoutes && otherProps.childRoutes.length) {
    let childRoutes = otherProps.childRoutes;
    let childRoutes2 = childRoutes.filter(route => route.title)
    let childRoutes1 = childRoutes.filter(route => !route.title)
    otherProps.childRoutes = childRoutes1
    let children = createRoutes(null, childRoutes2).props.children;
    children.forEach(route=> otherProps.childRoutes.push(route))

  }

  if (path && path !== '/') {
    // 为路由生产parentPath
    if (otherProps.childRoutes && otherProps.childRoutes.length) {
      otherProps.childRoutes.forEach(item => {
        if (window.dva_router_pathMap[item.key]) {
          window.dva_router_pathMap[item.key].parentPath = path;
        }
      });
    }
    window.dva_router_pathMap[path] = { path, title, ...otherProps };
  }

  // 把Redirect放到第一个
  if (indexRoute && $$.isArray(otherProps.childRoutes)) {
    otherProps.childRoutes.unshift(
        <Redirect key={path + '_redirect'} exact from={path} to={indexRoute} />
    );
  }

  const routeProps = {
    key: path || $$.randomStr(4),
    render: props => {
      setDocumentTitle(title);
      return <Comp routerData={otherProps} {...props} />
    }
  };

  return <Route path={path} exact={!!exact} {...routeProps} />;
};

/**
 * 设置页面title
 * @param {*} title 
 */
function setDocumentTitle(title) {
  const documentTitle = config.htmlTitle ? config.htmlTitle.replace(/{.*}/gi, title) : title
  if (documentTitle !== document.title) {
    document.title = documentTitle;
  }
}
