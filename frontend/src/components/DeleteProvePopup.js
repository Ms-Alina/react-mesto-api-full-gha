import React from "react";
import PopupWithForm from "./PopupWithForm";

function DeleteProvePopup({ deleteCard:{ isOpen, card }, onClose, onDeleteCard, onCloseClick }) {
  function handleSubmit(evt) {
    evt.preventDefault();

    onDeleteCard(card);
  }

  return(
    <PopupWithForm 
      isOpen={isOpen}
      onCloseClick={onCloseClick}
      onClose={onClose}
      onDeleteCard={onDeleteCard}
      onSubmit={handleSubmit}
      title='Вы уверены?' 
      name='prove' 
      formName='formProve' 
      btnName='Да'
      btnRole='popup__button-submit_type_prove'
      typeContainer='popup__container_type_prove'>
    </PopupWithForm>
  )
}

export default DeleteProvePopup;