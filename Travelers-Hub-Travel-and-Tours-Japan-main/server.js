const bcrypt = require('bcryptjs');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session'); 
const path = require('path');
const PackageContent = require('./models/PackageContent'); // Update path as needed
const authorizeRoles  = require('./routes/accessController');

require('dotenv').config();

const app = express();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*---------------------- MongoDB Connection -----------------*/
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://TravellersHubTT:travelershubtravelandtours@databasecluster.9hbza.mongodb.net/THTTDb?retryWrites=true&w=majority&appName=DatabaseCluster', {
})
.then(() => console.log("Database Connected"))
.catch(err => console.error("Database connection error:", err));

// Configure express-session
app.use(session({
    secret: process.env.SESSION_SECRET || 'yoursecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }  // Set `true` if using HTTPS
}));

// Ensure JWT secret is set
const jwtSecret = process.env.JWT_SECRET || 'defaultFallbackSecret';

if (!process.env.JWT_SECRET) {
    console.warn("Warning: JWT_SECRET is not set in the environment variables. Using a fallback secret.");
}


/*------------------ Serve static files --------------------------- */
// Other imports
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');

const submitRequirements = require('./routes/submitRequirements'); // Adjust path as needed
const { env } = require('process');

app.use('/api/requirements', submitRequirements);

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);


/*---------------------------- Restricting Clientpages (Enforcing users to login to create token) -------------------------- */

// Middleware to check if the user is logged in
function isAuthenticated(req, res, next) {
    if (req.session && req.session.client) {
        return next(); // User is logged in, proceed to the next middleware/route
    }
    res.redirect('/AccessDenied'); // Redirect to Access Denied if not logged in
}

// Apply the middleware to restrict access to Clientpage and Homepage
app.use('/Clientpage', isAuthenticated, express.static(path.join(__dirname, 'Clientpage')));


// Serve static files (HTML) (NOTE: add app.use for JS or CSS for MIMETYPE)
//app.use( express.static(path.join(__dirname, 'Clientpage')));
app.use( express.static(path.join(__dirname, 'Homepage')));
app.use( express.static(path.join(__dirname, 'Adminpage')));

// Serve static files ( CSS, JS, etc.) (NOTE: add app.use for JS or CSS for MIMETYPE)
app.use('/assets', express.static(path.join(__dirname, 'assets'))); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/admin_scripts', express.static(path.join(__dirname, 'admin_scripts')));
app.use('/client_scripts', express.static(path.join(__dirname, 'client_scripts')));


/*------------------ Client serve static files --------------------------- */
/*------------------ Packages ------------------*/
//Packages 1 Serve
app.get('/Clientpage/package_1', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'Clientpage', 'TourPackageList' , 'package_1.html'));
});

//Packages 2 Serve
app.get('/Clientpage/package_2', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'Clientpage', 'TourPackageList' , 'package_2.html'));
});

//Packages 3 Serve
app.get('/Clientpage/package_3', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'Clientpage', 'TourPackageList' , 'package_3.html'));
});

//Packages 4 Serve
app.get('/Clientpage/package_4', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'Clientpage', 'TourPackageList' , 'package_4.html'));
});

//BookHere Module
app.get('/BookHere', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'Clientpage', 'TourPackageList' , 'bookHere.html'));
});


/*------------------ Homepage/Clientpage ------------------*/

// Root route to serve Homepage.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Homepage', 'Homepage.html'));
});

// Serve static pages directly
app.get('/Homepage', (req, res) => {
    res.sendFile(path.join(__dirname, 'Homepage', 'Homepage.html'));
});


app.get('/Clientpage', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname,'Clientpage', 'Clientpage.html'));
});

app.get('/Japan', (req, res) => {
    res.sendFile(path.join(__dirname, 'Homepage', 'Japan', 'Japan.html'));
});

app.get('/about_us', (req, res) => {
    res.sendFile(path.join(__dirname, 'Homepage', 'about_us', 'about_us.html'));
});

app.get('/help_support', (req, res) => {
    res.sendFile(path.join(__dirname, 'Homepage', 'help_support', 'help_support.html'));
});


//Email Verification
app.get('/EmailVerify', (req, res) => {
    res.sendFile(path.join(__dirname, 'Homepage', 'Emailverification', 'EmailVerification.html'));
});

//Email Confirmation
app.get('/EmailConfirm', (req, res) => {
    res.sendFile(path.join(__dirname, 'Homepage', 'Emailverification', 'EmailConfirmed.html'));
});


//Login
app.get('/Login', (req, res) => {
    res.sendFile(path.join(__dirname, 'Homepage', 'User_SignIn', 'SignIn.html'));
});



/*------------------ Admin Roles serve static files --------------------------- */
// Role-specific routes
app.get('/Dashboard', authorizeRoles('Super Admin', 'Admin/Manager', 'Staff'), (req, res) => {
    res.sendFile(path.join(__dirname, 'Adminpage', 'Dashboard.html'));
});

app.get('/ManageAdmin', authorizeRoles('Super Admin'), (req, res) => {
    res.sendFile(path.join(__dirname, 'Adminpage', 'ManageAdmin.html'));
});

app.get('/TestimonialsApproval', authorizeRoles('Super Admin', 'Admin/Manager', 'Staff'), (req, res) => {
    res.sendFile(path.join(__dirname, 'Adminpage', 'TestimonialsApproval.html'));
});

app.get('/VisaInformation', authorizeRoles('Super Admin', 'Admin/Manager', 'Staff'), (req, res) => {
    res.sendFile(path.join(__dirname, 'Adminpage', 'VisaInformation.html'));
});

app.get('/VisaInformationArchive', authorizeRoles('Super Admin', 'Admin/Manager', 'Staff'), (req, res) => {
    res.sendFile(path.join(__dirname, 'Adminpage', 'VisaInformationArchive.html'));
});

app.get('/PackageInformation', authorizeRoles('Super Admin', 'Admin/Manager', 'Staff'), (req, res) => {
    res.sendFile(path.join(__dirname, 'Adminpage', 'PackageInformation.html'));
});

app.get('/PackageInformationArchive', authorizeRoles('Super Admin', 'Admin/Manager', 'Staff'), (req, res) => {
    res.sendFile(path.join(__dirname, 'Adminpage', 'PackageInformationArchive.html'));
});

app.get('/ManageTourPackage', authorizeRoles('Super Admin', 'Admin/Manager'), (req, res) => {
    res.sendFile(path.join(__dirname, 'Adminpage', 'ManageTourPackage.html'));
});

//ACCESS DENIED PAGE

app.get('/AccessDenied', (req, res) => {
    res.sendFile(path.join(__dirname, 'Adminpage', 'AccessDenied.html'));
});

// ADMIN LOGIN PAGE SERVE
app.get('/Adminlogin', (req, res) => {
    res.sendFile(path.join(__dirname,  'Adminpage','AdminLogin.html'));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));