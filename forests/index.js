const Express = require("express");
const Dotenv = require("dotenv");
const IndexRouter = require("./routes/index.js");
const errorHandler = require("./middleware/errorHandler.js");

const app = Express();

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.use('/api/v1/', IndexRouter);

app.get('/', (req, res)=>{
  res.send("Je de forests-api werkt!");
});

//404
app.use((req, res) => {
  res.status(404).send("Hé, deze endpoint bestaat niet!");
});

app.use(errorHandler);

const port = parseInt(process.env.PORT) || 3012;

app.listen(port, () => {
  console.log(`🍿 Express running → PORT ${port}`);
});
