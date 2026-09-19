const express = require('express');
const path = require('path');
const admin = require('firebase-admin');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Firebase Setup safely
let serviceAccount = {};
try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    }
} catch (e) {
    console.error("Firebase Service Account JSON Parse Error:", e.message);
}

if (serviceAccount && serviceAccount.project_id) {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://ice-fishing-3-a5c57-default-rtdb.asia-southeast1.firebasedatabase.app"
        });
    }
}

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>ICE FISHING FIXER</title>
  
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎣</text></svg>">
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap" rel="stylesheet">
  
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; user-select: none; -webkit-touch-callout: none; -webkit-user-select: none; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: #030814; color: #fff; }
    
    #globalTitleBar {
      position: relative;
      width: 100%;
      height: 60px;
      background: linear-gradient(135deg, rgba(0, 10, 30, 0.98), rgba(0, 40, 80, 0.95));
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
      border-bottom: 2px solid #00d2ff;
      box-shadow: 0 4px 20px rgba(0, 210, 255, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999;
      padding: 0 15px;
      animation: barGlow 3s infinite alternate;
    }

    @keyframes barGlow {
      0% { box-shadow: 0 4px 15px rgba(0, 210, 255, 0.3); border-bottom-color: #00d2ff; }
      50% { box-shadow: 0 4px 25px rgba(168, 85, 247, 0.6); border-bottom-color: #a855f7; }
      100% { box-shadow: 0 4px 15px rgba(0, 255, 102, 0.4); border-bottom-color: #00ff66; }
    }

    #globalTitleBar .bar-left { position: absolute; left: 15px; font-size: 22px; }
    #globalTitleBar .bar-center { display: flex; flex-direction: column; align-items: center; }
    #globalTitleBar .bar-title { font-family: 'Orbitron', sans-serif; font-weight: 900; font-size: 18px; background: linear-gradient(90deg, #00d2ff, #a855f7, #00ff66, #00d2ff); background-size: 300% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: 1.5px; }
    #globalTitleBar .bar-sub { font-family: 'Rajdhani', sans-serif; font-weight: 400; font-size: 9px; letter-spacing: 3px; color: rgba(255,255,255,0.8); text-transform: uppercase; margin-top: -1px; }
    #globalTitleBar .bar-right { position: absolute; right: 15px; display: flex; gap: 6px; }
    #globalTitleBar .bar-right .dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; }
    #globalTitleBar .bar-right .dot:nth-child(1) { background: #00ff66; }
    #globalTitleBar .bar-right .dot:nth-child(2) { background: #00d2ff; }
    #globalTitleBar .bar-right .dot:nth-child(3) { background: #a855f7; }

    .app-container { width: 100vw; height: calc(100vh - 60px); padding: 15px 20px; display: flex; flex-direction: column; justify-content: space-between; position: relative; z-index: 1; }
    .bg-overlay { position: absolute; top: -60px; left: 0; width: 100%; height: 100vh; background: linear-gradient(rgba(3,8,20,0.45), rgba(3,8,20,0.55)), url('/ice_fishing_website_thumbnail_700x700_2025_07_01.jpg'); background-size: cover; background-position: center; background-repeat: no-repeat; filter: blur(3px); transform: scale(1.05); z-index: -1; transition: opacity 0.4s ease; }
    .page { display: none; flex-direction: column; justify-content: center; height: 100%; width: 100%; }
    .active-page { display: flex; }
    
    .app-logo { width: 150px; max-width: 75%; height: auto; margin: 0 auto 15px auto; display: block; filter: drop-shadow(0 0 15px rgba(0,210,255,0.9)); }
    h2 { text-align: center; color: #00d2ff; margin-bottom: 15px; text-shadow: 0 0 12px #00d2ff; font-size: 20px; font-family: 'Rajdhani', sans-serif; font-weight: 700; }
    .input-group { margin-bottom: 15px; }
    .input-group label { display: block; margin-bottom: 6px; font-size: 14px; color: #fff; font-weight: 600; font-family: 'Rajdhani', sans-serif; }
    .password-wrapper { position: relative; width: 100%; }
    .input-group input { width: 100%; padding: 12px; padding-right: 45px; border-radius: 10px; border: 1.5px solid #00d2ff; background: rgba(6,15,38,0.75); color: #fff; font-size: 15px; outline: none; font-family: 'Rajdhani', sans-serif; }
    .toggle-eye { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); cursor: pointer; font-size: 18px; }
    
    .btn { width: 100%; padding: 14px; border: none; border-radius: 30px; background: linear-gradient(90deg, #0055ff, #00d2ff); color: #fff; font-size: 17px; font-weight: bold; cursor: pointer; text-shadow: 0 0 5px #000; box-shadow: 0 0 18px rgba(0,210,255,0.7); margin-top: 8px; text-align: center; text-decoration: none; display: block; font-family: 'Rajdhani', sans-serif; font-weight: 700; }
    .btn-pkg { background: linear-gradient(90deg, #8a2be2, #00d2ff); }
    
    #page3 { justify-content: space-between; }
    .header-banner { text-align: center; border-bottom: 2px solid #0055ff; padding-bottom: 8px; }
    .header-banner h1 { font-size: 20px; color: #fff; font-family: 'Orbitron', sans-serif; font-weight: 900; }
    .sub-title { color: #00d2ff; font-size: 11px; margin-top: 3px; font-family: 'Rajdhani', sans-serif; }
    .fixer-box { border: 2px solid #00d2ff; border-radius: 20px; padding: 15px 12px; background: rgba(10,25,54,0.85); }
    .fixer-title { display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 22px; font-weight: bold; margin-bottom: 12px; font-family: 'Orbitron', sans-serif; }
    .display-screen { height: 190px; border: 2px solid #00d2ff; border-radius: 20px; display: flex; justify-content: center; align-items: center; background: #030a1c; margin-bottom: 15px; padding: 10px; }
    .prediction-content { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%; text-align: center; }
    .prediction-text { font-size: 18px; font-weight: bold; color: #00ffff; font-family: 'Rajdhani', sans-serif; }
    
    .alert-card { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 10px; }
    .alert-icon { font-size: 32px; margin-bottom: 6px; }
    .alert-msg-main { font-size: 15px; font-weight: 700; color: #ff3366; font-family: 'Rajdhani', sans-serif; margin-bottom: 6px; }
    .alert-msg-sub { font-size: 12.5px; color: #ffd700; font-family: 'Rajdhani', sans-serif; font-weight: 600; }

    .support-box { border: 1px solid #0055ff; border-radius: 10px; padding: 10px 12px; background: #08132e; display: flex; justify-content: space-between; align-items: center; }
    .telegram-handle { font-size: 15px; font-weight: bold; color: #fff; font-family: 'Rajdhani', sans-serif; }
    .online-badge { color: #00ff66; font-size: 10px; font-weight: bold; font-family: 'Rajdhani', sans-serif; }
    .badges { display: flex; justify-content: space-between; font-size: 8px; color: #00d2ff; margin-bottom: 5px; text-align: center; font-family: 'Rajdhani', sans-serif; }

    /* Custom Popup Styles */
    #custom-alert-box {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #08132e;
      color: #fff;
      padding: 20px;
      border-radius: 15px;
      border: 2px solid #00d2ff;
      box-shadow: 0 0 25px rgba(0, 210, 255, 0.8);
      text-align: center;
      z-index: 10000;
      width: 85%;
      max-width: 300px;
      font-family: 'Rajdhani', sans-serif;
    }
    #custom-alert-box p { font-size: 15px; font-weight: 600; margin-bottom: 15px; }
    #custom-alert-box button {
      background: linear-gradient(90deg, #0055ff, #00d2ff);
      border: none;
      padding: 8px 25px;
      border-radius: 20px;
      color: #fff;
      font-weight: bold;
      cursor: pointer;
    }
  </style>
</head>
<body>

<div id="globalTitleBar">
  <span class="bar-left">🎣</span>
  <div class="bar-center">
    <span class="bar-title">ICE FISHING FIXER</span>
    <span class="bar-sub">⚡ PREMIUM SYSTEM v3.0</span>
  </div>
  <div class="bar-right">
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
  </div>
</div>

<div class="app-container">
  <div id="bgOverlay" class="bg-overlay"></div>

  <!-- PAGE 1: LOGIN -->
  <div id="page1" class="page active-page">
    <img src="/logo.png" class="app-logo" alt="Logo" onerror="this.style.display='none'">
    <h2>ICE FISHING LOGIN</h2>
    <div class="input-group">
      <label>Username</label>
      <input type="text" id="username" placeholder="Enter username">
    </div>
    <div class="input-group">
      <label>Password</label>
      <div class="password-wrapper">
        <input type="password" id="password" placeholder="Enter password">
        <span class="toggle-eye" id="togglePass">👁️</span>
      </div>
    </div>
    <button type="button" class="btn" id="loginBtn">LOGIN</button>
    <button type="button" class="btn btn-pkg" id="pkgBtn">🔒 SEE PACKAGES</button>
  </div>

  <!-- PAGE 2: SECURITY CODE -->
  <div id="page2" class="page">
    <h2>SECURITY VERIFICATION</h2>
    <p style="text-align: center; color: #ddd; margin-bottom: 15px; font-size: 13px; font-family: 'Rajdhani', sans-serif;">Enter your activation security code to unlock.</p>
    <div class="input-group">
      <label>Security Code</label>
      <div class="password-wrapper">
        <input type="password" id="secCode" placeholder="Enter security code">
        <span class="toggle-eye" id="toggleSec">👁️</span>
      </div>
    </div>
    <button type="button" class="btn" id="verifyBtn">VERIFY ACCESS</button>
  </div>

  <!-- PAGE 3: DASHBOARD -->
  <div id="page3" class="page">
    <div class="header-banner">
      <h1>ICE FISHING FIXER</h1>
      <div class="sub-title">— SMART FIXER SYSTEM —</div>
    </div>

    <div class="fixer-box">
      <div class="fixer-title"><span style="color:red;">🎯</span> FIXER</div>
      <div class="display-screen" id="displayBox">
        <div class="prediction-content" id="resultContent">
          <div class="prediction-text">READY</div>
        </div>
      </div>
      <button type="button" class="btn" id="nextBtn">⚡ NEXT ROUND &gt;&gt;</button>
    </div>

    <div class="support-box">
      <div>
        <div style="font-size: 10px; color: #8ab4f8; font-family: 'Rajdhani', sans-serif;">CONTRACT SUPPORT</div>
        <div class="telegram-handle" id="telegramHandle">@support</div>
      </div>
      <div style="text-align: right;">
        <div class="online-badge">● ONLINE</div>
      </div>
    </div>

    <div class="badges">
      <div>🛡️ 100% SECURE</div>
      <div>⚡ FAST SYSTEM</div>
      <div>🔒 TRUSTED</div>
    </div>
  </div>
</div>

<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js"></script>

<script>
  function showCustomAlert(msg) {
    var oldBox = document.getElementById('custom-alert-box');
    if (oldBox) oldBox.remove();

    var box = document.createElement('div');
    box.id = 'custom-alert-box';
    box.innerHTML = '<p>' + msg + '</p><button onclick="document.getElementById(\'custom-alert-box\').remove()">OK</button>';
    document.body.appendChild(box);
  }

  var telegramWebLink = '';

  // Firebase Setup
  try {
    var firebaseConfig = {
      apiKey: "AIzaSyBbi0r_8eyXqdjDDCjZRXzh2tkPg2x4oeA",
      authDomain: "ice-fishing-3-a5c57.firebaseapp.com",
      databaseURL: "https://ice-fishing-3-a5c57-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "ice-fishing-3-a5c57",
      storageBucket: "ice-fishing-3-a5c57.firebasestorage.app",
      messagingSenderId: "883346275621",
      appId: "1:883346275621:web:1b8649c7a3b0be10adaecc"
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    
    var database = firebase.database();
    database.ref('config').on('value', function(snapshot) {
      var config = snapshot.val();
      if (config) {
        telegramWebLink = config.telegramWeb || config.telegramDeep || '';
        document.getElementById('telegramHandle').innerText = config.telegramHandle || '@support';
      }
    });
  } catch(e) {
    console.log("Firebase Init error handled safely");
  }

  function goToPage(pageId) {
    document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active-page'); });
    document.getElementById(pageId).classList.add('active-page');
    document.getElementById('bgOverlay').style.opacity = (pageId === 'page3') ? '0' : '1';
  }

  document.getElementById('togglePass').onclick = function() {
    var p = document.getElementById('password');
    p.type = p.type === 'password' ? 'text' : 'password';
    this.innerText = p.type === 'password' ? '👁️' : '🙈';
  };

  document.getElementById('toggleSec').onclick = function() {
    var s = document.getElementById('secCode');
    s.type = s.type === 'password' ? 'text' : 'password';
    this.innerText = s.type === 'password' ? '👁️' : '🙈';
  };

  // Direct Button Click Event Binding
  document.getElementById('loginBtn').onclick = function() {
    var u = document.getElementById('username').value.trim();
    var p = document.getElementById('password').value.trim();

    if (!u || !p) {
      showCustomAlert('⚠️ Please enter Username and Password!');
      return;
    }

    document.getElementById('loginBtn').innerText = 'VERIFYING...';

    try {
      firebase.database().ref('auth').once('value').then(function(snapshot) {
        document.getElementById('loginBtn').innerText = 'LOGIN';
        var authData = snapshot.val();

        if (authData && u === authData.username && p === authData.password) {
          goToPage('page2');
        } else {
          showCustomAlert('❌ Invalid Username or Password!');
        }
      }).catch(function() {
        document.getElementById('loginBtn').innerText = 'LOGIN';
        showCustomAlert('❌ Connection Error!');
      });
    } catch(err) {
      document.getElementById('loginBtn').innerText = 'LOGIN';
      showCustomAlert('❌ Unable to connect to Database!');
    }
  };

  document.getElementById('pkgBtn').onclick = function() {
    var link = telegramWebLink || "https://t.me";
    var cleanLink = link.replace('tg://join?invite=', 'https://t.me/+');
    if (!cleanLink.startsWith('http')) {
      cleanLink = 'https://t.me/' + cleanLink.replace('@', '');
    }
    window.location.href = cleanLink;
  };

  document.getElementById('verifyBtn').onclick = function() {
    var code = document.getElementById('secCode').value.trim();
    if (!code) { showCustomAlert('⚠️ Enter Security Code!'); return; }

    try {
      firebase.database().ref('auth').once('value').then(function(snapshot) {
        var authData = snapshot.val();
        if (authData && code === authData.secCode) {
          goToPage('page3');
        } else {
          showCustomAlert('❌ Invalid Security Code!');
        }
      });
    } catch(err) {
      showCustomAlert('❌ Connection Error!');
    }
  };

  document.getElementById('nextBtn').onclick = function() {
    var displayBox = document.getElementById('displayBox');
    var resultContent = document.getElementById('resultContent');
    resultContent.innerHTML = '<div class="prediction-text">🔍 CHECKING...</div>';

    setTimeout(function() {
      resultContent.innerHTML = 
        '<div class="alert-card">' +
          '<div class="alert-icon">⚠️</div>' +
          '<div class="alert-msg-main">NO ACTIVE PACKAGE FOUND!</div>' +
          '<div class="alert-msg-sub">Contact admin to activate.</div>' +
        '</div>';
    }, 1200);
  };
</script>
</body>
</html>
    `);
});

app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });
