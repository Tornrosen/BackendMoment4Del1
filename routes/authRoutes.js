//Routes för autentisering

const express = require("express");
const router = express.Router();
require("dotenv").config();
const bcrypt = require("bcrypt");

const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(process.env.DATABASE);


//Registrera användare
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        //Validera input
        if(username.length>5||email.length>5||password.length){
            return res.status(400).json({error: "Fyll i alla uppgifter med minst fem tecken!"})
        }
        //Hasha lösenord
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        //Om korrekt, spara användare
        const sql = "INSERT INTO users(username, email, password) VALUES (?, ?, ?);";
        db.run(sql, [username, email, hashedPassword], (error) => {
            if (error) {
                res.status(400).json({message: "Fel när användare skulle skapas."})
            } else {
                res.status(201).json ({message: "Användare skapad."})
            }

        });
    }catch (error){
        res.status(500).json({error: "Serverfel"});
    }
});

//Logga in användare
router.post("/login", async (req, res) => {
    try { 
        const { username, password } = req.body;
        //Validera input
        if(username.length>5||password.length){
            return res.status(400).json({error: "Fyll i användarnamn och lösenord!"})
        }
        //Kolla att inloggningsuppgifterna stämmer
       const sql = "SELECT * FROM users WHERE username =?"
       db.get (sql, [username], async (error, row) => {
        if(error){
            res.status(400).json ({message: "Fel vid autentisering."})
        } else if(!row) {
            res.status(401).json({message: "Felaktigt användarnamn eller lösenord."})
        } else {
            const passwordMatch = await bcrypt.compare(password, row.password);
            if(!passwordMatch) {
                res.status(401).json({message: "Felaktigt användarnamn eller lösenord."})
            } else {
                res.status(200).json({message: "Korrekta inloggningsuppgifter."})
            }
        }
       })

    } catch (error){
        res.status(500).json({error: "Serverfel"});
    }
})

module.exports = router;