import React from 'react';

// Компонент авторизации пользователя
function Login({ onLogin }) {

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
    if (!email || !password){
      return;
    }
    onLogin(password, email);
  }

  return (
    <div className="entry">
      <div className="entry__container">
        <h2 className="entry__heading">Вход</h2>
        <form 
          className="entry__form" 
          name="entry-form-login "
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
          <button className="entry__button-submit" type="submit">Войти</button>
        </form>
      </div>
    </div>
  )

}

export default Login;