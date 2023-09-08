import React from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function EditProfilePopup(props) {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const currentUser = React.useContext(CurrentUserContext);

  function handleNameChange(evt) {
    setName(evt.target.value);
  }

  function handleDescriptionChange(evt) {
    setDescription(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();

    props.onSubmit({
      name: name,
      about: description,
    });
  }

  // Получаем текущие значения для установки в поля попапа
  React.useEffect(() => {
    if (props.isOpen) {
      setName(currentUser.name);
      setDescription(currentUser.about);
    }
  }, [props.isOpen, currentUser]);

  return(
    <PopupWithForm
      isOpen={props.isOpen}
      onCloseClick={props.onCloseClick}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      title='Редактировать профиль' 
      name='edit-profile' 
      formName='formEditProfile' 
      btnName={props.isRender ? 'Сохранение...' : 'Сохранить'}
      btnRole=''
      typeContainer=''
    >
      <input 
        id="nameProfile-input" 
        type="text" 
        name="name" 
        autoComplete="off" 
        placeholder="Имя" 
        required 
        minLength="2" 
        maxLength="40" 
        className="popup__input popup__input_info_name" 
        value={name} 
        onChange={handleNameChange} 
      />
      <span className="popup__input-error popup__input-error-place nameProfile-input-error"></span>
      <input 
        id="callingProfile-input" 
        type="text" 
        name="about" 
        autoComplete="off" 
        placeholder="Род деятельности" 
        required 
        minLength="2" 
        maxLength="200" 
        className="popup__input popup__input_info_calling"
        value={description} 
        onChange={handleDescriptionChange}  
      />
      <span className="popup__input-error popup__input-error-place callingProfile-input-error"></span>
    </PopupWithForm>
  )
}

export default EditProfilePopup;