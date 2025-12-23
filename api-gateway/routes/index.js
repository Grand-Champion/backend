const Express = require("express");
const { createProxyMiddleware, fixRequestBody } = require("http-proxy-middleware");
const { ingelogd, metRol, token } = require("../middleware/authentication");
const { getUsers, getUser, updateUser, createUser, deleteUser, login, refreshToken, updatePassword } = require("../controllers/userController");

const router = Express.Router();

const forests_port = parseInt(process.env.FORESTS_PORT, 10) || 3012;
const forests_ip = process.env.FORESTS_IP || "forests";

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

router.use('/forests', forestProxyMiddleware);

//gebruiker zelf
router.get("/users/me", token, ingelogd, getUser);
router.patch("/users/me", token, ingelogd, updateUser);
router.delete("/users/me", token, ingelogd, deleteUser);
router.post("/token", token, ingelogd, refreshToken);
router.patch("/users/me/password", token, ingelogd, updatePassword);

//admin
router.get("/users", token, ingelogd, metRol("admin"), getUsers);
router.get("/users/:id", token, ingelogd, metRol("admin"), getUser);
router.patch("/users/:id", token, ingelogd, metRol("admin"), updateUser);
router.delete("/users/:id", token, ingelogd, metRol("admin"), deleteUser);

//iedereen
router.post("/users", token, createUser);
router.post("/login", login);


module.exports = router;