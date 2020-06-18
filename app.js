const express = require('express')
const app = express()
const port = 5000
var path = require('path');
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var admin = require('firebase-admin');
var firebase = require('firebase')

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://test-it-out-d98b7.firebaseio.com",
});
var firebaseConfig = {
    apiKey: "AIzaSyDCKt1-Pp_UoA6xJkYdoehxWtbJ7NERwhM",
    authDomain: "test-it-out-d98b7.firebaseapp.com",
    databaseURL: "https://test-it-out-d98b7.firebaseio.com",
    projectId: "test-it-out-d98b7",
    storageBucket: "test-it-out-d98b7.appspot.com",
    messagingSenderId: "758694990368",
    appId: "1:758694990368:web:a9c7876e077dec93d66245"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }))


app.get('/', (req, res) => res.sendFile(
    path.join(__dirname + '/index.html'))
)

app.get('/login', (req, res) => res.sendFile(
    path.join(__dirname + '/google-login.html'))
)

app.post('/session-login', (req, res) => {
    const idToken = req.body.token.toString();

    admin.auth().verifyIdToken(idToken)
        .then(payload => {
            // Token is valid.
            // Maybe generate a session cookie
            const expiresIn = 60 * 60 * 24 * 5 * 1000;
            admin.auth().createSessionCookie(idToken, { expiresIn })
                .then((sessionCookie) => {
                    // Set cookie policy for session cookie.
                    const options = { maxAge: expiresIn, httpOnly: true, secure: true };
                    res.cookie('session', sessionCookie, options);
                    res.end(JSON.stringify({ status: 'success' }));
                }, error => {
                    res.status(401).send({ "err": error });
                });
        })
        .catch(error => {
            res.send({ "err": error })
        });

});


app.listen(port, () => console.log(`auth-it listening at http://localhost:${port}`))