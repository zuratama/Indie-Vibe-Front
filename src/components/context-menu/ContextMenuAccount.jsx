import React, { useContext } from 'react';

import { LinkWhiteColor, NavLinkColor } from '../links';
import { AuthContext } from '../../contexts';

function ContextMenuAccount(props) {
  const { actions: authAction, dispatch: authDispatch } = useContext(
    AuthContext
  );

  const handleLogout = () => {
    window.location.href = '/login';
    authDispatch(authAction.logout());
  };

  return (
    <div className='context-wrapper'>
      <ul className='context-menu d-flex flex-column'>
        <li>
          {props.fromLanding ? (
            <LinkWhiteColor
              href='/player/account'
              className='font-short-regular font-weight-bold font-white'
            >
              Account
            </LinkWhiteColor>
          ) : (
            <NavLinkColor
              href='/player/account'
              className='font-short-regular font-weight-bold font-white'
            >
              Account
            </NavLinkColor>
          )}
        </li>
        <li>
          <LinkWhiteColor
            onClick={handleLogout}
            className='font-short-regular font-weight-bold font-white'
          >
            Logout
          </LinkWhiteColor>
        </li>
      </ul>
    </div>
  );
}

export default ContextMenuAccount;
