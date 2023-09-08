import logo from '../images/Vector.svg';
import React, { useState } from 'react';
import { Link, Route } from 'react-router-dom';

function Header({email, onSignOut}) {
  const [isClicked, setIsClicked] = useState(false);

  function handleClickMenu() {
    setIsClicked(!isClicked);
  }

  return (
    <header className="header">
      <div className={`header__box ${isClicked ? 'header__box_type_small' : ''}`}>
        <img className={`logo ${isClicked ? 'logo_type_small' : ''}`} src={logo} alt="Логотип Место" />
        <Route path='/sign-in'>
          <Link to='sign-up' className='header__link'>Регистрация</Link>
        </Route>
        <Route path='/sign-up'>
          <Link to='sign-in' className='header__link'>Войти</Link>
        </Route>
        <Route exact path='/'>
          <div className={`header__button_type_menu ${isClicked ? 'header__button_type_menu-close' : ''}`} onClick={handleClickMenu}>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className={`header__user-box ${isClicked ? 'header__user-box_type_small' : ''}`}>
            <p className='header__email'>{email}</p>
            <button 
              onClick={() => {
                onSignOut();
                handleClickMenu();
              }} 
              className='header__button'>Выйти</button>
          </div>
        </Route>
      </div>
    </header>
  )
}

export default Header;