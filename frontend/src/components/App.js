import { useEffect, useState } from 'react';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';

import Header from './Header';
import Main from './Main';
import Footer from './Footer';

import ImagePopup from './ImagePopup';

import Api from '../utils/Api.js';
import AddPlacePopup from './AddPlacePopup';
import EditAvatarPopup from './EditAvatarPopup';
import EditProfilePopup from './EditProfilePopup';
import DeleteProvePopup from './DeleteProvePopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

import Register from './Register';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';

import { auth } from '../utils/auth';

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

  const [dataIsLoaded, setDataIsLoaded] = useState(false);
  const [dataLoadingError, setDataLoadingError] = useState('');

  const history = useHistory();

  const api = new Api({
    // url: 'http://localhost:3000',
    url: 'https://api.mesto-gallery.student.nomoredomainsicu.ru',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${localStorage.getItem('jwt')}`,
    },
  });

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      auth.checkToken(jwt)
        .then((res) => {
          if (res) {
            setLoggedIn(true);
            history.push('/');
            setEmail(res.email);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Обработчик выхода
  function handleSignOut() {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    setEmail('');
    history.push('/signin');
  }

  useEffect(() => {
    loggedIn &&
      Promise.all([api.getUserData(), api.getInitialCards()])
        .then(([user, cards]) => {
          setCurrentUser(user);
          setCards(cards.reverse());
          setDataIsLoaded(true);
        })
        .catch((err) => {
          setDataLoadingError(`Что-то пошло не так... (${err})`);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  // Обработчик регистрации
  function handleRegister(email, password) {
    if (!email || !password) {
      return;
    }
    auth.register(email, password)
      .then((res) => {
        // setErr(false);
        // setInfoTooltip((prev) => !prev);
        handleInfoTooltip(true);
        history.push('/signin', { replace: true });
      })
      .catch((err) => {
        // setErr(true);
        // setInfoTooltip((prev) => !prev);
        handleInfoTooltip(false);
        console.log(err);
      });
  }

  // Обработчик авторизации
  function handleLogin(email, password) {
    if (!email || !password) {
      return;
    }
    auth.login(email, password)
      .then((data) => {
        if (data.token) {
          localStorage.setItem('jwt', data.token);
          setEmail(email);
          setLoggedIn(true);
          history.push('/');
        }
      })
      .catch((err) => {
        handleInfoTooltip(false);
        console.log(err);
      });
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        const newCards = cards.map((c) => (c._id === card._id ? newCard : c));
        setCards(newCards);
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateUser(user) {
    setRenderSaving(true);
    api.saveUserChanges(user)
      .then(() => {
        setCurrentUser({ ...currentUser, name: user.name, about: user.about });
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setRenderSaving(false);
      });
  }

  function handleAddPlaceSubmit(card) {
    setRenderSaving(true);
    api.postNewCard(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setRenderSaving(false);
      });
  }

  function handleCardDelete(card) {
    setRenderSaving(true);
    api.deleteCard(card._id)
      .then(() => {
        const newCards = cards.filter((c) => c._id !== card._id);
        setCards(newCards);
      })
      .then(() => closeAllPopups())
      .catch((err) => console.log(err))
      .finally(() => {
        setRenderSaving(false);
      });
  }

  function handleAvatarUpdate(avatar) {
    setRenderSaving(true);
    api.changedAvatar(avatar)
      .then((user) => {
        setCurrentUser(user);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setRenderSaving(false);
      });
  }

  const isOpen = isAddPlacePopupOpen || isEditAvatarPopupOpen || isEditProfilePopupOpen || isProfilePopupOpened || selectedCard || isInfoTooltip || selectedCardDeleteProve;

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

  function handleInfoTooltip(result) {
    setInfoTooltip({ ...isInfoTooltip, isOpen: true, successful: result });
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
            dataIsLoaded={dataIsLoaded}
            dataLoadingError={dataLoadingError}
          />

          <Route path="/signin">
            <Login
              onLogin={handleLogin}
              setInfoTooltip={setInfoTooltip}
              setEmail={setEmail}
            />
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
          isOpen={isProfilePopupOpened}
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