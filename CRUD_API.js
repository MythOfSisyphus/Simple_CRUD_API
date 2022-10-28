const express = require('express');
const morgan = require('morgan');
const fs = require('fs');

// connecting "docs.json" file
const Docs = require('./docs.json');

// express app
const app = express();

// middlewares
app.use(morgan('dev'))
app.use(express.json())

// app.use(express.urlencoded({extended: true}))

// app.use(express.static('public'))

// home page
app.get('/', (req, res) => {
   res.send('This is CRUD API.')
})

// to show all the data
app.get('/api/users', (req, res) => {
    res.send(Docs);
})

/* to show data with 'id' we just need to check is there any item in array of users which is our Docs with the given id
here 'req.params.id is telling us the ':id' which user types */
app.get('/api/users/id/:id', (req, res) => {
    let result = Docs.find(Element => Element.id == req.params.id);
    if(result) {
        res.send(result)
    }
    else {
        res.send(`No user found with id: ${req.params.id}.`)
    }
})
// to show data with 'username' just like 'id'
app.get('/api/users/username/:username', (req, res) => {
    let result = Docs.find(Element => Element.username == req.params.username);
    if(result) {
        res.send(result)
    }
    else {
        res.send(`No user found with username: ${req.params.username}.`)
    }
})

/* to add a new user 
This is an interesting part : Because to add a user we need to make an object of all his details and push it to 'Docs' 
But directly pushing does not gonna work, you can try and see. so to update our 'data.json' we need to make to use 
app.use(express.json()) middleware because it is inbuild middleware "t parses incoming JSON requests and puts the parsed data in req.body."
if you don't wanna use it there is another method 
just make an instance for 'Docs' like ' let Data = JSON.parse(Docs)' then push the newUser in Data then return using JSON.stringify() method.
*/
app.post('/api/users', (req, res) => {
    // let reqbody = req.body;

    // console.log(reqbody.name);
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

/* here to show user that his change is updated I first tried to print 'result' but i got to know that 'result' is in json and 
we can only print stringify method of that so i tried what i have commented here , but later I got to know that 
Express has method for that 'res.json(...)' so I thought why not use this. */

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

// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// app.get('/Postman', (req, res) => {
//     res.sendFile(__dirname + '/Client.html')
// })

app.listen(3000, () => {
    console.log(`server running at http://localhost:3000`);
})