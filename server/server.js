import express from "express";
import axios from 'axios';
import cache from './routeCache.js';
import firebase from "firebase/compat/app";
import "firebase/compat/database";

const firebaseConfig = {
  apiKey: "AIzaSyCaCdWNDUk_Xj1OVsLkif4Rv5fw8C269Dk",
  authDomain: "weather-e56cb.firebaseapp.com",
  databaseURL: "https://weather-e56cb-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "weather-e56cb",
  storageBucket: "weather-e56cb.appspot.com",
  messagingSenderId: "547798664758",
  appId: "1:547798664758:web:e5372b8ac87c352927fa97",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const app = express();

// API
app.get("/api", cache(1800), async (req, res) => {
    const id = '0ae9063a06a55dbb8ccf118dd1b01190';
    const urls = ['2267056', '2267094', '2740636', '2735941', '2268337'];

    try{
        const responses = await axios.all(urls.map(url => axios.get(`http://api.openweathermap.org/data/2.5/forecast?id=${url}&APPID=${id}`)));
        const data = responses.map(response => response.data);
        res.json(data);
        
    } catch (error) {
        console.error(error);
        res.status(500).send("Error");
    }
})

// Login verification
app.use(express.json());
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const database = firebase.database();
  let user = undefined;
  
  database.ref().on("value", (snapshot) => {
    const users = snapshot.val();
    user = (users.username === username && users.password === password);
  });

  if (user) {
    res.json({ message: 'Login successful' });
  } else {
    res.json({ message: 'Invalid credentials' });
  }
});


app.listen(5000, () => console.log("Server started on port 5000"));