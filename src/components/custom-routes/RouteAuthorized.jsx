import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../../contexts';
import { ROLE_GROUPS } from '../../config/RoleRouting';

function RouteAuthorized({
  component: Component,
  path,
  roleGroup = {},
  ...rest
}) {
  const { state: authState } = useContext(AuthContext);

  return (
    <Route
      path={path}
      {...rest}
      render={props => {
        if (
          !roleGroup.roles.length ||
          roleGroup.roles.includes(authState.role)
        ) {
          return <Component {...props} {...rest} />;
        } else {
          let redirect = roleGroup.redirect;
          if (roleGroup === ROLE_GROUPS.GUEST && authState.prevLogin) {
            redirect = authState.prevLogin;
          }

          return (
            <Redirect
              to={{
                pathname: redirect,
                state: { from: props.location }
              }}
            />
          );
        }
      }}
    />
  );
}

export default RouteAuthorized;
