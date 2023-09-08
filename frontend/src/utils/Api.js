export default class Api {
  constructor({
    baseUrl,
    headers
  }) {
    this._baseUrl = baseUrl;
    this._userUrl = `${this._baseUrl}/users/me`;
    this._cardsUrl = `${this._baseUrl}/cards`;
    this._likesUrl = `${this._baseUrl}/cards/likes`;
    this._token = headers['authorization'];
  }

  // Метод проверки ответа сервера
  _getResponseData(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  // Получем информацию о пользователе с сервера
  async getUserData() {
    const res = await fetch(this._userUrl, {
      headers: {
        authorization: this._token,
      }
    });
    return this._getResponseData(res);
  }

  // Сохраняем отредактированные данные пользователя на сервере
  async saveUserChanges({
    name,
    about
  }) {
    const res = await fetch(this._userUrl, {
      method: 'PATCH',
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        about: about,
      })
    });
    return this._getResponseData(res);
  }

  // Обновляем аватар пользователя
  async changedAvatar(src) {
    const res = await fetch(`${this._userUrl}/avatar`, {
      method: 'PATCH',
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        avatar: src,
      })
    });
    return this._getResponseData(res);
  }

  // Получаем карточеки с сервера
  async getInitialCards() {
    const res = await fetch(this._cardsUrl, {
      headers: {
        authorization: this._token,
      }
    });
    return this._getResponseData(res);
  }

  // Добавляем новую карточку на сервер
  async postNewCard({
    name,
    link
  }) {
    const res = await fetch(this._cardsUrl, {
      method: 'POST',
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        link: link,
      })
    });
    return this._getResponseData(res);
  }

  // Удаляем карточки пользователя с сервера
  deleteCard(cardId) {
    return fetch(`${this._cardsUrl}/${cardId}`, {
        method: 'DELETE',
        headers: {
          authorization: this._token,
        }
      })
      .then(res => {
        return this._getResponseData(res);
      })
  }

  // Ставим лайк карточке
  likedCard(cardId) {
    return fetch(`${this._likesUrl}/${cardId}`, {
        method: 'PUT',
        headers: {
          authorization: this._token,
        }
      })
      .then(res => {
        return this._getResponseData(res);
      })
  }

  // Удаляем лайк с карточки
  dislikedCard(cardId) {
    return fetch(`${this._likesUrl}/${cardId}`, {
        method: 'DELETE',
        headers: {
          authorization: this._token,
        }
      })
      .then(res => {
        return this._getResponseData(res);
      })
  }
}

// Создаем экземпляр класса Api
export const api = new Api({
  baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-68',
  headers: {
    authorization: '04191f74-b685-4000-9654-e8e43ee7e193',
    'Content-Type': 'application/json'
  }
});