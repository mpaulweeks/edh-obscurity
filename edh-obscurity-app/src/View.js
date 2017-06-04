import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Select2 from 'react-select2-wrapper';
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

class List extends Component {
  render() {
    const display = MTG.ViewHelper.getCurrent();
    return (
      <div>
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

function Lookup(){
  return (
    <div>
      <Select2
        // ref="lookup"
        data={MTG.Data.getAllCards()}
        options={{
          placeholder: 'search by commander name',
        }}
      />
    </div>
  )
}

function MainView(){
  return (
    <div className="Manager">
      <div className="Title">
        EDH OBSCURITY INDEX CALCULATOR
      </div>
      <p>
        Calculate exactly how hipster you are!
      </p>
      <p>
        Idea courtesy of r/EDH user MagicalHacker
        (<a target="_blank" href="https://www.reddit.com/r/EDH/comments/6e79ai/whats_your_obscurity_index/">thread</a>)
      </p>
      <p>
        Deck counts last updated: {MTG.ViewHelper.getUpdated()}
      </p>
      <Lookup />
      <List />
    </div>
  )
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
        <MainView />,
        document.getElementById('root')
      );
    });
};

export default View;
