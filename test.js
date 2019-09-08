let express = require('express');
let mongodb = require('mongodb');
let sanitizeHTML = require('sanitize-html');
let ourApp = express();
let db;
let port = process.env.PORT;
if(!port) {
    port = 3000;
}
ourApp.use(express.static('public'))

let connectionString = "mongodb+srv://todoListAppUser:wpUsAJPpcMK9fv4I@guru-full-stack-2kbcv.mongodb.net" +
        "/todoList?retryWrites=true&w=majority";

mongodb.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, client) => {
    db = client.db();
    ourApp.listen(port);
})
//wpUsAJPpcMK9fv4I
//todoListAppUser
ourApp.use(express.json());
ourApp.use(express.urlencoded({extended: false}));

function passwordProtected(req, res, next) {
    res.set('WWW-Authenticate', 'Basic realm="simple todo app"')
    if(req.headers.authorization == 'Basic YWRtaW46YWRtaW4=') {
        next();
    } else {
        res.status(401).send('invalid login');
    }
}
ourApp.use(passwordProtected);

ourApp.get('/',   (req, response) => {
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
            <form id="frmToDoList" method="POST" action="/create-item">
                <div class="d-flex align-items-center">
                <input id="txtToDoItem" name="txtToDoItem" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
                <button id="btnAddNew" class="btn btn-primary">Add New Item</button>
                </div>
            </form>
            </div>
            <ul id="ulItemList" class="list-group pb-5">
            </ul>
            
        </div>
        <script>
                let items = ${JSON.stringify(items)};
        </script>
        <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
        <script src="browser.js"></script>
        </body>
        </html>`);
    });
});

ourApp.post('/create-item', (req, res) => {
    let safeText = sanitizeHTML(req.body.txtToDoItem, {allowedTags:[], allowedAttributes: {}, });
    db.collection('items')
        .insertOne({text: safeText, createdOn: new Date()}, (err, info) => {
            console.log(info.ops[0]);
            res.json(info.ops[0]);
        });
});

ourApp.post('/update-item', (req, res) => {
    let safeText = sanitizeHTML(req.body.txtToDoItem, {allowedTags:[], allowedAttributes: {}, });
    db.collection('items').findOneAndUpdate({_id: new mongodb.ObjectID(req.body.id)}, {$set: {text: safeText, updatedOn: new Date()}}, ()=> {
        res.send('success');
    });
});

ourApp.post('/delete-item', (req, res) => {
    db.collection('items').deleteOne({_id: new mongodb.ObjectID(req.body.id)}, () => {
        res.send('success');
    })
});

