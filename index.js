require('./db');
require('dotenv').config();

const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Manager = require('./modals/manager')
const fetchuser = require('./middleware/fetchuser')

const secretKey = process.env.SECTET_KEY;
const app = express()
const port = 5000

app.use(express.json())
app.use(cors())

const genauthtoken = async (user) => {
    const token = await jwt.sign({ id: user._id.toString() }, secretKey);
    return token;
}
const cookieobj = {
    expires: new Date(Date.now() + (24 * 60 * 60 * 1000)),
    httpOnly: true,
    // secure:true
}

app.get('/api/signup', async (req, res) => {
    try {
        // console.log(req.body);
        const tosave = new Manager({ ...req.body });
        const save = await tosave.save();
        const token = await genauthtoken(save);
        console.log(save);
        // const expirationDate = new Date();
        // expirationDate.setTime(expirationDate.getTime() + (24 * 60 * 60 * 1000));
        res.cookie("auth_token", token, cookieobj)
        res.send({ token });
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }
})

app.get('/api/login', async (req, res) => {
    try {
        let success = false;
        const { username, password } = req.body;
        let user = await Manager.findOne({ username });
        if (!user) {
            return res.status(400).json({ success, "errors": "User does not exist" });
        }
        const pswcompare = await bcrypt.compare(password, user.password);
        if (!pswcompare) {
            return res.status(400).json({ success, "errors": "Incorrect username/password" });
        }
        const token = await genauthtoken(user)
        res.cookie("auth_token", token, cookieobj)
        success = true;
        delete user.password;
        res.json({ success, token, user });

    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }
})

app.post('/api/login', fetchuser, async (req, res) => {
    try {
        console.log(req.user)
        const user = await Manager.findById(req.user.id).select("-password")
        console.log(user)
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.cookie("auth_token", req.user.token, cookieobj)
        // console.log(user)
        res.send(user)
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }
})

app.listen(port, () => {
    console.log(`Backend listening on port ${port}`)
})