import React from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup(props) {
  const avatarRef = React.useRef();

  function handleSubmit(evt) {
    evt.preventDefault();

    props.onSubmit(avatarRef.current.value);
  }

  React.useEffect(() => {
    avatarRef.current.value = '';
  }, [props.isOpen]);

  return(
    <PopupWithForm 
      isOpen={props.isOpen}
      onCloseClick={props.onCloseClick}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      title='Обновить аватар' 
      name='change-avatar' 
      formName='formChangeAvatar' 
      btnName={props.isRender ? 'Сохранение...' : 'Сохранить'}
      btnRole=''
      typeContainer='popup__container_type_change-avatar'
    >
      <input 
        ref={avatarRef}
        id="changeAvatar-input" 
        type="url" 
        name="link" 
        autoComplete="off" 
        placeholder="Ссылка на картинку" 
        required 
        className="popup__input popup__input_change-avatar_url-img" 
      />
      <span className="popup__input-error popup__input-error-place changeAvatar-input-error"></span>
    </PopupWithForm>
  )
}

export default EditAvatarPopup;