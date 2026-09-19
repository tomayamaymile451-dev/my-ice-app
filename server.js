const express = require('express');
const admin = require('firebase-admin');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

if (serviceAccount.project_id) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://ice-fishing-3-a5c57-default-rtdb.firebaseio.com"
    });
}

// ১. টেলিগ্রাম চ্যানেল লিংক API
app.get('/api/telegram-link', (req, res) => {
    // আপনার টেলিগ্রাম চ্যানেল লিংক
    res.json({ link: 'https://t.me/+iuwzgCxozp5hNDg1' });
});

// ২. সিকিউর লগইন API
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

// ৩. ফ্রন্টএন্ড অরিজিনাল UI (আগের হুবহু ডিজাইন)
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
            background: #040814 url('https://i.ibb.co/C3fJvBf/wheel-bg.jpg') center/cover no-repeat fixed;
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
            background: rgba(4, 8, 20, 0.75);
            z-index: 1;
        }
        .header {
            width: 100%;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(8, 15, 38, 0.85);
            border-bottom: 2px solid #00d2ff;
            box-shadow: 0 0 15px rgba(0, 210, 255, 0.3);
            z-index: 2;
        }
        .logo-title {
            font-family: 'Orbitron', sans-serif;
            font-size: 18px;
            font-weight: 900;
            color: #7b2cbf;
            text-shadow: 0 0 10px #00d2ff, 0 0 20px #00d2ff;
            letter-spacing: 1px;
        }
        .sub-title {
            font-size: 10px;
            color: #00d2ff;
            letter-spacing: 2px;
            margin-top: 2px;
        }
        .dots { display: flex; gap: 4px; }
        .dot { width: 8px; height: 8px; border-radius: 50%; }
        .dot-green { background: #00ff88; box-shadow: 0 0 8px #00ff88; }
        .dot-blue { background: #00d2ff; box-shadow: 0 0 8px #00d2ff; }
        .dot-purple { background: #9d4edd; box-shadow: 0 0 8px #9d4edd; }

        .container {
            position: relative;
            z-index: 2;
            width: 90%;
            max-width: 380px;
            margin: auto;
            text-align: center;
            padding: 20px 0;
        }
        .main-logo {
            width: 150px;
            margin-bottom: 10px;
            filter: drop-shadow(0 0 15px rgba(0, 210, 255, 0.6));
        }
        .section-title {
            font-family: 'Orbitron', sans-serif;
            color: #00d2ff;
            font-size: 18px;
            margin-bottom: 20px;
            text-shadow: 0 0 8px rgba(0, 210, 255, 0.8);
            letter-spacing: 1px;
        }
        .input-group {
            text-align: left;
            margin-bottom: 15px;
            position: relative;
        }
        .input-group label {
            display: block;
            font-size: 14px;
            color: #d8f3dc;
            margin-bottom: 5px;
            font-weight: 600;
        }
        .input-box {
            width: 100%;
            padding: 12px 15px;
            background: rgba(10, 25, 50, 0.6);
            border: 2px solid #00d2ff;
            border-radius: 12px;
            color: #fff;
            font-size: 15px;
            outline: none;
            box-shadow: inset 0 0 10px rgba(0, 210, 255, 0.2);
            transition: 0.3s;
        }
        .input-box:focus {
            box-shadow: 0 0 15px rgba(0, 210, 255, 0.6);
        }
        .eye-icon {
            position: absolute;
            right: 15px;
            bottom: 12px;
            cursor: pointer;
            opacity: 0.7;
        }
        .btn {
            width: 100%;
            padding: 14px;
            border-radius: 12px;
            border: none;
            font-family: 'Orbitron', sans-serif;
            font-size: 15px;
            font-weight: 700;
            cursor: pointer;
            margin-top: 12px;
            transition: 0.3s;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .btn-login {
            background: linear-gradient(90deg, #0077b6, #00b4d8);
            color: #fff;
            box-shadow: 0 0 15px rgba(0, 180, 216, 0.5);
        }
        .btn-login:active { transform: scale(0.98); }
        .btn-pkg {
            background: linear-gradient(90deg, #7209b7, #b5179e);
            color: #fff;
            box-shadow: 0 0 15px rgba(181, 23, 158, 0.5);
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
        <div>
            <div class="logo-title">ICE FISHING FIXER</div>
            <div class="sub-title">⚡ PREMIUM SYSTEM V3.0</div>
        </div>
        <div class="dots">
            <div class="dot dot-green"></div>
            <div class="dot dot-blue"></div>
            <div class="dot dot-purple"></div>
        </div>
    </div>

    <div class="container">
        <svg class="main-logo" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
            <path d="M40,100 Q100,20 160,100 Q100,140 40,100 Z" fill="none" stroke="#00d2ff" stroke-width="4"/>
            <path d="M70,80 Q100,40 130,80 Q100,110 70,80 Z" fill="#ff4d4d"/>
            <text x="100" y="115" font-family="'Orbitron', sans-serif" font-weight="900" font-size="18" fill="#ffffff" text-anchor="middle">ICE FISHING</text>
            <text x="100" y="130" font-family="'Rajdhani', sans-serif" font-weight="700" font-size="12" fill="#00d2ff" text-anchor="middle">LIVE</text>
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
        // SEE PACKAGES বাটন ইভেন্ট
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

        // LOGIN বাটন ইভেন্ট
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
