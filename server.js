//Applikation för registrering och inloggning

const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");

require("dotenv").config();

const app=express();
const port=process.env.PORT||3000;

app.use(bodyParser.json);

//Routes

app.use("/api", authRoutes);

//Starta applikation

app.listen(port, () => {
    console.log("Server igång på port: " +port)
})

