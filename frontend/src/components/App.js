import { useEffect, useState } from 'react';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';

import Header from './Header';
import Main from './Main';
import Footer from './Footer';

import ImagePopup from './ImagePopup';

import Api from '../utils/Api.js';
import { auth } from '../utils/auth.js';
import AddPlacePopup from './AddPlacePopup';
import EditAvatarPopup from './EditAvatarPopup';
import EditProfilePopup from './EditProfilePopup';
import DeleteProvePopup from './DeleteProvePopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

import Register from './Register';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';

/* import * as auth from '../utils/auth'; */

function App() {
  const [currentUser, setCurrentUser] = useState({});

  // Состояние попапов
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isProfilePopupOpened, setIsProfilePopupOpened] = useState(false);
  const [isInfoTooltip, setInfoTooltip] = useState({ isOpen: false, successful: false });

  // Состояние карточек
  const [selectedCard, setSelectedCard] = useState(null);
  const [cards, setCards] = useState([]);
  const [selectedCardDeleteProve, setSelectedCardDeleteProve] = useState({ isOpen: false, card: {} });

  // Состояние обработки 
  const [renderSaving, setRenderSaving] = useState(false);

  // Состояние авторизации пользователя и его данных
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');

  // Что добавлено мной
  const [dataLoadingError, setDataLoadingError] = useState('');

  const history = useHistory();

  const api = new Api({
    url: 'https://api.mesto-gallery.student.nomoredomainsicu.ru',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${localStorage.getItem('jwt')}`,
    },
  })

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      auth.checkToken(jwt)
        .then(data => {
          if (data) {
            setEmail(data.email);
            handleLoggedIn();
            history.push('/');
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  const handleSignOut = () => {
    setLoggedIn(false);
    setEmail('');
    localStorage.removeItem('jwt');
    // history.push('/signin');
  };

  useEffect(() => {
    loggedIn &&
      Promise.all([api.getUserData(), api.getInitialCards()])
        .then(([user, cards]) => {
          setCurrentUser(user);
          setCards(cards.reverse());
        })
        .catch((err) => {
          setDataLoadingError(`Something goes wrong... (${err})`);
        });
  }, [loggedIn]);

  const handleRegister = (values) => {
    if (!values.email || !values.email) {
      return;
    }
    auth
      .register(values.email, values.password)
      .then((res) => {
        handleInfoTooltip((prev) => !prev);
        history.push('/signin');
      })
      .catch((err) => {
        handleInfoTooltip((prev) => !prev);
        setDataLoadingError(`Something goes wrong... (${err})`);
      });
  };

  const handleLogin = (values) => {
    if (!values.email || !values.password) {
      return;
    }
    auth
      .authorize(values.email, values.password)
      .then((data) => {
        if (data.token) {
          localStorage.setItem('jwt', data.token);
          setEmail(values.email);
          setLoggedIn(true);
        }
      })
      .catch((err) => {
        handleInfoTooltip((prev) => !prev);
        setDataLoadingError(`Something goes wrong... (${err})`);
      });
  };

  const isOpen = isAddPlacePopupOpen || isEditAvatarPopupOpen || isEditProfilePopupOpen || isProfilePopupOpened || selectedCard || isInfoTooltip;

  useEffect(() => {
    if (isOpen) {
      function handleEsc(evt) {
        if (evt.key === 'Escape') {
          closeAllPopups();
        }
      }
      document.addEventListener('keydown', handleEsc);
      return () => {
        document.removeEventListener('keydown', handleEsc);
      }
    }
  }, [isOpen]);

  function handleUpdateUser(data) {
    setRenderSaving(true);
    api.saveUserChanges(data)
      .then(newUser => {
        setCurrentUser(newUser);
        closeAllPopups();
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setRenderSaving(false);
      });
  }

  function handleAddPlaceSubmit(data) {
    setRenderSaving(true);
    api.postNewCard(data)
      .then(newCard => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setRenderSaving(false);
      });
  }

  function handleAvatarUpdate(data) {
    setRenderSaving(true);
    api.changedAvatar(data)
      .then(newAvatar => {
        setCurrentUser(newAvatar);
        closeAllPopups();
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setRenderSaving(false);
      });
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    if (!isLiked) {
      api.likedCard(card._id)
        .then(newCard => {
          setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      api.dislikedCard(card._id)
        .then((newCard) => {
          setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  function handleCardDelete(card) {
    setRenderSaving(true);
    api.deleteCard(card._id)
      .then(() => {
        setCards((items) => items.filter((c) => c._id !== card._id && c));
        closeAllPopups();
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setRenderSaving(false);
      });
  }


  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleImagePopupOpen(card) {
    setSelectedCard(card);
  }

  function handleDeleteProve(card) {
    setSelectedCardDeleteProve({ ...setSelectedCardDeleteProve, isOpen: true, card: card });
  }

  function handlePopupCloseClick(evt) {
    if (evt.target.classList.contains('popup')) {
      closeAllPopups();
    }
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
    setIsProfilePopupOpened(false);
    setSelectedCardDeleteProve({ ...setSelectedCardDeleteProve, isOpen: false });
    setInfoTooltip(false);
  }

  function handleLoggedIn() {
    setLoggedIn(true);
  }

  function handleInfoTooltip(result) {
    setInfoTooltip({ ...isInfoTooltip, isOpen: true, successful: result });
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header email={email} onSignOut={handleSignOut} />

        <Switch>
          <ProtectedRoute
            exact path='/'
            loggedIn={loggedIn}
            component={Main}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleImagePopupOpen}
            cards={cards}
            onCardLike={handleCardLike}
            onDeleteProve={handleDeleteProve}
            dataLoadingError={dataLoadingError}
          />

          <Route path="/signin">
            <Login onLogin={handleLogin} />
          </Route>

          <Route path="/signup">
            <Register onRegister={handleRegister} />
          </Route>

          <Route>
            {loggedIn ? (
              <Redirect to="/" />
            ) : (
              <Redirect to="/signin" />
            )}
          </Route>
        </Switch>

        <Footer />

        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
          onCloseClick={handlePopupCloseClick}
        />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onCloseClick={handlePopupCloseClick}
          onSubmit={handleUpdateUser}
          isRender={renderSaving}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onCloseClick={handlePopupCloseClick}
          onSubmit={handleAddPlaceSubmit}
          isRender={renderSaving}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onCloseClick={handlePopupCloseClick}
          onSubmit={handleAvatarUpdate}
          isRender={renderSaving}
        />

        <DeleteProvePopup
          deleteCard={selectedCardDeleteProve}
          onClose={closeAllPopups}
          onCloseClick={handlePopupCloseClick}
          onDeleteCard={handleCardDelete}
          isRender={renderSaving}
        />

        <InfoTooltip
          result={isInfoTooltip}
          onClose={closeAllPopups}
          onCloseClick={handlePopupCloseClick}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
