const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const fs = require('fs');

const path = require('path');



const app = express();

app.use(express.static('public'));
app.use('/assets', express.static('assets'));
app.use('/cnr/Images', express.static(path.join(__dirname, 'cnr/Images')));
app.use(express.urlencoded({ extended: false }));



// Set view engine to 'ejs'
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/signverification").then(() => {
    console.log("db connected");
}).catch((err) => {
    console.error("Error connecting to db:", err);
});

const SignSchema = new mongoose.Schema({
    username: String ,
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: String,
    image: {
        type: String,
        required: true,
        unique:true
    }
});

const adminSchema = new mongoose.Schema({
    username: String ,
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: String,
    image: {
        type: String,
        required: true,
        unique:true
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Specify the destination directory where files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original file name for the stored file
    }
});

const storage1 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads1/'); // Specify the destination directory where files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original file name for the stored file
    }
});

const upload = multer({ storage: storage });
const upload1 = multer({ storage: storage1 });


const Sign = mongoose.model("SignVerification", SignSchema);
const Admin = mongoose.model("admin", adminSchema);

app.get('/', (req, res) => {
    res.render('login');
});

app.get('/addstudent', (req, res) => {
    res.render('index');
});

app.get('/adminlogin', (req, res) => {
    res.render('login',{success:"Signup sucessfully"});
});

app.get('/home', (req, res) => {
    res.render('home',{success:"Student Verify sucessfully"});
});

app.get('/cnr/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'cnr', 'index.html'));
});

app.get('/cnr/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'cnr', 'style.css'));
});

app.get('/cnr/script.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'cnr', 'script.js'));
});

app.get('/cnr/tensorflowjs.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'cnr', 'tensorflowjs.js'));
});

app.post('/addadmin', upload.single('image'), async (req, res) => {
    try {
        // Read the image file from the request
        const imageBuffer = fs.readFileSync(req.file.path);
        const imageBlob = Buffer.from(imageBuffer, 'binary');

        console.log(imageBlob);

        const image = new Admin({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            image: imageBlob
        });

        await image.save();

       
            res.redirect('/login');
       

    } catch (error) {
        console.error('Error saving image:', error);
        res.status(500).send('Internal server error: ' + error.message);
    }
});


app.post('/addstudent', upload.single('image'), async (req, res) => {
    try {
        // Read the image file from the request
        const imageBuffer = fs.readFileSync(req.file.path);
        const imageBlob = Buffer.from(imageBuffer, 'binary');

        console.log(imageBlob);

        const image = new Sign({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            image: imageBlob
        });

        await image.save();

       
            res.redirect('/home');
       

    } catch (error) {
        console.error('Error saving image:', error);
        res.status(500).send('Internal server error: ' + error.message);
    }
});



app.post('/adminlogin',upload1.single('image'), async (req, res) => {
   
    const imageBuffer = fs.readFileSync(req.file.path);
    const imageBlob = Buffer.from(imageBuffer, 'binary');

    const image={image:imageBlob}

        const user = await Admin.findOne(image);
        console.log(user);

        if (!user) {
            return res.status(404).send('User not found');
        }
        else{
            console.log('sucess');
            res.redirect('/home');
            

        }


})

app.post('/verify',upload1.single('image'), async (req, res) => {
   
    const imageBuffer = fs.readFileSync(req.file.path);
    const imageBlob = Buffer.from(imageBuffer, 'binary');

    const image={image:imageBlob}

        const user = await Sign.findOne(image);
        console.log(user);

        if (!user) {
            return res.status(404).send('User not found');
        }
        else{
            console.log('sucess');
            res.redirect('/home');
            

        }


})

app.listen(4000, () => {
    console.log("App is listening on port 4000");
});
