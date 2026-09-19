const express = require('express');
const path = require('path');
const admin = require('firebase-admin');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// public ফোল্ডারের ভেতরের ছবি/ফাইল অ্যাক্সেস করার অনুমতি
app.use(express.static(path.join(__dirname, 'public')));

// Firebase Admin SDK Configuration
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

if (serviceAccount.project_id) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://ice-fishing-3-a5c57-default-rtdb.firebaseio.com"
    });
}

// Telegram Link API
app.get('/api/telegram-link', (req, res) => {
    res.json({ link: 'https://t.me/+iuwzgCxozp5hNDg1' });
});

// Secure Login API
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

// App Main Page
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>ICE FISHING FIXER</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;800;900&family=Rajdhani:wght@600;700;800&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Rajdhani', sans-serif; }
        
        body {
            background: #020916;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            color: #fff;
            position: relative;
            overflow-x: hidden;
        }

        /* Background image directly from public folder */
        .bg-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: url('/bg.jpg') no-repeat center top / cover; /* আপনার public ফোল্ডারের ব্যাকগ্রাউন্ড ছবির নাম অনুযায়ী নাম দিন */
            z-index: 0;
            opacity: 0.6;
            filter: contrast(1.1) brightness(0.9);
            pointer-events: none;
        }

        .bg-radial {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: radial-gradient(circle at center, rgba(3, 15, 38, 0.1) 0%, rgba(2, 9, 22, 0.75) 100%);
            z-index: 1;
            pointer-events: none;
        }

        /* Top Title Bar */
        .header {
            width: 100%;
            padding: 10px 14px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(4, 16, 38, 0.95);
            border-bottom: 2px solid #8b3dff;
            box-shadow: 0 4px 15px rgba(0, 210, 255, 0.4);
            z-index: 10;
            position: relative;
        }

        .header-left { display: flex; align-items: center; gap: 10px; }

        .header-icon {
            width: 28px;
            height: 28px;
            filter: drop-shadow(0 0 8px #00d2ff);
            animation: pulse-icon 2s infinite ease-in-out;
        }

        @keyframes pulse-icon {
            0%, 100% { transform: scale(1); filter: drop-shadow(0 0 6px #00d2ff); }
            50% { transform: scale(1.08); filter: drop-shadow(0 0 12px #00ffcc); }
        }

        .title-text-box { display: flex; flex-direction: column; }

        .logo-title {
            font-family: 'Orbitron', sans-serif;
            font-size: 16px;
            font-weight: 900;
            color: #00ffcc;
            text-shadow: 0 0 8px #00ffcc, 0 0 15px #00d2ff;
            letter-spacing: 1.2px;
        }

        .sub-title {
            font-size: 10px;
            color: #00d2ff;
            letter-spacing: 1.5px;
            margin-top: 1px;
            font-family: 'Orbitron', sans-serif;
            font-weight: 800;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .thunder-icon {
            color: #ffea00;
            text-shadow: 0 0 8px #ffea00;
            animation: flash-lightning 1.2s infinite alternate;
        }

        @keyframes flash-lightning {
            0% { opacity: 0.4; }
            100% { opacity: 1; transform: scale(1.2); }
        }

        /* Animated Dots */
        .dots { display: flex; gap: 6px; align-items: center; }
        .dot { width: 9px; height: 9px; border-radius: 50%; }
        .dot-green { background: #00ff88; box-shadow: 0 0 8px #00ff88; animation: dot-glow 1.5s infinite alternate; }
        .dot-blue { background: #00d2ff; box-shadow: 0 0 8px #00d2ff; animation: dot-glow 1.5s infinite alternate 0.5s; }
        .dot-purple { background: #d100d1; box-shadow: 0 0 8px #d100d1; animation: dot-glow 1.5s infinite alternate 1s; }

        @keyframes dot-glow {
            0% { opacity: 0.4; transform: scale(0.8); }
            100% { opacity: 1; transform: scale(1.25); }
        }

        /* Main Container */
        .container {
            position: relative;
            z-index: 5;
            width: 88%;
            max-width: 350px;
            margin: auto;
            text-align: center;
            padding: 10px 0 20px;
        }

        /* Logo Image directly from public folder */
        .original-logo {
            width: 220px;
            max-width: 85%;
            height: auto;
            margin: 0 auto 8px;
            display: block;
            filter: drop-shadow(0 0 15px rgba(0, 210, 255, 0.7));
            animation: logo-float 3s ease-in-out infinite;
        }

        @keyframes logo-float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
        }

        .section-title {
            font-family: 'Orbitron', sans-serif;
            color: #00d2ff;
            font-size: 16px;
            font-weight: 800;
            margin-bottom: 20px;
            text-shadow: 0 0 10px rgba(0, 210, 255, 0.9);
            letter-spacing: 1px;
        }

        .input-group { text-align: left; margin-bottom: 15px; position: relative; }
        .input-group label { display: block; font-size: 13px; color: #ffffff; margin-bottom: 5px; font-weight: 700; }

        .input-box {
            width: 100%;
            padding: 12px 15px;
            background: rgba(2, 18, 42, 0.85);
            border: 2px solid #00d2ff;
            border-radius: 12px;
            color: #fff;
            font-size: 14px;
            outline: none;
            box-shadow: inset 0 0 8px rgba(0, 210, 255, 0.3), 0 0 10px rgba(0, 210, 255, 0.4);
        }

        .eye-icon { position: absolute; right: 14px; bottom: 11px; cursor: pointer; opacity: 0.85; font-size: 14px; }

        .btn {
            width: 100%;
            padding: 13px;
            border-radius: 12px;
            border: none;
            font-family: 'Orbitron', sans-serif;
            font-size: 14px;
            font-weight: 800;
            cursor: pointer;
            margin-top: 10px;
            text-transform: uppercase;
        }

        .btn-login {
            background: linear-gradient(90deg, #0088ff, #00e5ff);
            color: #ffffff;
            box-shadow: 0 0 18px rgba(0, 229, 255, 0.7);
        }

        .btn-pkg {
            background: linear-gradient(90deg, #9d1bb2, #00d2ff);
            color: #ffffff;
            box-shadow: 0 0 18px rgba(157, 27, 178, 0.7);
            display: flex; align-items: center; justify-content: center; gap: 8px;
        }
    </style>
</head>
<body>

    <div class="bg-overlay"></div>
    <div class="bg-radial"></div>

    <div class="header">
        <div class="header-left">
            <svg class="header-icon" viewBox="0 0 32 32" fill="none" stroke="#00d2ff" stroke-width="2.2">
                <path d="M22 20a7 7 0 0 1-14 0V6a3 3 0 0 1 6 0v14a3 3 0 0 0 6 0V11"/>
                <circle cx="22" cy="20" r="2" fill="#00ffcc"/>
            </svg>
            <div class="title-text-box">
                <div class="logo-title">ICE FISHING FIXER</div>
                <div class="sub-title"><span class="thunder-icon">⚡</span> PREMIUM SYSTEM V3.0</div>
            </div>
        </div>
        <div class="dots">
            <div class="dot dot-green"></div>
            <div class="dot dot-blue"></div>
            <div class="dot dot-purple"></div>
        </div>
    </div>

    <div class="container">
        <!-- আপনার public ফোল্ডারের লোগো ছবির নাম অনুযায়ী src এর নাম দিন -->
        <img class="original-logo" src="/logo.png" alt="ICE FISHING LIVE">

        <div class="section-title">ICE FISHING LOGIN</div>

        <div class="input-group">
            <label>Username</label>
            <input type="text" id="username" class="input-box" placeholder="Enter username">
        </div>

        <div class="input-group">
            <label>Password</label>
            <input type="password" id="password" class="input-box" placeholder="Enter password">
            <span class="eye-icon">👁️</span>
        </div>

        <button id="loginBtn" class="btn btn-login">LOGIN</button>
        <button id="pkgBtn" class="btn btn-pkg">🔒 SEE PACKAGES</button>
    </div>

    <script>
        document.getElementById('pkgBtn').addEventListener('click', async function() {
            try {
                const res = await fetch('/api/telegram-link');
                const data = await res.json();
                if(data.link) { window.open(data.link, '_blank'); }
            } catch(err) { alert('Could not fetch Telegram link'); }
        });

        document.getElementById('loginBtn').addEventListener('click', async function() {
            const u = document.getElementById('username').value;
            const p = document.getElementById('password').value;
            if(!u || !p) { alert('Please enter username and password'); return; }

            try {
                const res = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: u, password: p })
                });
                const data = await res.json();
                if(data.success) { alert('Login Success!'); } 
                else { alert(data.message); }
            } catch(err) { alert('Server connection error'); }
        });
    </script>
</body>
</html>
    `);
});

app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });
