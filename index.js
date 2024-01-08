const express = require("express");
const colors = require("colors");
const { UserRouter } = require("./Routes/user.routes");
const { connection } = require("./db");
const { auth } = require("./Middleware/Auth.middleware");
const { NotesRouter } = require("./Routes/notes.routes");
const cors = require('cors');
const { imageRouter } = require("./Routes/image.routes");
require("dotenv").config

const app = express();
const port = process.env.PORT ;

app.use(express.json()); 
app.use(cors())

app.use("/user", UserRouter);

app.use(express.static("uploads"))
app.use(express.static("Images"))
app.use("/img", imageRouter)


app.get("/", async (req, res) => {
  try {
    res.status(200).json({ msg: "I am in home route" });
  } catch (error) {
    res.status(500).json({ msg: "Error in home route" });
  }
});


// Auth ----> Middleware
app.use(auth)

// Notes Routes ---> Private routes
app.use("/notes", NotesRouter)

app.listen(port, async () => {
  try {
    await connection;
    console.log(colors.bgYellow(`connectd to mongo db`));
  } catch (error) {
    console.log(colors.bgRed("Error in connecting mongoDb"));
  }
  console.log(colors.rainbow(`Backend is running on port ${port}`));
});
