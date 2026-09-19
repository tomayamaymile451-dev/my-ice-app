const express = require('express');
const admin = require('firebase-admin');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Firebase Admin SDK (সিকিউর ব্যাকএন্ড কানেকশন)
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

if (serviceAccount.project_id) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://ice-fishing-3-a5c57-default-rtdb.firebaseio.com"
    });
}

// ১. টেলিগ্রাম চ্যানেল লিংকের ব্যাকএন্ড API
app.get('/api/telegram-link', (req, res) => {
    // আপনার আসল টেলিগ্রাম চ্যানেল লিংকটি নিচে বসিয়ে দিন
    res.json({ link: 'https://t.me/your_telegram_channel_username' });
});

// ২. সিকিউর ব্যাকএন্ড লগইন API
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const db = admin.database();
        const snapshot = await db.ref('auth').once('value');
        const authData = snapshot.val();

        if (authData && username === authData.username && password === authData.password) {
            return res.json({ success: true, message: 'Login successful' });
        } else {
            return res.json({ success: false, message: 'Invalid Username or Password' });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server or Access Error' });
    }
});

// ৩. ফ্রন্টএন্ড UI (ব্রাউজারে কোনো লজিক বা সিক্রেট কোড থাকবে না)
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ICE FISHING FIXER</title>
    <style>
        body { background: #0b132b; color: white; font-family: sans-serif; text-align: center; padding: 20px; }
        .card { max-width: 400px; margin: auto; background: #1c2541; padding: 20px; border-radius: 10px; }
        input { width: 90%; padding: 10px; margin: 10px 0; border-radius: 5px; border: none; box-sizing: border-box; }
        button { display: block; width: 100%; padding: 12px; margin: 10px 0; border-radius: 5px; border: none; font-weight: bold; cursor: pointer; box-sizing: border-box; }
        .login-btn { background: #00b4d8; color: white; }
        .pkg-btn { background: #7209b7; color: white; }
    </style>
</head>
<body>
    <div class="card">
        <h2>ICE FISHING LOGIN</h2>
        <input type="text" id="username" placeholder="Enter username">
        <input type="password" id="password" placeholder="Enter password">
        <button id="loginBtn" class="login-btn">LOGIN</button>
        <button id="pkgBtn" class="pkg-btn">🔒 SEE PACKAGES</button>
    </div>

    <script>
        // SEE PACKAGES বাটন
        document.getElementById('pkgBtn').addEventListener('click', async function() {
            try {
                const res = await fetch('/api/telegram-link');
                const data = await res.json();
                if(data.link) {
                    window.open(data.link, '_blank');
                }
            } catch(err) {
                alert('Could not fetch Telegram link');
            }
        });

        // LOGIN বাটন
        document.getElementById('loginBtn').addEventListener('click', async function() {
            const u = document.getElementById('username').value;
            const p = document.getElementById('password').value;
            
            if(!u || !p) {
                alert('Please enter username and password');
                return;
            }

            try {
                const res = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: u, password: p })
                });
                const data = await res.json();
                
                if(data.success) {
                    alert('Login Success!');
                } else {
                    alert(data.message);
                }
            } catch(err) {
                alert('Server connection error');
            }
        });
    </script>
</body>
</html>
    `);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
