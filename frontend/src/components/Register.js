import React from 'react';
import { Link } from 'react-router-dom';

// Компонент регистрации пользователя
function Register({ onRegister }) {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  // Обработчики
  function handleChangeEmail(evt) {
    setEmail(evt.target.value);
  }

  function handleChangePassword(evt) {
    setPassword(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    onRegister(password, email);
  }

  return (
    <section className="entry" >
      <div className="entry__container">
        <h3 className="entry__heading">Регистрация</h3>
        <form 
          className="entry__form"
          name="entry__form-register" 
          onSubmit={handleSubmit}
        >
          <input
            id="loggin-input"
            type="email"
            name="loggin"
            autoComplete="off"
            placeholder="Email"
            required
            minLength="2"
            maxLength="40"
            className="entry__input"
            value={email}
            onChange={handleChangeEmail} 
          />

          <input
            id="password-input"
            type="password"
            name="password"
            autoComplete="off"
            placeholder="Пароль"
            required
            minLength="4"
            maxLength="10"
            className="entry__input"
            value={password}
            onChange={handleChangePassword}
          />

          <button className="entry__button-submit" type="submit">Зарегистрироваться</button>
          <Link to="sign-in" className="entry__link">Уже зарегестрированы? Войти</Link>
        </form>
      </div>
    </section>
  )
}

export default Register;