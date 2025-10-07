// frontend/src/components/Footer.jsx
import React from 'react';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer-container">
      <p>&copy; {currentYear} MMTech. Todos os direitos reservados.</p>
    </footer>
  );
}

export default Footer;