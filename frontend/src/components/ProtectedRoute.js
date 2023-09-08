import React from "react";
import { Route, Redirect } from "react-router-dom";

// Компонент принимает другой компонент в качестве пропса (принимает неограниченное число пропсов)
const ProtectedRoute = ({ component: Component, ...props }) => {
  return (
    <Route>
      {() =>
        props.loggedIn ? <Component {...props} /> : <Redirect to="./sign-in" />
      }
    </Route>
  );
};

export default ProtectedRoute; 