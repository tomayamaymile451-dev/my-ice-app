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

// Exact Original UI Output
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ICE FISHING FIXER</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;800;900&family=Rajdhani:wght@600;700&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Rajdhani', sans-serif; }
        
        body {
            background: #020712 url('https://i.ibb.co/6y4G17n/ice-bg-wheel.jpg') center top / cover no-repeat fixed;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            color: #fff;
            position: relative;
            overflow-x: hidden;
        }

        body::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(180deg, rgba(2, 7, 18, 0.4) 0%, rgba(2, 7, 18, 0.75) 100%);
            z-index: 1;
        }

        /* Top Header */
        .header {
            width: 100%;
            padding: 12px 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(4, 12, 30, 0.85);
            border-bottom: 2px solid #00d2ff;
            box-shadow: 0 0 15px rgba(0, 210, 255, 0.5);
            backdrop-filter: blur(5px);
            z-index: 2;
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .header-icon {
            width: 28px;
            height: 28px;
            filter: drop-shadow(0 0 6px #00d2ff);
        }

        .logo-title {
            font-family: 'Orbitron', sans-serif;
            font-size: 16px;
            font-weight: 900;
            color: #8b3dff;
            text-shadow: 0 0 8px #8b3dff, 0 0 15px #00d2ff;
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
        .dot { width: 9px; height: 9px; border-radius: 50%; }
        .dot-green { background: #00ff88; box-shadow: 0 0 8px #00ff88; }
        .dot-blue { background: #00d2ff; box-shadow: 0 0 8px #00d2ff; }
        .dot-purple { background: #b5179e; box-shadow: 0 0 8px #b5179e; }

        /* Main Form Container */
        .container {
            position: relative;
            z-index: 2;
            width: 88%;
            max-width: 360px;
            margin: auto;
            text-align: center;
            padding: 10px 0 30px;
        }

        .main-logo-img {
            width: 190px;
            height: auto;
            margin-bottom: 5px;
            filter: drop-shadow(0 0 15px rgba(0, 210, 255, 0.8));
        }

        .section-title {
            font-family: 'Orbitron', sans-serif;
            color: #00d2ff;
            font-size: 16px;
            font-weight: 800;
            margin-bottom: 22px;
            text-shadow: 0 0 10px rgba(0, 210, 255, 0.9);
            letter-spacing: 1px;
        }

        /* Inputs */
        .input-group {
            text-align: left;
            margin-bottom: 16px;
            position: relative;
        }

        .input-group label {
            display: block;
            font-size: 13px;
            color: #e0e0e0;
            margin-bottom: 5px;
            font-weight: 600;
        }

        .input-box {
            width: 100%;
            padding: 12px 15px;
            background: rgba(4, 20, 45, 0.65);
            border: 2px solid #00d2ff;
            border-radius: 12px;
            color: #fff;
            font-size: 14px;
            outline: none;
            box-shadow: inset 0 0 10px rgba(0, 210, 255, 0.2), 0 0 10px rgba(0, 210, 255, 0.3);
            transition: 0.3s;
        }

        .input-box:focus {
            box-shadow: 0 0 18px rgba(0, 210, 255, 0.9);
        }

        .eye-icon {
            position: absolute;
            right: 12px;
            bottom: 11px;
            cursor: pointer;
            opacity: 0.8;
            font-size: 14px;
        }

        /* Buttons */
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
            transition: 0.3s;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .btn-login {
            background: linear-gradient(90deg, #0088cc, #00d2ff);
            color: #fff;
            box-shadow: 0 0 18px rgba(0, 210, 255, 0.6);
        }

        .btn-login:active { transform: scale(0.98); }

        .btn-pkg {
            background: linear-gradient(90deg, #8a2be2, #d100d1);
            color: #fff;
            box-shadow: 0 0 18px rgba(209, 0, 209, 0.6);
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
        <div class="header-left">
            <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="#00d2ff" stroke-width="2">
                <path d="M18 15a6 6 0 0 1-12 0V4a2 2 0 0 1 4 0v11a2 2 0 0 0 4 0V9"/>
                <circle cx="18" cy="15" r="1.5" fill="#00d2ff"/>
            </svg>
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
        <!-- Exact Original Logo SVG Structure -->
        <svg class="main-logo-img" viewBox="0 0 240 140" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#00d2ff"/>
                    <stop offset="100%" stop-color="#0055ff"/>
                </linearGradient>
            </defs>
            <!-- Rod Ring -->
            <path d="M 50 85 A 60 60 0 1 1 190 85" fill="none" stroke="url(#blueGrad)" stroke-width="4"/>
            <path d="M 65 85 A 45 45 0 1 1 175 85" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="4 3"/>
            <!-- Fish Graphic -->
            <path d="M 95 65 C 110 45, 135 45, 145 65 C 135 85, 110 85, 95 65 Z" fill="#ff3b3b" stroke="#ffffff" stroke-width="1.5"/>
            <polygon points="145,65 160,55 157,65 160,75" fill="#ff3b3b"/>
            <circle cx="108" cy="60" r="2.5" fill="#ffffff"/>
            <!-- Text -->
            <text x="120" y="105" font-family="'Orbitron', sans-serif" font-weight="900" font-size="20" fill="#ffffff" text-anchor="middle" style="text-shadow: 0 0 10px #00d2ff, 0 0 20px #0055ff;">ICE FISHING</text>
            <text x="120" y="122" font-family="'Orbitron', sans-serif" font-weight="700" font-size="12" fill="#00d2ff" text-anchor="middle" letter-spacing="3">LIVE</text>
        </svg>

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
