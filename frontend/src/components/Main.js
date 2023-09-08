import React from 'react';

import Card from './Card.js';

import { CurrentUserContext } from '../contexts/CurrentUserContext.js';

function Main(props) {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main>
      <section className="profile">
        <div className="profile__description">
          <div className="profile__img-place">
            <img src={currentUser.avatar} alt={currentUser.name} className="profile__ava" />
            <button 
              className="profile__change-button" 
              type="button" 
              aria-label="Изменить аватар"
              onClick={props.onEditAvatar}
              min-height='auto'
            ></button>
          </div>
          <div className="profile__info">
            <h1 className="profile__name">{currentUser.name}</h1>
            <div 
              role="button" 
              aria-label="Редактировать профиль" 
              className="profile__button-edit"
              onClick={props.onEditProfile}
            ></div>
            <p className="profile__calling">{currentUser.about}</p>
          </div>
        </div>
        <div 
          role="button" 
          aria-label="Добавить" 
          className="profile__button-add"
          onClick={props.onAddPlace}
        ></div>
      </section>

      <section className="elements">
        {props.cards.map((card, _id) => (
            <Card
              key={card._id}
              card={card}
              link={card.link}
              name={card.name}
              likeCounter={card.likes.length}
              onCardClick={props.onCardClick}
              onCardLike={props.onCardLike}
              onCardDelete={props.onDeleteProve}
            />
          ))}
      </section>
    </main>
  )
}

export default Main;