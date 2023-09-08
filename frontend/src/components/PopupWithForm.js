import React from "react";

function PopupWithForm(props) {
  return (
    <div className={`popup popup_type_${props.name} ${props.isOpen ? 'popup_opened' : ''}`} onClick={props.onCloseClick}>
      <div className={`popup__container ${props.typeContainer}`}>
        <h2 className="popup__heading">{props.title}</h2>
        <form className="popup__form" name={props.formName} onSubmit={props.onSubmit}>
          <>{props.children}</>
          <button className={`popup__button-submit ${props.btnRole}`} type="submit">{props.btnName || 'Сохранить'}</button>
        </form>
        <div role="button" onClick={props.onClose} className="popup__close-icon" aria-label="Закрыть окно"></div>
      </div>
    </div>
  )
}

export default PopupWithForm;