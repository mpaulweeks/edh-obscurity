import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import MTG from './MTG';
import './MTG.css';

const Card = function(props){
  const {
    display,
  } = props
  return (
    <div>
      <div>
        {display.name}
      </div>
      <div>
        {display.count} / {display.maxCount}
      </div>
    </div>
  )
}

class Manager extends Component {
  render() {
    const display = MTG.ViewHelper.getCurrent();
    return (
      <div className="Manager">
        <div className="Title">
          EDH OBSCURITY INDEX CALCULATOR
        </div>
        One of these cards costs {1} more mana than the other.
        Click on the card you think costs more!
        <div className="Scoreboard">
          Index: {display.index}
        </div>
        <div className="Card-Container">
          {display.cards.map(function(cardDisplay) {
            return <Card key={cardDisplay.name} display={cardDisplay} />
          })}
        </div>
      </div>
    )
  }
}

function Loading(){
  return (
    <div className="Manager">
      <div className="Title">
        loading, please wait...
      </div>
    </div>
  )
}

function Error(){
  return (
    <div className="Manager">
      <div className="Title">
        there was an error loading the data
      </div>
    </div>
  )
}

const View = {};
View.initApp = function(){
  ReactDOM.render(
    <Loading />,
    document.getElementById('root')
  );
  fetch('https://s3.amazonaws.com/edh-obscurity/edh_deck_counts.json')
    .then(function(response) {
      if (response.status >= 400) {
        ReactDOM.render(
          <Error />,
          document.getElementById('root')
        );
        throw new Error("Bad response from server");
      }
      return response.json();
    })
    .then(function(data) {
      MTG.Data.init(data);
      ReactDOM.render(
        <Manager />,
        document.getElementById('root')
      );
    });
};

export default View;
