const Express = require("express");
const Dotenv = require("dotenv");
const IndexRouter = require("./routes/index.js")

const app = Express();

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.use('/', IndexRouter);

//404
app.use((req, res) => {
  res.status(404).send("Hé, deze endpoint bestaat niet!");
});

const port = parseInt(process.env.PORT) || 3012;

app.listen(port, () => {
  console.log(`🍿 Express running → PORT ${port}`);
});
