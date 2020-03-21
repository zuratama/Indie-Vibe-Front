import React from 'react';

import { CardMain, CardMainMin, CardProfile } from '../cards';

function CollectionMain(props) {
  return (
    <div className='collection-main collection-main--extended'>
      <div className='collection-main__header'>{props.header}</div>
      <div className='collection-main__content grid'>
        <Content items={props.items} type={props.type} />
      </div>
    </div>
  );
}

function Content(props) {
  let { items } = props;

  switch (props.type) {
    case 'playlist':
    case 'release':
      return items.map((item, index) => (
        <CardMain content={item} key={index} index={index} />
      ));
    case 'artist':
    case 'profile':
      return items.map((item, index) => (
        <CardProfile content={item} key={index} index={index} />
      ));
    case 'browse-playlist':
      return items.map((item, index) => (
        <CardMainMin content={item} key={index} index={index} />
      ));
  }

  return '';
}

export default CollectionMain;
