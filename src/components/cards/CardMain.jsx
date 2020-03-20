import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { NavLinkUnderline } from '../links';
import { ButtonIcon, ButtonMore } from '../buttons';
import { performActionFavorite, deleteTrackList } from '../../apis/API';
import { AuthContext, StreamContext, LibraryContext } from '../../contexts';
import { streamCollection } from '../../apis/StreamAPI';

import Placeholder from '../../assets/imgs/placeholder.png';
import {
  PlayIcon,
  UnFavoriteIcon,
  FavoriteIcon,
  PauseIcon
} from '../../assets/svgs';

function CardMain(props) {
  const { content } = props;

  const { state: authState } = useContext(AuthContext);
  const {
    state: streamState,
    actions: streamAction,
    dispatch: streamDispatch
  } = useContext(StreamContext);
  const {
    state: libState,
    actions: libActions,
    dispatch: libDispatch
  } = useContext(LibraryContext);

  const handleToggleFavorite = action => {
    performActionFavorite(
      authState.token,
      content.type,
      content.id,
      content.relation,
      action
    )
      .then(r => {
        libDispatch(
          libActions.toggleFavorite({
            id: content.id,
            type: content.type,
            relation: r
          })
        );
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleDeletePlaylist = id => {
    deleteTrackList(authState.token, content.type, id)
      .then(res => {
        if (res.status === 'success') {
          // ...
        } else {
          throw 'Failed to delete';
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handlePaused = () => {
    streamDispatch(streamAction.togglePaused(true));
  };

  const handlePlay = () => {
    if (content.id === streamState.playFromId) {
      streamDispatch(streamAction.togglePaused(false));
    } else {
      streamCollection(authState.token, content.type, content.id).then(res => {
        if (res.status === 'success' && res.data.length) {
          streamDispatch(
            streamAction.start(res.data, content.type, content.id)
          );
        }
      });
    }
  };

  let ctxClasses = 'action playlist-release';
  if (libState.ctxMenuOpened && content.id === libState.ctxMenuContent.id)
    ctxClasses += ' ctx-menu';
  return (
    <div className='card-main'>
      <div className='card-main__cover-wrapper'>
        <div className='dummy'></div>
        <Link to={`/player/${content.type}/${content.id}`}>
          <img
            src={content.thumbnail ? content.thumbnail : Placeholder}
            className='cover'
          />
        </Link>
        <div className={ctxClasses}>
          <ButtonIcon>
            {content.id === streamState.playFromId && !streamState.paused ? (
              <PauseIcon onClick={handlePaused} />
            ) : (
              <PlayIcon onClick={handlePlay} />
            )}
          </ButtonIcon>
          <div className='action__extra playlist-release'>
            {content.relation.includes('own') ? (
              ''
            ) : content.relation.includes('favorite') ? (
              <ButtonIcon>
                <FavoriteIcon
                  className='svg--blue'
                  onClick={() => {
                    handleToggleFavorite('unfavorite');
                  }}
                />
              </ButtonIcon>
            ) : (
              <ButtonIcon>
                <UnFavoriteIcon
                  onClick={() => {
                    handleToggleFavorite('favorite');
                  }}
                />
              </ButtonIcon>
            )}
            <ButtonMore
              ctxData={{
                type: content.type,
                id: content.id,
                relation: content.relation,
                status: content.status,
                artistId: content.artist ? content.artist.id : ''
              }}
              handleToggleFavorite={handleToggleFavorite}
              handleDeletePlaylist={handleDeletePlaylist}
            />
          </div>
        </div>
      </div>
      <div className='card-main__info'>
        <NavLinkUnderline
          href={`/player/${content.type}/${content.id}`}
          className='font-short-big font-weight-bold font-white'
        >
          {content.title}
        </NavLinkUnderline>
        <div className='content playlist-release font-short-s font-gray-light'>
          <span>
            {content.type === 'release' ? (
              <React.Fragment>
                <span>by&nbsp;</span>
                <NavLinkUnderline
                  href={`/player/artist/${content.artist.id}`}
                  className='font-gray-light'
                >
                  {content.artist.displayName}
                </NavLinkUnderline>
              </React.Fragment>
            ) : (
              content.description
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CardMain;
