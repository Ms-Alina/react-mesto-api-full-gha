import React from "react";

import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card(props) {
  const currentUser = React.useContext(CurrentUserContext);
  const isOwn = props.card.owner._id === currentUser._id;
  const isLiked = props.card.likes.some(i => i._id === currentUser._id);

  const cardLikeButtonClassName = (
    `element__like ${isLiked ? 'element__like_active' : ''}`
  );

  const cardDeleteButtonClassName = (
    `element__button-trash ${isOwn ? 'element__button-trash_active' : ''}`
  );

  function handleClick() {
    props.onCardClick(props.card);
  }

  function handleLikeClick() {
    props.onCardLike(props.card);
  }

  function handleDeleteClick() {
    props.onCardDelete(props.card);
  }

  return (
    <article className="element">
      <img  
        className="element__img" 
        src={props.card.link} 
        alt={`Фото ${props.card.name}`}  
        onClick={handleClick}
      />
      <div className="element__description">
        <h2 className="element__heading">{props.card.name}</h2>
        <div className="element__like-group">
          <div 
            role="button" 
            aria-label="Нравится" 
            className={cardLikeButtonClassName}
            onClick={handleLikeClick}
          ></div>
          <p className="element__like-sum">{props.likeCounter}</p>
        </div>
      </div>
      <div role="button" aria-label="Удалить" className={cardDeleteButtonClassName} onClick={handleDeleteClick}></div>
    </article>
  )
}

export default Card;