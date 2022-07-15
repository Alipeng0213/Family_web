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
                    path = "/connect/token?client_id=client_1&client_secret=123456&scope=select&grant_type=password";
                    return path
                }
            }
            ,onProxyRes: async (proxyRes, req, res) => {
                let body = [];
                proxyRes.on('data', function (chunk) {
                    body.push(chunk);
                });
                proxyRes.on('end', function () {
                    body = Buffer.concat(body).toString();
                    let data = JSON.parse(body);
                    res.json({
                        code: 200,
                        data: {
                            user: data.user.name,
                            access_token: data.access_token,
                            refresh_token: data.refresh_token,
                            expiration: data.expiration
                        }
                    })
                });
            }
        })
    );


};