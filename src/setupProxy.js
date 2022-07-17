const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        createProxyMiddleware('/api', {
            target: 'http://localhost:8080',
            changeOrigin: true,
            pathRewrite: {
                '^/api': ''
            }
        })
    );
    app.use(
        createProxyMiddleware('/power/login', {
            target: 'http://localhost:8080',
            changeOrigin: true,
            selfHandleResponse : true,
            pathRewrite: async function (path, req) {
                if(path == "/power/login") {
                    path = "/connect/token?client_id=a3bdc0c84ef14b7a&client_secret=49eb8809e4d6a5700f82aa2b4cd2f8c9&scope=select&grant_type=password";
                    return path
                }
            }
        })
    );

};