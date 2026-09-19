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

// Pure Code Base Original Design (No External Broken Image)
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
            background: #030a1a;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            color: #fff;
            position: relative;
            overflow-x: hidden;
        }

        /* Pure CSS Casino Wheel Background Overlay */
        .casino-wheel-bg {
            position: fixed;
            top: 45%; left: 50%;
            transform: translate(-50%, -50%);
            width: 800px; height: 800px;
            background: repeating-conic-gradient(
                from 0deg,
                #081b38 0deg 15deg,
                #030b1e 15deg 30deg
            );
            border-radius: 50%;
            z-index: 0;
            opacity: 0.85;
            pointer-events: none;
            box-shadow: inset 0 0 100px #030a1a;
        }

        .radial-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: radial-gradient(circle at center, transparent 20%, #030a1a 90%);
            z-index: 1;
            pointer-events: none;
        }

        /* Header */
        .header {
            width: 100%;
            padding: 12px 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(4, 12, 30, 0.95);
            border-bottom: 2px solid #00d2ff;
            box-shadow: 0 0 15px rgba(0, 210, 255, 0.5);
            z-index: 2;
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .header-icon {
            width: 24px;
            height: 24px;
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
            padding: 20px 0;
        }

        .logo-box {
            width: 200px;
            height: 130px;
            margin: 0 auto 5px;
            display: flex;
            justify-content: center;
            align-items: center;
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
            background: rgba(4, 20, 45, 0.75);
            border: 2px solid #00d2ff;
            border-radius: 10px;
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
            border-radius: 10px;
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

    <div class="casino-wheel-bg"></div>
    <div class="radial-overlay"></div>

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
        <!-- Built-in High Quality Logo -->
        <div class="logo-box">
            <svg width="180" height="120" viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
                <!-- Glowing Outer Ring -->
                <circle cx="100" cy="55" r="42" fill="none" stroke="#00d2ff" stroke-width="3" stroke-dasharray="6 3"/>
                <!-- Hook Arc -->
                <path d="M 55 70 A 50 50 0 1 1 145 70" fill="none" stroke="#00d2ff" stroke-width="2"/>
                <!-- Fish Symbol -->
                <path d="M 80 52 Q 100 35, 120 52 Q 100 69, 80 52 Z" fill="#ff4d4d" stroke="#ffffff" stroke-width="1.5"/>
                <polygon points="120,52 132,44 129,52 132,60" fill="#ff4d4d"/>
                <circle cx="92" cy="48" r="2" fill="#ffffff"/>
                <!-- Text -->
                <text x="100" y="98" font-family="'Orbitron', sans-serif" font-weight="900" font-size="18" fill="#ffffff" text-anchor="middle" style="text-shadow: 0 0 10px #00d2ff;">ICE FISHING</text>
                <text x="100" y="114" font-family="'Orbitron', sans-serif" font-weight="700" font-size="11" fill="#00d2ff" text-anchor="middle" letter-spacing="3">LIVE</text>
            </svg>
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
