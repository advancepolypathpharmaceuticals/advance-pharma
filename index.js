require("dotenv").config();

const express = require("express");
const app = express();

const path = require("path");
const hbs = require("hbs");
const session = require("express-session");

// Trust proxy
app.set("trust proxy", 1);

// =====================================================
// DATABASE
// =====================================================
require("./db_connect");

// =====================================================
// BODY PARSER
// =====================================================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// =====================================================
// SESSION
// =====================================================
app.use(
    session({
        secret: process.env.SESSION_SECRET_KEY || "default_secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24
        }
    })
);

// =====================================================
// GLOBAL LOCALS
// =====================================================
app.use((req, res, next) => {

    res.locals.currentPath = req.path;
    res.locals.session = req.session;

    // Ensure cart exists
    if (!req.session.cart) {
        req.session.cart = [];
    }

    res.locals.cartCount = req.session.cart.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
    );

    next();
});

// =====================================================
// ORDER STATS
// =====================================================
const injectOrderStats = require("./middlewares/orderStatsMiddleware");

app.use(injectOrderStats);

// =====================================================
// VIEW ENGINE
// =====================================================
app.set("view engine", "hbs");

hbs.registerPartials(
    path.join(__dirname, "views/partials")
);

// =====================================================
// STATIC FILES
// =====================================================

// CSS / JS / images / uploaded files
app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

// Optional: keeps existing /public/... URLs working
app.use(
    "/public",
    express.static(
        path.join(__dirname, "public")
    )
);

// =====================================================
// HELPERS
// =====================================================
require("./helpers");

// =====================================================
// HEALTH CHECK
// =====================================================
app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

// =====================================================
// ROUTES
// =====================================================
const Router = require("./routes/index");

app.use("/", Router);

// =====================================================
// START SERVER
// =====================================================
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
