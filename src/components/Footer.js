import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div>Zenith File Manager v1.0.0</div>
      <div>© 2026 Zenith AI Lab - All Rights Reserved</div>
      <div style={{display: 'flex', gap: '15px'}}>
        <span>Privacy Policy</span>
        <span>Support</span>
      </div>
    </footer>
  );
};

export default Footer;