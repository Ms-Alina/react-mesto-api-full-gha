import React from 'react';

import OK from '../images/OK.png';
import error from '../images/error.png';

// Компонент всплывающих подсказок
function InfoTooltip({ onClose, onCloseClick, result: { isOpen, successful } }) {
  return (
    <div className={`popup popup_type_tooltip ${isOpen ? 'popup_opened' : ''}`} onClick={onCloseClick}>
      <div className='popup__container popup__container_type_tooltip'>
        <img className='popup__img popup__img_type_tooltip' src={successful ? OK : error} alt='Результат операции' />
        <h2 className='popup__heading popup__heading_type_tooltip'>{successful ? 'Вы успешно зарегестрировались!' : 'Что-то пошло не так! Попробуйте еще раз.'}</h2>
        <div role="button" onClick={onClose} className="popup__close-icon" type="button" aria-label="Закрыть окно"></div>
      </div>
    </div>
  )
}

export default InfoTooltip;