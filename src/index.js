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
const paypal = require('paypal-rest-sdk');

const server = require('http').createServer(express);
const io = require('socket.io')(server);
const fs = require('fs');

const urlencodedParser = bodyParser.urlencoded({extended : true});
var cors = require('cors')
const app = express();
const port = 3001;

const route = require('./routes');
const db = require('./config/db');
const Cart = require('./app/controllers/models/Cart');
const sortMiddleware = require('./middlewares/sort.middleware');
const mobileUse = require('./mobile/mobileUse');
const routeAPI = require('./api/routes');

//Connect to DB
db.connect();

app.use(morgan('combined'))
app.use(express.static(path.join(__dirname, 'public')));


app.use(cors()) // Use this after the variable declaration

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

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'Aa74c5duEJAzu_CfU6sXiJk1AA1gX3DkZtMPe5LH0wED9CPxXp39V0ndRgs6XqHr0wQNm3cc_pWOPXoQ',
  'client_secret': 'EJp1YetESIhruWIQaY6pMkjZFJHCWC4PP25vjeMmcDQvNGq2A3nH-DA_Zb7nAh9LNnqD47UCz5lfHsTU'
});

route(app);
routeAPI(app);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})

mobileUse();