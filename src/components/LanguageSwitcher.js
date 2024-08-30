import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
      <button onClick={() => changeLanguage('en')} className="btn btn-link">English</button>
      <button onClick={() => changeLanguage('fr')} className="btn btn-link">Français</button>
    </div>
  );
};

export default LanguageSwitcher;
