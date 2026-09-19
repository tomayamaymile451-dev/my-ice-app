const express = require('express');
const path = require('path');
const admin = require('firebase-admin');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// public ফোল্ডার স্ট্যাটিক সার্ভিস
app.use(express.static(path.join(__dirname, 'public')));

// Firebase Admin SDK Config
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

if (serviceAccount.project_id) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://ice-fishing-3-a5c57-default-rtdb.asia-southeast1.firebasedatabase.app"
    });
}

// Full Reconstructed Web App
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
    
    /* Global Animated Title Bar */
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

    #globalTitleBar .bar-left { 
      position: absolute; 
      left: 15px; 
      font-size: 22px; 
      animation: floatIcon 2s infinite ease-in-out;
    }

    @keyframes floatIcon {
      0%, 100% { transform: translateY(0); filter: drop-shadow(0 0 8px rgba(0, 210, 255, 0.8)); }
      50% { transform: translateY(-3px); filter: drop-shadow(0 0 12px rgba(168, 85, 247, 0.9)); }
    }

    #globalTitleBar .bar-center { display: flex; flex-direction: column; align-items: center; }
    
    #globalTitleBar .bar-title { 
      font-family: 'Orbitron', sans-serif; 
      font-weight: 900; 
      font-size: 18px; 
      background: linear-gradient(90deg, #00d2ff, #a855f7, #00ff66, #00d2ff); 
      background-size: 300% auto; 
      -webkit-background-clip: text; 
      -webkit-text-fill-color: transparent; 
      letter-spacing: 1.5px; 
      animation: shineText 3s linear infinite;
    }

    @keyframes shineText {
      0% { background-position: 0% center; }
      100% { background-position: 300% center; }
    }

    #globalTitleBar .bar-sub { 
      font-family: 'Rajdhani', sans-serif; 
      font-weight: 400; 
      font-size: 9px; 
      letter-spacing: 3px; 
      color: rgba(255,255,255,0.8); 
      text-transform: uppercase; 
      margin-top: -1px; 
      text-shadow: 0 0 5px rgba(0,210,255,0.5);
    }

    #globalTitleBar .bar-right { position: absolute; right: 15px; display: flex; gap: 6px; }
    #globalTitleBar .bar-right .dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; animation: dotPulse 1.5s infinite alternate; }
    #globalTitleBar .bar-right .dot:nth-child(1) { background: #00ff66; animation-delay: 0s; }
    #globalTitleBar .bar-right .dot:nth-child(2) { background: #00d2ff; animation-delay: 0.3s; }
    #globalTitleBar .bar-right .dot:nth-child(3) { background: #a855f7; animation-delay: 0.6s; }

    @keyframes dotPulse {
      0% { transform: scale(0.8); box-shadow: 0 0 2px currentColor; }
      100% { transform: scale(1.3); box-shadow: 0 0 8px currentColor; }
    }

    .app-container { width: 100vw; height: calc(100vh - 60px); padding: 15px 20px; display: flex; flex-direction: column; justify-content: space-between; position: relative; z-index: 1; }
    
    /* Background Image with original name from public folder */
    .bg-overlay { 
      position: absolute; 
      top: -60px; 
      left: 0; 
      width: 100%; 
      height: 100vh; 
      background: linear-gradient(rgba(3,8,20,0.45), rgba(3,8,20,0.55)), url('/ice_fishing_website_thumbnail_700x700_2025_07_01.jpg'); 
      background-size: cover; 
      background-position: center; 
      background-repeat: no-repeat; 
      filter: blur(3px); 
      transform: scale(1.05); 
      z-index: -1; 
      transition: opacity 0.4s ease; 
    }
    
    .page { display: none; flex-direction: column; justify-content: center; height: 100%; width: 100%; }
    .active-page { display: flex; }
    
    /* Logo Image with original name from public folder */
    .app-logo { 
      width: 150px; 
      max-width: 75%; 
      height: auto; 
      margin: 0 auto 15px auto; 
      display: block; 
      filter: drop-shadow(0 0 15px rgba(0,210,255,0.9)); 
      -webkit-user-drag: none; 
      user-drag: none; 
      pointer-events: none; 
    }

    h2 { text-align: center; color: #00d2ff; margin-bottom: 15px; text-shadow: 0 0 12px #00d2ff, 0 0 5px #000; letter-spacing: 1px; font-size: 20px; font-family: 'Rajdhani', sans-serif; font-weight: 700; }
    .input-group { margin-bottom: 15px; }
    .input-group label { display: block; margin-bottom: 6px; font-size: 14px; color: #fff; text-shadow: 0 0 5px #000; font-weight: 600; font-family: 'Rajdhani', sans-serif; letter-spacing: 1px; }
    .password-wrapper { position: relative; width: 100%; }
    .input-group input { width: 100%; padding: 12px; padding-right: 45px; border-radius: 10px; border: 1.5px solid #00d2ff; background: rgba(6,15,38,0.75); backdrop-filter: blur(5px); color: #fff; font-size: 15px; outline: none; box-shadow: inset 0 0 8px rgba(0,210,255,0.4), 0 0 10px rgba(0,0,0,0.5); font-family: 'Rajdhani', sans-serif; }
    .toggle-eye { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); cursor: pointer; font-size: 18px; opacity: 0.8; transition: opacity 0.2s; pointer-events: auto; }
    
    .btn { width: 100%; padding: 14px; border: none; border-radius: 30px; background: linear-gradient(90deg, #0055ff, #00d2ff); color: #fff; font-size: 17px; font-weight: bold; cursor: pointer; text-shadow: 0 0 5px #000; box-shadow: 0 0 18px rgba(0,210,255,0.7); transition: all 0.2s ease; margin-top: 8px; text-align: center; text-decoration: none; display: block; pointer-events: auto; font-family: 'Rajdhani', sans-serif; font-weight: 700; letter-spacing: 1px; }
    .btn:active { transform: scale(0.96); }
    .btn-pkg { background: linear-gradient(90deg, #8a2be2, #00d2ff); }
    
    #page3 { justify-content: space-between; }
    .header-banner { text-align: center; border-bottom: 2px solid #0055ff; padding-bottom: 8px; margin-top: 0; padding-top: 0; }
    .header-banner h1 { font-size: 20px; color: #fff; letter-spacing: 2px; text-shadow: 0 0 10px #00d2ff; font-family: 'Orbitron', sans-serif; font-weight: 900; }
    .sub-title { color: #00d2ff; font-size: 11px; letter-spacing: 3px; margin-top: 3px; font-family: 'Rajdhani', sans-serif; font-weight: 300; }
    .fixer-box { border: 2px solid #00d2ff; border-radius: 20px; padding: 15px 12px; background: rgba(10,25,54,0.85); box-shadow: 0 0 20px rgba(0,210,255,0.2); }
    .fixer-title { display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 22px; font-weight: bold; margin-bottom: 12px; font-family: 'Orbitron', sans-serif; font-weight: 700; }
    .display-screen { height: 190px; border: 2px solid #00d2ff; border-radius: 20px; display: flex; justify-content: center; align-items: center; position: relative; background: #030a1c; box-shadow: inset 0 0 20px rgba(0,210,255,0.4); margin-bottom: 15px; overflow: hidden; transition: all 0.3s ease; padding: 10px; }
    .prediction-content { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%; text-align: center; }
    .prediction-text { font-size: 18px; font-weight: bold; color: #00ffff; text-shadow: 0 0 12px #00ffff; text-align: center; letter-spacing: 1px; font-family: 'Rajdhani', sans-serif; font-weight: 700; }
    
    .alert-card { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 10px; animation: alertPop 0.5s ease-out forwards; }
    .alert-icon { font-size: 32px; margin-bottom: 6px; animation: pulseIcon 1.2s infinite ease-in-out; }
    .alert-msg-main { font-size: 15px; font-weight: 700; color: #ff3366; text-shadow: 0 0 10px rgba(255, 51, 102, 0.8); font-family: 'Rajdhani', sans-serif; margin-bottom: 6px; line-height: 1.2; letter-spacing: 1px; }
    .alert-msg-sub { font-size: 12.5px; color: #ffd700; text-shadow: 0 0 8px rgba(255, 215, 0, 0.6); font-family: 'Rajdhani', sans-serif; font-weight: 600; letter-spacing: 0.5px; }
    
    @keyframes alertPop { 0% { transform: scale(0.7); opacity: 0; } 80% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
    @keyframes pulseIcon { 0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px #ff3366); } 50% { transform: scale(1.25); filter: drop-shadow(0 0 15px #ff0055); } }

    .box-searching { animation: box-glow 0.8s infinite ease-in-out; border-color: #ff0055 !important; box-shadow: inset 0 0 30px rgba(255,0,85,0.6), 0 0 20px rgba(255,0,85,0.6) !important; }
    @keyframes box-glow { 0% { transform: scale(1); } 50% { transform: scale(1.02); } 100% { transform: scale(1); } }
    .support-box { border: 1px solid #0055ff; border-radius: 10px; padding: 10px 12px; background: #08132e; display: flex; justify-content: space-between; align-items: center; }
    .telegram-handle { font-size: 15px; font-weight: bold; color: #fff; font-family: 'Rajdhani', sans-serif; }
    .online-badge { color: #00ff66; font-size: 10px; font-weight: bold; font-family: 'Rajdhani', sans-serif; }
    .badges { display: flex; justify-content: space-between; font-size: 8px; color: #00d2ff; margin-bottom: 5px; text-align: center; font-family: 'Rajdhani', sans-serif; font-weight: 600; }
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
    <img src="/ChatGPT Image Jun 18, 2026, 03_30_50 PM.png" class="app-logo" alt="Logo" onerror="this.style.display='none';">
    <h2>ICE FISHING LOGIN</h2>
    <div class="input-group">
      <label>Username</label>
      <input type="text" id="username" placeholder="Enter username" autocomplete="off">
    </div>
    <div class="input-group">
      <label>Password</label>
      <div class="password-wrapper">
        <input type="password" id="password" placeholder="Enter password" autocomplete="off">
        <span class="toggle-eye" id="togglePass">👁️</span>
      </div>
    </div>
    <button class="btn" id="loginBtn">LOGIN</button>
    <a href="#" class="btn btn-pkg" id="pkgBtn">🔒 SEE PACKAGES</a>
  </div>

  <!-- PAGE 2: SECURITY CODE -->
  <div id="page2" class="page">
    <img src="/ChatGPT Image Jun 18, 2026, 03_30_50 PM.png" class="app-logo" alt="Logo" onerror="this.style.display='none';">
    <h2>SECURITY VERIFICATION</h2>
    <p style="text-align: center; color: #ddd; margin-bottom: 15px; font-size: 13px; font-family: 'Rajdhani', sans-serif;">Enter your activation security code to unlock.</p>
    <div class="input-group">
      <label>Security Code</label>
      <div class="password-wrapper">
        <input type="password" id="secCode" placeholder="Enter security code" autocomplete="off">
        <span class="toggle-eye" id="toggleSec">👁️</span>
      </div>
    </div>
    <button class="btn" id="verifyBtn">VERIFY ACCESS</button>
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
      <button class="btn" id="nextBtn">⚡ NEXT ROUND &gt;&gt;</button>
    </div>

    <div class="support-box">
      <div>
        <div style="font-size: 10px; color: #8ab4f8; font-family: 'Rajdhani', sans-serif;">CONTRACT SUPPORT</div>
        <div class="telegram-handle" id="telegramHandle">Loading...</div>
      </div>
      <div style="text-align: right;">
        <div class="online-badge">● ONLINE</div>
        <div style="font-size: 9px; color: #aaa; font-family: 'Rajdhani', sans-serif;">We're here to help!</div>
      </div>
    </div>

    <div class="badges">
      <div>🛡️ 100% SECURE<br>PROTECTED</div>
      <div>⚡ SECURE SYSTEM<br>FAST & RELIABLE</div>
      <div>🔒 TRUSTED<br>& VERIFIED</div>
    </div>
  </div>
</div>

<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js"></script>

<script>
(function() {
  'use strict';

  var firebaseConfig = {
    apiKey: "AIzaSyBbi0r_8eyXqdjDDCjZRXzh2tkPg2x4oeA",
    authDomain: "ice-fishing-3-a5c57.firebaseapp.com",
    databaseURL: "https://ice-fishing-3-a5c57-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ice-fishing-3-a5c57",
    storageBucket: "ice-fishing-3-a5c57.firebasestorage.app",
    messagingSenderId: "883346275621",
    appId: "1:883346275621:web:1b8649c7a3b0be10adaecc"
  };

  firebase.initializeApp(firebaseConfig);
  var database = firebase.database();
  var auth = firebase.auth();

  auth.signInAnonymously().catch(function(error) { console.error("Auth error:", error); });

  var telegramDeepLink = '';
  var telegramWebLink = '';

  database.ref('config').on('value', function(snapshot) {
    var config = snapshot.val();
    if (config) {
      telegramDeepLink = config.telegramDeep || '';
      telegramWebLink = config.telegramWeb || '';
      document.getElementById('telegramHandle').innerText = config.telegramHandle || '@support';
    }
  });

  var bgOverlay = document.getElementById('bgOverlay');
  var usernameInput = document.getElementById('username');
  var passwordInput = document.getElementById('password');
  var secCodeInput = document.getElementById('secCode');
  var loginBtn = document.getElementById('loginBtn');
  var verifyBtn = document.getElementById('verifyBtn');
  var nextBtn = document.getElementById('nextBtn');
  var pkgBtn = document.getElementById('pkgBtn');
  var displayBox = document.getElementById('displayBox');
  var resultContent = document.getElementById('resultContent');

  function goToPage(pageId) {
    document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active-page'); });
    document.getElementById(pageId).classList.add('active-page');
    bgOverlay.style.opacity = (pageId === 'page3') ? '0' : '1';
  }

  document.getElementById('togglePass').addEventListener('click', function() {
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
    this.innerText = passwordInput.type === 'password' ? '👁️' : '🙈';
  });

  document.getElementById('toggleSec').addEventListener('click', function() {
    secCodeInput.type = secCodeInput.type === 'password' ? 'text' : 'password';
    this.innerText = secCodeInput.type === 'password' ? '👁️' : '🙈';
  });

  loginBtn.addEventListener('click', function(e) {
    e.preventDefault();
    var u = usernameInput.value.trim();
    var p = passwordInput.value.trim();

    if (!u || !p) { alert('⚠️ Please enter both Username and Password!'); return; }

    loginBtn.innerText = 'VERIFYING...';

    database.ref('auth').once('value').then(function(snapshot) {
      loginBtn.innerText = 'LOGIN';
      var authData = snapshot.val();

      if (authData && u === authData.username && p === authData.password) {
        goToPage('page2');
        usernameInput.value = '';
        passwordInput.value = '';
      } else {
        alert('❌ Invalid Username or Password!');
        passwordInput.value = '';
      }
    }).catch(function(error) {
      loginBtn.innerText = 'LOGIN';
      alert('❌ Access Denied / Connection Error!');
    });
  });

  verifyBtn.addEventListener('click', function(e) {
    e.preventDefault();
    var code = secCodeInput.value.trim();

    if (!code) { alert('⚠️ Please enter the Security Code!'); return; }

    verifyBtn.innerText = 'VERIFY ACCESS';

    database.ref('auth').once('value').then(function(snapshot) {
      verifyBtn.innerText = 'VERIFY ACCESS';
      var authData = snapshot.val();

      if (authData && code === authData.secCode) {
        goToPage('page3');
        secCodeInput.value = '';
      } else {
        alert('❌ Invalid Security Code!');
        secCodeInput.value = '';
      }
    }).catch(function(error) {
      verifyBtn.innerText = 'VERIFY ACCESS';
      alert('❌ Access Denied / Connection Error!');
    });
  });

  pkgBtn.addEventListener('click', function(e) {
    e.preventDefault();
    if (!telegramDeepLink && !telegramWebLink) { alert('Loading Telegram Link...'); return; }
    var win = window.open(telegramDeepLink, '_blank');
    setTimeout(function() {
      if (!win || win.closed || typeof win.closed == 'undefined') {
        window.open(telegramWebLink, '_blank');
      }
    }, 1000);
  });

  nextBtn.addEventListener('click', function() {
    displayBox.classList.add('box-searching');
    resultContent.innerHTML = '<div class="prediction-text">🔍 CHECKING PACKAGE STATUS...</div>';

    setTimeout(function() {
      displayBox.classList.remove('box-searching');
      var noPackageHtml = 
        '<div class="alert-card">' +
          '<div class="alert-icon">⚠️</div>' +
          '<div class="alert-msg-main">NO ACTIVE PACKAGE FOUND!</div>' +
          '<div class="alert-msg-sub">Please contact admin to activate your package first. Thank you.</div>' +
        '</div>';
      resultContent.innerHTML = noPackageHtml;
    }, 1500);
  });

  goToPage('page1');
})();
</script>
</body>
</html>
    `);
});

app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });
