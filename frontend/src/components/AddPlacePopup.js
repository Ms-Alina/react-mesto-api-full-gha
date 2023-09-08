import React from "react";
import PopupWithForm from "./PopupWithForm";

// Компонент попапа добавления карточки
function AddPlacePopup(props) {
  const [name, setName] = React.useState('');
  const [link, setLink] = React.useState('');

  // Обработчики
  function handleAddName(evt) {
    setName(evt.target.value);
  }

  function handleAddLink(evt) {
    setLink(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();

    props.onSubmit({
      name: name,
      link: link
    });
  }

  React.useEffect(() => {
    if (props.isOpen) {
      setName('');
      setLink('');
    }
  }, [props.isOpen]);

  return(
    <PopupWithForm
      isOpen={props.isOpen}
      onCloseClick={props.onCloseClick}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      title='Новое место' 
      name='add-card' 
      formName='formAddCards'  
      //btnName='Создать' 
      btnName={props.isRender ? 'Сохранение...' :'Создать'}
      btnRole=''
      typeContainer=''
    >
      <input 
        id="nameCard-input" 
        type="text" 
        name="name" 
        autoComplete="off" 
        placeholder="Название" 
        required 
        minLength="2" 
        maxLength="30" 
        className="popup__input popup__input_info_heading-card" 
        value={name} 
        onChange={handleAddName} 
      />
      <span className="popup__input-error popup__input-error-place nameCard-input-error"></span>
      <input 
        id="callingCard-input" 
        type="url" 
        name="link" 
        autoComplete="off" 
        placeholder="Ссылка на картинку" 
        required 
        className="popup__input popup__input_info_url-img"
        value={link} 
        onChange={handleAddLink} 
      />
      <span className="popup__input-error popup__input-error-place callingCard-input-error"></span>
    </PopupWithForm>
  )
}

export default AddPlacePopup;