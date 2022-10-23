const express = require('express');
const morgan = require('morgan');
const fs = require('fs');

// connecting "docs.json" file
const Docs = require('./docs.json');

const app = express();

app.use(morgan('dev'))
app.use(express.json())

app.get('/', (req, res) => {
   res.sendFile(__dirname + '/instruct.txt')
})

// to show all the data
app.get('/api/users', (req, res) => {
    res.send(Docs);
})

// to show data with 'id'
app.get('/api/users/id/:id', (req, res) => {
    let result = Docs.find(Element => Element.id == req.params.id);
    if(result) {
        res.send(result)
    }
    else {
        res.send(`No user found with id: ${req.params.id}.`)
    }
})
// to show data with 'username'
app.get('/api/users/username/:username', (req, res) => {
    let result = Docs.find(Element => Element.username == req.params.username);
    if(result) {
        res.send(result)
    }
    else {
        res.send(`No user found with username: ${req.params.username}.`)
    }
})

// to add a new user
app.post('/api/users', (req, res) => {
    let reqbody = req.body;
    console.log(reqbody.name);
    // res.send(reqbody)
    let newUser = {
        id: req.body.id,
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        company : {
            companyName: req.body.company.companyName,
            catchPhrase: req.body.company.catchPhrase,
            bs: req.body.company.bs
        }
    }
    console.log(newUser);
    Docs.push(newUser)

    fs.writeFile(__dirname + '/docs.json', JSON.stringify(Docs), (err) => {
        if(err) {
            res.redirect('/api/users')
        }
        else{
            res.send(`User added successfully`);
        }
    })
})

// to update user's info using their 'username'
app.put('/api/users/username/:username', (req, res) => {
    let result = Docs.find(Element => Element.username == req.params.username);
    if(result) {
        result.username = req.body.username;
        // let index = Docs.indexOf(result);
        // Docs[index].username = req.body.username;
        res.json(result)
        
        // res.send(`Usernamed changed see .. 
        // {
        //     id: ${result.id},
        //     name: ${result.name},
        //     username: ${result.username},
        //     email: ${result.email},
        //     company: {
        //         companyName: ${result.company.companyName},
        //         catchPhrase: ${result.company.catchPhrase},
        //         bs: ${result.company.bs}
        //     }
        // }`)
    }
})

// to delete a user
app.delete('/api/users/id/:id', (req, res) => {
    let result = Docs.find(Element => Element.id == req.params.id);
    if(result) {
        let index = Docs.indexOf(result);
        Docs.splice(index, 1);
        res.send('User Deleted.')
    }
})

app.listen(3000, () => {
    console.log(`server running at http://localhost:3000`);
})