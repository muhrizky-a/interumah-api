require('dotenv').config()
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const path = require('path');

// Import routes
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const designCategoryRoute = require('./routes/designs/category');
const designRoute = require('./routes/designs/design');
const budgetPlanRoute = require('./routes/designs/budgetPlan');
const chatRoute = require('./routes/chat');
const bookmarkRoute = require('./routes/bookmark');
const orderRoute = require('./routes/order');
const reviewRoute = require('./routes/designs/review');
const adminRoute = require('./routes/admin');
const errorMiddleware = require('./middleware/errorMiddleware');


// Initialize express
const app = express();
const PORT = process.env.PORT || 3000

// Middleware
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    cookie: {
        secure: 'auto',
    },
}));

app.use(cors(
    {
        credentials: true,
        origin: '*',
    }
));

app.use(passport.initialize());
app.use(cookieParser());
app.use(express.json());

// Routes
app.use(userRoute);
app.use(authRoute);
app.use(designCategoryRoute);
app.use(designRoute);
app.use(budgetPlanRoute);
app.use(chatRoute);
app.use(bookmarkRoute);
app.use(orderRoute);
app.use(reviewRoute);
app.use(adminRoute);

// Error handling
app.use(errorMiddleware);

// Catch 404 and forward to error handler
app.use(function (req, res) {
    res.status(404).json({
        code: 404,
        status: "PAGE_NOT_FOUND",
        message: "Halaman tidak ditemukan"
    });
});

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});