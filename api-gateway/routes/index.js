const Express = require("express");
const { createProxyMiddleware, fixRequestBody } = require("http-proxy-middleware");

const router = Express.Router();

const forests_port = parseInt(process.env.FORESTS_PORT, 10) || 3012;
const forests_ip = parseInt(process.env.FORESTS_IP, 10) || "forests";

const forestProxyMiddleware = createProxyMiddleware({
    target: `http://${forests_ip}:${forests_port}/`,
    on: {
        proxyReq: fixRequestBody,
    },
    changeOrigin: true
});

router.get('/', (req, res) => {
    res.send('Je hebt de api-gateway bereikt!');
});

router.use('/forests', /*hier kan auth?, */forestProxyMiddleware);

module.exports = router;