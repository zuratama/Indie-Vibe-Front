import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { deleteTrackList, performActionFavorite } from '../../apis/API';
import { streamCollection } from '../../apis/StreamAPI';
import Placeholder from '../../assets/imgs/placeholder.png';
import {
  FavoriteIcon,
  LogoTinyIcon,
  PauseIcon,
  PlayIcon,
  UnFavoriteIcon
} from '../../assets/svgs';
import { AuthContext, LibraryContext, StreamContext } from '../../contexts';
import { ButtonIcon, ButtonMore } from '../buttons';
import { NavLinkUnderline } from '../links';
import Skeleton from 'react-loading-skeleton';

function CardMain({ content = { relation: [] }, loading = false }) {
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

  const { artist = {}, owner = { role: {} } } = content;
  let isCurrentList =
    content.type === streamState.playFromType &&
    content.id === streamState.playFromId;

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
    if (isCurrentList) {
      streamDispatch(streamAction.togglePaused(false));
    } else {
      streamCollection(authState.token, content.type, content.id).then(res => {
        if (res.status === 'success' && res.data.length) {
          streamDispatch(
            streamAction.start(
              res.data,
              content.type,
              content.id,
              authState.role
            )
          );
        }
      });
    }
  };

  let ctxClasses = 'action playlist-release';
  if (
    isCurrentList ||
    (libState.ctxMenuOpened && content.id === libState.ctxMenuContent.id)
  )
    ctxClasses += ' active';
  return (
    <div className='card-main'>
      <div className='card-main__cover-wrapper'>
        <div className='dummy'></div>
        {loading ? (
          <div className='skeleton'>
            <Skeleton width='100%' height='100%' />
          </div>
        ) : (
          <React.Fragment>
            {owner.role.id === 'r-curator' ? (
              <div className='curator'>
                <LogoTinyIcon className='svg' />
              </div>
            ) : (
              ''
            )}
            <Link to={`/player/${content.type}/${content.id}`}>
              <img
                src={content.thumbnail ? content.thumbnail : Placeholder}
                className='cover'
              />
            </Link>
            <div className={ctxClasses}>
              <ButtonIcon>
                {isCurrentList && !streamState.paused ? (
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
                    artistId: artist.id
                  }}
                  handleToggleFavorite={handleToggleFavorite}
                  handleDeletePlaylist={handleDeletePlaylist}
                />
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
      <div className='card-main__info'>
        {loading ? (
          <Skeleton />
        ) : (
          <NavLinkUnderline
            href={`/player/${content.type}/${content.id}`}
            className='ellipsis one-line font-short-big font-weight-bold font-white'
          >
            {content.title}
          </NavLinkUnderline>
        )}
        <div className='bottom ellipsis two-line playlist-release font-short-s font-gray-light'>
          {loading ? (
            <Skeleton />
          ) : content.type === 'release' ? (
            <React.Fragment>
              <span>by&nbsp;</span>
              <NavLinkUnderline
                href={`/player/artist/${artist.id}`}
                className='font-gray-light'
              >
                {artist.displayName}
              </NavLinkUnderline>
            </React.Fragment>
          ) : (
            content.description
          )}
        </div>
      </div>
    </div>
  );
}

export default CardMain;
