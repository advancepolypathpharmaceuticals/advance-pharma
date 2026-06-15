require("dotenv").config();

const express = require("express");
const app = express();

app.set("trust proxy", 1);

const hbs = require("hbs");
const session = require("express-session");

// Connect to DB
require("./db_connect");

// Body parser middleware to handle POST data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session setup (must come BEFORE res.locals usage)
app.use(session({
    secret: process.env.SESSION_SECRET_KEY || "default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
    }
}));


// Make current path and cart count available in templates
app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    res.locals.session = req.session;

    // Ensure session.cart always exists
    if (!req.session.cart) {
        req.session.cart = [];
    }

    res.locals.cartCount = req.session.cart.reduce(
        (sum, item) => sum + (item.quantity || 0), 0
    );

    next();
});


// Order stats middleware (AFTER session middleware)
const injectOrderStats = require("./middlewares/orderStatsMiddleware");
app.use(injectOrderStats);

// View engine setup
app.set("view engine", "hbs");
hbs.registerPartials("./views/partials");

// Static file serving
app.use(express.static("./public")); // for public assets like CSS/JS
app.use("/public", express.static("./public")); // for uploaded files like images

// Custom helpers
require("./helpers");

// Routes
const Router = require("./routes/index");
app.use(express.json());
// app.use("/api", Router);
app.use("/", Router);

// Start server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}
);
