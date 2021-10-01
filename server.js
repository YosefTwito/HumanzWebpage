
const express = require('express');
var cors = require('cors');
const axios = require('axios');
const app = express();
app.use(express.json());
app.use(cors());

app.use(cors({
    origin: '*'
}));


// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'file:///C:/Users/Yos/Desktop/SimpleWebsite/index.html');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// var XMLHttpRequest = require('xhr2');
// var http = new XMLHttpRequest();


function is_israeli_id_number(id) {
    id = String(id).trim();
    if (id.length > 9 || isNaN(id)) return false;
    id = id.length < 9 ? ("00000000" + id).slice(-9) : id;
    return Array.from(id, Number).reduce((counter, digit, i) => {
        const step = digit * ((i % 2) + 1);
        return counter + (step > 9 ? step - 9 : step);
    }) % 10 === 0;
}

// Database Connection
const mongoose = require('mongoose');
const config = require('config');
const dbConfig = config.get('dbUser.dbConfig.dbName')

mongoose.connect(dbConfig).then(() => {
    console.log('Database Connected');
}).catch(err => {
    console.log('Database not Connected');
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// First data Upload
// db.once('open', function() {
//     console.log("Connection Successful!");
//     var clientSchema = mongoose.Schema({
//         name: String,
//         id: Number,
//         ip: String,
//         phone: String,
//         city: String,
//         country: String
//       });

//     var Client = mongoose.model('Client', clientSchema, 'customers');

//     const lineReader = require('line-reader');
//     lineReader.eachLine('Sample Data.txt',async(line,last)=>{
//         const temp = line.split(',');
//         await new Promise(r => setTimeout(r, 10));
//         try {
//             const locAPI = await axios.get(`http://ip-api.com/json/${temp[2]}?fields=country,city`).then(loc => {
//                 var client1 = new Client({ name: temp[0], id: temp[1], ip: temp[2], phone: temp[3].slice(1, -1), city: loc.data.city, country: loc.data.country });
//                 client1.save();
//             });
//         } catch (error) {
//             // console.log(error);
//         }
//         // console.log(client1);
//     })
// });

// setTimeout(() => console.log(cities), 4000);


// Main Page - what to do???????????????????????????????????????????????????????????????????????
app.get('/', (req, res) => {
    res.send('hello world');
});

// Show the existing clients
app.get('/clients/', cors(), (req, res) => {
    db.collection('customers').find().toArray().then(products => {
        res.json({res: products});
    });
});

// Filter the clients
app.get('/clients/id/:id', cors(), (req, res, next) => {
    var query = { id: parseInt(req.params.id) };
    db.collection('customers').find(query).toArray().then(products => {
        if (!products || products.length == 0) {
            res.status(404).json({res: 'The specified ID can not be found' });
            return;
        }
        // console.log(products);
        res.json({res: products})
        // res.send(products);
    });
});

app.get('/clients/ip/:ip', cors(), (req, res) => {
    var query = { ip: req.params.ip };
    db.collection('customers').find(query).toArray().then(products => {
        if (!products || products.length == 0) {
            res.status(404).json({res: 'The specified IP can not be found'});
            return;
        }
        res.json({res: products });
    });
});

app.get('/clients/phone/:phone', cors(), (req, res) => {
    var query = { phone: req.params.phone };
    db.collection('customers').find(query).toArray().then(products => {
        if (!products || products.length == 0) {
            res.status(404).json({res: 'The specified Phone can not be found'});
            return;
        }
        res.json({res: products});
    });
});

app.get('/clients/name/:name', cors(), (req, res) => {
    var query = { name: req.params.name };
    db.collection('customers').find(query).toArray().then(products => {
        if (!products || products.length == 0) {
            res.status(404).json({res: 'The specified Name can not be found'});
            return;
        }
        res.json({res: products});
    });
});

app.get('/clients/firstname/:name', cors(), (req, res) => {
    const temp = '^' + req.params.name;
    var query = ({ name: { $regex: temp, $options: "i" } });
    db.collection('customers').find(query).toArray().then(products => {
        if (!products || products.length == 0) {
            res.status(404).json({res: 'The specified Name can not be found'});
            return;
        }
        res.json({res: products});
    });
});

app.get('/clients/lastname/:name', cors(), (req, res) => {
    const temp = req.params.name + '$';
    var query = ({ name: { $regex: temp, $options: "i" } });
    db.collection('customers').find(query).toArray().then(products => {
        if (!products || products.length == 0) {
            res.status(404).json({res: 'The specified Name can not be found'});
            return;
        }
        res.json({res: products});
    }).catch(err => { });
});

app.get('/clients/city/:name', cors(), (req, res) => {
    var query = { city: req.params.name };
    db.collection('customers').find(query).toArray().then(products => {
        if (!products || products.length == 0) {
            res.status(404).json({res: 'The specified Name can not be found'});
            return;
        }
        res.json({res: products});
    });
});

app.get('/clients/country/:name', cors(), (req, res) => {
    var query = { country: req.params.name };
    db.collection('customers').find(query).toArray().then(products => {
        if (!products || products.length == 0) {
            res.status(404).json({res: 'The specified Name can not be found'});
            return;
        }
        res.json({res: products});
    });
});


// Add clients
app.post('/clients/post', cors(), async(req, res) => {
    // console.log("got to post route!!!!!");
    var _name = req.body.name;
    var _id = req.body.id;
    var _ip = req.body.ip;
    var _phone = req.body.phone
    // Validate name
    if (!req.body.name || req.body.name.length < 3) {
        res.status(400).json({res: 'Name is required and should be minimum 3 chars' });
        return;
    }
    // Validate ip
    var ip_splited = _ip.split('.');
    if (!req.body.ip || ip_splited.length != 4) {
        res.status(400).json({res: 'IP number is not Valid'});
        return;
    }
    if (!req.body.ip) { console.log("wtf?"); }
    ip_splited.forEach(element => {
        if (!(parseInt(element, 10) == element) || element > 255 || element < 0) {
            res.status(400).json({res: 'IP number is not Valid'});
            return;
        }
    });
    // Validate phone
    var phone_splitted = _phone.split('-');
    if (phone_splitted.length != 2 || phone_splitted[1].length != 9 || phone_splitted[0].length != 4 || !(parseInt(phone_splitted[1], 10) == phone_splitted[1]) || phone_splitted[0].charAt(0) != '+' || !(parseInt(phone_splitted[0].substring(1), 10) == phone_splitted[0].substring(1))) {
        res.status(400).json({res: 'Phone number is not Valid'});
        return;
    }
    // Validate id
    if (!is_israeli_id_number(_id)) {
        res.status(400).json({res: 'ID number is not Valid'});
        return;
    }

    try {
        const locAPI = await axios.get(`http://ip-api.com/json/${_ip}?fields=country,city`).then(loc => {
            const client = {
                name: _name,
                id: _id,
                ip: _ip,
                phone: _phone,
                city: loc.data.city,
                country: loc.data.country
            };
            // console.log(req.body);
            db.collection('customers').insertOne({ name: _name, id: _id, ip: _ip, phone: _phone, city: loc.data.city, country: loc.data.country });
            res.json({res: 'New client added successfully'});
        });
    } catch (error) {
        console.log(error);
    }
});

// Remove clients
app.delete('/clients/delete/:id', cors(), (req, res) => {
    var query = { id: parseInt(req.params.id) };
    db.collection('customers').find(query).toArray().then(products => {
        if (!products || products.length == 0) {
            res.status(400).json({res: 'The specified ID can not be found and deleted'});
            return;
        }
        else {
            db.collection('customers').deleteOne(query);
            res.json({res: "Client deleted successfully" });
        }
    }).catch(err => {
        console.log(err);
    })
});


// PORT
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening port ${port}....`));


// server.listen(port, () => console.log(`Listening port ${port}....`));

// app.get('/products/:id', function (req, res, next) {
//     res.json({ msg: 'This is CORS-enabled for all origins!' })
// })

// app.listen(5000, function () {
//     console.log('CORS-enabled web server listening on port 5000')
// })