const Express = require("express");
const { createProxyMiddleware, fixRequestBody } = require("http-proxy-middleware");

const router = Express.Router();

const forestProxyMiddleware = createProxyMiddleware({
  target: 'http://forests:3012/',
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