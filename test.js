let express = require('express');
let mongodb = require('mongodb');
let ourApp = express();
let db;
ourApp.use(express.static('public'))

let connectionString = "mongodb+srv://todoListAppUser:wpUsAJPpcMK9fv4I@guru-full-stack-2kbcv.mongodb.net" +
        "/todoList?retryWrites=true&w=majority";

mongodb.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, client) => {
    db = client.db();
    ourApp.listen(3000);
})
//wpUsAJPpcMK9fv4I
//todoListAppUser
ourApp.use(express.json());
ourApp.use(express.urlencoded({extended: false}));

ourApp.get('/', (req, response) => {
    db
        .collection('items')
        .find()
        .toArray((err, items) => {
            response.send(`<!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Simple To-Do App</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
        </head>
        <body>
        <div class="container">
            <h1 class="display-4 text-center py-1">To-Do App!!!</h1>
            
            <div class="jumbotron p-3 shadow-sm">
            <form method="POST" action="/create-item">
                <div class="d-flex align-items-center">
                <input name="txtToDoItem" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
                <button class="btn btn-primary">Add New Item</button>
                </div>
            </form>
            </div>
            <ul class="list-group pb-5">
            ${items.map((item) => {
                return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
                <span class="item-text">${item.text}</span>
                <div>
                <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
                <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
                </div>
            </li>`;}).join('')}
            
            </ul>
            
        </div>
        <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
        <script src="browser.js"></script>
        </body>
        </html>`);
    });
});

ourApp.post('/create-item', (req, res) => {
    db.collection('items')
        .insertOne({text: req.body.txtToDoItem, createdOn: new Date()}, () => {
            res.redirect('/');
        });
});

ourApp.post('/update-item', (req, res) => {
    console.log(req.body);
    db.collection('items').findOneAndUpdate({_id: new mongodb.ObjectID(req.body.id)}, {$set: {text: req.body.text, updatedOn: new Date()}}, ()=> {
        res.send('success');
    });
});

ourApp.post('/delete-item', (req, res) => {
    db.collection('items').deleteOne({_id: new mongodb.ObjectID(req.body.id)}, () => {
        res.send('success');
    })
});

