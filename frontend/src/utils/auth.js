class Api {
  constructor({ baseUrl }) {
    this._baseUrl = baseUrl;
  }
  
  _getResponseData(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  register = (email, password) => {
    return fetch(`${this._baseUrl}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    }).then((response) => {
      return this._getResponseData(response);
    });
  };

  authorize = (email, password) => {
    return fetch(`${this._baseUrl}/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    }).then((response) => this._getResponseData(response));
  };

  checkToken = (token) => {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
    }).then((res) => this._getResponseData(res));
  };
}

export const auth = new Api({
  baseUrl: 'https://api.mesto-gallery.student.nomoredomainsicu.ru',
});