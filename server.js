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

// Original Interface Code
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
            background: #020b18;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            color: #fff;
            position: relative;
            overflow-x: hidden;
        }

        /* Original Casino Wheel & Host Background simulation */
        .bg-container {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            z-index: 0;
            pointer-events: none;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        /* Large Rotating Wheel in Center */
        .casino-wheel {
            position: absolute;
            width: 650px;
            height: 650px;
            border-radius: 50%;
            background: conic-gradient(
                #1b3b6f 0deg 15deg, #0f2347 15deg 30deg,
                #1b3b6f 30deg 45deg, #0f2347 45deg 60deg,
                #1b3b6f 60deg 75deg, #0f2347 75deg 90deg,
                #1b3b6f 90deg 105deg, #0f2347 105deg 120deg,
                #1b3b6f 120deg 135deg, #0f2347 135deg 150deg,
                #1b3b6f 150deg 165deg, #0f2347 165deg 180deg,
                #1b3b6f 180deg 195deg, #0f2347 195deg 210deg,
                #1b3b6f 210deg 225deg, #0f2347 225deg 240deg,
                #1b3b6f 240deg 255deg, #0f2347 255deg 270deg,
                #1b3b6f 270deg 285deg, #0f2347 285deg 300deg,
                #1b3b6f 300deg 315deg, #0f2347 315deg 330deg,
                #1b3b6f 330deg 345deg, #0f2347 345deg 360deg
            );
            border: 12px solid rgba(0, 210, 255, 0.4);
            box-shadow: inset 0 0 80px #000, 0 0 50px rgba(0, 210, 255, 0.3);
            opacity: 0.65;
            top: 25%;
        }

        .wheel-center {
            position: absolute;
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, #0e2a4a 0%, #030c1a 100%);
            border-radius: 50%;
            border: 4px solid #00d2ff;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
        }

        .bg-overlay {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: radial-gradient(circle at center, rgba(3, 12, 26, 0.3) 0%, rgba(2, 11, 24, 0.95) 85%);
        }

        /* Header */
        .header {
            width: 100%;
            padding: 12px 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(3, 14, 33, 0.9);
            border-bottom: 2px solid #00d2ff;
            box-shadow: 0 0 15px rgba(0, 210, 255, 0.4);
            z-index: 2;
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .header-icon {
            width: 26px;
            height: 26px;
            filter: drop-shadow(0 0 6px #00d2ff);
        }

        .logo-title {
            font-family: 'Orbitron', sans-serif;
            font-size: 17px;
            font-weight: 900;
            color: #00ffcc;
            text-shadow: 0 0 8px #00ffcc, 0 0 15px #00d2ff;
            letter-spacing: 1px;
        }

        .sub-title {
            font-size: 10px;
            color: #00d2ff;
            letter-spacing: 1.5px;
            margin-top: 1px;
            font-family: 'Orbitron', sans-serif;
        }

        .dots { display: flex; gap: 5px; }
        .dot { width: 9px; height: 9px; border-radius: 50%; }
        .dot-green { background: #00ff88; box-shadow: 0 0 8px #00ff88; }
        .dot-blue { background: #00d2ff; box-shadow: 0 0 8px #00d2ff; }
        .dot-purple { background: #b5179e; box-shadow: 0 0 8px #b5179e; }

        /* Container */
        .container {
            position: relative;
            z-index: 2;
            width: 88%;
            max-width: 360px;
            margin: auto;
            text-align: center;
            padding: 15px 0;
        }

        .logo-box {
            width: 220px;
            height: 150px;
            margin: 0 auto 10px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .section-title {
            font-family: 'Orbitron', sans-serif;
            color: #00d2ff;
            font-size: 17px;
            font-weight: 800;
            margin-bottom: 22px;
            text-shadow: 0 0 10px rgba(0, 210, 255, 0.9);
            letter-spacing: 1px;
        }

        /* Form Controls */
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
            background: rgba(3, 18, 41, 0.85);
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
            background: linear-gradient(90deg, #0072ff, #00c6ff);
            color: #fff;
            box-shadow: 0 0 18px rgba(0, 198, 255, 0.6);
        }

        .btn-login:active { transform: scale(0.98); }

        .btn-pkg {
            background: linear-gradient(90deg, #00c6ff, #0072ff);
            color: #fff;
            box-shadow: 0 0 18px rgba(0, 198, 255, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .btn-pkg:active { transform: scale(0.98); }
    </style>
</head>
<body>

    <div class="bg-container">
        <div class="casino-wheel">
            <div class="wheel-center"></div>
        </div>
        <div class="bg-overlay"></div>
    </div>

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
        <!-- Reconstructed 3D Original Ice Fishing Logo -->
        <div class="logo-box">
            <svg width="220" height="140" viewBox="0 0 240 150" xmlns="http://www.w3.org/2000/svg">
                <!-- Fishing Rod Hook Outer Arc -->
                <path d="M 35 90 A 75 75 0 1 1 205 90" fill="none" stroke="#a0c8f0" stroke-width="4"/>
                <path d="M 30 90 A 80 80 0 1 1 210 90" fill="none" stroke="#00d2ff" stroke-width="1.5" stroke-dasharray="4 2"/>
                
                <!-- Fish Icons -->
                <!-- Red Fish -->
                <path d="M 110 50 Q 125 35, 145 50 Q 125 65, 110 50 Z" fill="#ff3333" stroke="#fff" stroke-width="1.5"/>
                <polygon points="145,50 155,42 152,50 155,58" fill="#ff3333"/>
                
                <!-- Yellow Fish -->
                <path d="M 130 35 Q 142 22, 158 35 Q 142 48, 130 35 Z" fill="#ffaa00" stroke="#fff" stroke-width="1"/>
                <polygon points="158,35 166,28 164,35 166,42" fill="#ffaa00"/>

                <!-- Blue Fish -->
                <path d="M 135 60 Q 145 50, 158 60 Q 145 70, 135 60 Z" fill="#0088ff" stroke="#fff" stroke-width="1"/>
                
                <!-- 3D ICE FISHING TEXT -->
                <text x="120" y="90" font-family="'Orbitron', sans-serif" font-weight="900" font-size="28" fill="#00d2ff" text-anchor="middle" style="text-shadow: 2px 2px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000, 0 0 12px #00d2ff;">ICE</text>
                
                <text x="120" y="115" font-family="'Orbitron', sans-serif" font-weight="900" font-size="26" fill="#ffffff" text-anchor="middle" style="text-shadow: 2px 2px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000, 0 0 10px #ffffff;">FISHING</text>
                
                <!-- Live Script Text -->
                <text x="120" y="132" font-family="'Rajdhani', sans-serif" font-weight="700" font-style="italic" font-size="16" fill="#00c6ff" text-anchor="middle" letter-spacing="2">Live</text>
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
