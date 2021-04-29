const express = require('express')
const path = require('path');
const morgan = require('morgan')
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const Passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
var flash = require('connect-flash');
const sessionMiddleware = require('./middlewares/session.middleware');
const expressValidator = require('express-validator');
var flash = require('connect-flash');
const groupBy = require('handlebars-group-by');
const cartMiddleware = require('./middlewares/cart.middleware');

const server = require('http').createServer(express);
const io = require('socket.io')(server);
const fs = require('fs');

const urlencodedParser = bodyParser.urlencoded({extended : true});

const app = express();
const port = 3001;

const route = require('./routes');
const db = require('./config/db');
const Cart = require('./app/controllers/models/Cart');
const sortMiddleware = require('./middlewares/sort.middleware');
const mobileUse = require('./mobile/mobileUse');

//Connect to DB
db.connect();

app.use(morgan('combined'))
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded(
  {
    extended:true
  }
));

app.use(express.json());

app.use(express.static('public'));

app.use(methodOverride('_method'));

app.use(cookieParser('hoaibao123'));

app.use(sortMiddleware);

app.use(sessionMiddleware);

app.use(cartMiddleware);

app.use(expressValidator());

app.use(flash());

app.use(session({secret: 'max', saveUninitialized: false, resave: false}));

app.engine('hbs', handlebars({
  extname:'.hbs',
  helpers: require ('./helpers/handlebars')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

//console.log(__dirname)

route(app);


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})

//mobilerequest(io);

// io.on('connection', (socket) => {
//     console.log("Co nguoi connect ne");
//     socket.on('clientSendItems', (arg) => {
//         fs.readFile('items.json', (err, data) => {
//            if (err) throw err;
//            let items = JSON.parse(data);
//            io.emit('serverSendItems', items);
//         });
//     });
//     socket.on('clientSendItem', (arg) => {
//         let data = JSON.stringify(arg, null, 2);
//         fs.writeFile('item.json', data, (err) => {
//             if (err) throw err;
//             console.log(arg);
//         });
//     });
// });
// server.listen(3002);

mobileUse();