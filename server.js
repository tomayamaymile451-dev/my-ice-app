const express = require('express');
const admin = require('firebase-admin');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Original UI Design
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ICE FISHING FIXER</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Rajdhani:wght@600;700&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Rajdhani', sans-serif; }
        body {
            background: #060c1e radial-gradient(circle at center, #101d42 0%, #040814 100%);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            color: #fff;
            position: relative;
            overflow-x: hidden;
        }
        /* Background Casino Wheel Overlay Effect */
        body::before {
            content: '';
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: 600px; height: 600px;
            background: repeating-conic-gradient(from 0deg, rgba(0, 210, 255, 0.05) 0deg 15deg, transparent 15deg 30deg);
            border-radius: 50%;
            z-index: 0;
            pointer-events: none;
        }
        .header {
            width: 100%;
            padding: 12px 18px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(6, 15, 35, 0.95);
            border-bottom: 2px solid #00d2ff;
            box-shadow: 0 0 15px rgba(0, 210, 255, 0.4);
            z-index: 2;
        }
        .header-title-container {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .header-icon {
            width: 22px; height: 22px;
            fill: #00d2ff;
        }
        .logo-title {
            font-family: 'Orbitron', sans-serif;
            font-size: 16px;
            font-weight: 900;
            color: #9b51e0;
            text-shadow: 0 0 8px #9b51e0, 0 0 15px #00d2ff;
            letter-spacing: 1px;
        }
        .sub-title {
            font-size: 10px;
            color: #00d2ff;
            letter-spacing: 1.5px;
            margin-top: 2px;
            font-family: 'Orbitron', sans-serif;
        }
        .dots { display: flex; gap: 5px; }
        .dot { width: 8px; height: 8px; border-radius: 50%; }
        .dot-green { background: #00ff88; box-shadow: 0 0 8px #00ff88; }
        .dot-blue { background: #00d2ff; box-shadow: 0 0 8px #00d2ff; }
        .dot-purple { background: #b5179e; box-shadow: 0 0 8px #b5179e; }

        .container {
            position: relative;
            z-index: 2;
            width: 88%;
            max-width: 360px;
            margin: auto;
            text-align: center;
            padding: 20px 0;
        }
        .main-logo-box {
            position: relative;
            width: 140px;
            height: 100px;
            margin: 0 auto 15px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        .fish-icon {
            font-size: 42px;
            filter: drop-shadow(0 0 10px #ff4d4d) drop-shadow(0 0 20px #00d2ff);
        }
        .logo-text-main {
            font-family: 'Orbitron', sans-serif;
            font-weight: 900;
            font-size: 20px;
            background: linear-gradient(180deg, #ffffff, #00d2ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 0 10px rgba(0, 210, 255, 0.5);
            line-height: 1;
            margin-top: 4px;
        }
        .logo-text-sub {
            font-family: 'Orbitron', sans-serif;
            font-weight: 700;
            font-size: 11px;
            color: #00d2ff;
            letter-spacing: 2px;
        }
        .section-title {
            font-family: 'Orbitron', sans-serif;
            color: #00d2ff;
            font-size: 16px;
            margin-bottom: 25px;
            text-shadow: 0 0 10px rgba(0, 210, 255, 0.8);
            letter-spacing: 1px;
        }
        .input-group {
            text-align: left;
            margin-bottom: 18px;
            position: relative;
        }
        .input-group label {
            display: block;
            font-size: 13px;
            color: #e0e0e0;
            margin-bottom: 6px;
            font-weight: 600;
        }
        .input-box {
            width: 100%;
            padding: 12px 15px;
            background: rgba(10, 25, 45, 0.7);
            border: 1.5px solid #00d2ff;
            border-radius: 10px;
            color: #fff;
            font-size: 14px;
            outline: none;
            box-shadow: 0 0 10px rgba(0, 210, 255, 0.2);
            transition: 0.3s;
        }
        .input-box:focus {
            box-shadow: 0 0 15px rgba(0, 210, 255, 0.7);
        }
        .eye-icon {
            position: absolute;
            right: 12px;
            bottom: 10px;
            cursor: pointer;
            opacity: 0.8;
            font-size: 14px;
        }
        .btn {
            width: 100%;
            padding: 13px;
            border-radius: 10px;
            border: none;
            font-family: 'Orbitron', sans-serif;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            margin-top: 10px;
            transition: 0.3s;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .btn-login {
            background: linear-gradient(90deg, #0088cc, #00d2ff);
            color: #fff;
            box-shadow: 0 0 15px rgba(0, 210, 255, 0.5);
        }
        .btn-login:active { transform: scale(0.98); }
        .btn-pkg {
            background: linear-gradient(90deg, #8a2be2, #d100d1);
            color: #fff;
            box-shadow: 0 0 15px rgba(209, 0, 209, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        .btn-pkg:active { transform: scale(0.98); }
    </style>
</head>
<body>

    <div class="header">
        <div class="header-title-container">
            <svg class="header-icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            <div>
                <div class="logo-title">ICE FISHING FIXER</div>
                <div class="sub-title">⚡ PREMIUM SYSTEM V3.0</div>
            </div>
        </div>
        <div class="dots">
            <div class="dot dot-green"></div>
            <div class="dot dot-blue"></div>
            <div class="dot dot-purple"></div>
        </div>
    </div>

    <div class="container">
        <div class="main-logo-box">
            <div class="fish-icon">🎣</div>
            <div class="logo-text-main">ICE FISHING</div>
            <div class="logo-text-sub">LIVE</div>
        </div>

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
                if(data.link) {
                    window.open(data.link, '_blank');
                }
            } catch(err) {
                alert('Could not fetch Telegram link');
            }
        });

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
