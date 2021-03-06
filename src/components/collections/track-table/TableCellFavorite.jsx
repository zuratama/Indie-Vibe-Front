import React, { useContext } from 'react';
import { performActionFavorite } from '../../../apis/API';
import { FavoriteIcon, UnFavoriteIcon } from '../../../assets/svgs';
import { AuthContext, LibraryContext, StreamContext } from '../../../contexts';

function CellFavorite({ id = '', index = 0, relation = [] }) {
  const { state: authState } = useContext(AuthContext);
  const {
    state: streamState,
    actions: streamActions,
    dispatch: streamDispatch
  } = useContext(StreamContext);
  const { actions: libActions, dispatch: libDispatch } = useContext(
    LibraryContext
  );

  const handleToggleFavorite = action => {
    performActionFavorite(authState.token, 'track', id, relation, action)
      .then(r => {
        streamDispatch(streamActions.setTrackFavorite(id, r));
        libDispatch(
          libActions.toggleFavorite({
            id: id,
            type: 'track',
            relation: r
          })
        );
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div className='favorite center side'>
      {relation.includes('favorite') ? (
        <FavoriteIcon
          className='svg--cursor svg--scale svg--blue'
          onClick={() => {
            handleToggleFavorite('unfavorite');
          }}
        />
      ) : (
        <UnFavoriteIcon
          className='svg--cursor svg--scale'
          onClick={() => {
            handleToggleFavorite('favorite');
          }}
        />
      )}
    </div>
  );
}

export default CellFavorite;
