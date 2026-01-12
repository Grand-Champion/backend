const Express = require("express");
require('dotenv').config();
const IndexRouter = require("./routes/index.js");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler.js");

const app = Express();
app.use(cors());
app.use(Express.json({ limit: "5mb" }));
app.use(Express.urlencoded({ extended: true, limit: "5mb" }));

app.use('/', IndexRouter);

//404
app.use((req, res) => {
    res.status(404).send("Hé, deze endpoint bestaat niet!");
});

app.use(errorHandler);

const port = parseInt(process.env.GATEWAY_PORT, 10) || 3011;

app.listen(port, () => {
    console.log(`🍿 Express running → PORT ${port}`);
});