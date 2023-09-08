function ImagePopup(props) {
  return (
    <div className={`popup popup_type_big-img ${props.card ? 'popup_opened' : ''}`} onClick={props.onCloseClick}>
      <div className="popup__wrapper-img">
        <div 
          role="button" 
          aria-label="Закрыть окно" 
          className="popup__close-icon"
          onClick={props.onClose}
        ></div>
        <img 
          className="popup__img" 
          src={props.card ? props.card.link : ''} 
          alt={props.card ? props.card.name : ''} 
        />
        <h2 className="popup__heading-img">{props.card ? props.card.name : ''}</h2>
      </div>
    </div>
  )
}

  export default ImagePopup;