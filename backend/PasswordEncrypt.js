
//bcrypt tutorial 1 https://www.youtube.com/watch?v=AzA_LTDoFqY
/*
import bcrypt from 'bcrypt'
import express from 'express'

const app = express()
app.use(express.json())

const users = [] //dummy array

app.post('/signup', async (req, res) => {
    const {username, password } = req.body
    const hash = await bcrypt.hash(password,13)
    users.push({
        username,
        password: hash
    })

    console.log(users)
    res.send('success')
})

//tutorial uses thundercloud as dummy database
app.post('/login', async (req, res) => {
    const { username, password } = req.body
    const user = users.find(u => u.username === username)
    if (!user) {
        res.send("no user")
        return
    }
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
        res.send("wrong password")
        return
    }

})

app.listen(8080, () => console.log('listening 8080'))
*/

//tutorial 2 https://www.youtube.com/watch?v=ywlEPtiaHZg
//tutorial demonstrates using bcrypt by creating an app.js/password.js file

/*import React from 'react';
import PasswordEncrypt from './PasswordEncrypt';
function App(){
    return(
        <PasswordEncrypt>

        </PasswordEncrypt>
    )
}*/