import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import MTG from './MTG';
import './MTG.css';

const Card = function(props){
  const {
    display,
  } = props
  return (
    <div className="row Card">
      <div className="col-md-6">{display.name}</div>
      <div className="col-md-2">{display.count}</div>
      <div className="col-md-2 Index-Score">{display.index}</div>
      <div className="col-md-2 Remove clickable" onClick={display.onRemove}></div>
    </div>
  )
}

class List extends Component {
  render() {
    const {
      display,
    } = this.props
    return (
      <div className="row Section">
        <div className="col-md-3"></div>
        <div className="col-md-6">
          <div className="row Card Card-Header">
            <div className="col-md-6">Commander</div>
            <div className="col-md-2">Decks</div>
            <div className="col-md-2">Index</div>
            <div className="col-md-2">Remove</div>
          </div>
          {display.cards.map(function(cardDisplay) {
            return <Card key={cardDisplay.name} display={cardDisplay} />
          })}
        </div>
        <div className="col-md-3"></div>
      </div>
    )
  }
}

class MainView extends Component {
  constructor(){
    super();
    this.onChange = this.onChange.bind(this);
    this.onRemove = this.onRemove.bind(this);
    let options = [];
    MTG.Data.getAllCards().forEach(function (cardName){
      options.push({ value: cardName, label: cardName })
    })
    this.state = {
      options: options,
      updated: MTG.ViewHelper.getUpdated(),
      current: MTG.ViewHelper.getCurrent(this.onRemove),
    };
  }
  onChange(arg){
    MTG.temp = arg.value;
    MTG.Data.addCard(arg.value);
    var newState = {
      current: MTG.ViewHelper.getCurrent(this.onRemove),
    };
    this.setState(newState);
  }
  onRemove(cardName){
    MTG.Data.removeCard(cardName);
    var newState = {
      current: MTG.ViewHelper.getCurrent(this.onRemove),
    };
    this.setState(newState);
  }
  render() {
    return (
      <div className="container Manager">
        <div className="Title">
          EDH Obscurity Index Calculator
        </div>
        <p>
          Created by <a target="_blank" href="https://twitter.com/mpaulweeks">@mpaulweeks</a>
        </p>
        <p>
          Original idea from a <a target="_blank" href="https://www.reddit.com/r/EDH/comments/6e79ai/whats_your_obscurity_index/">r/EDH thread</a> by <a target="_blank" href="https://www.reddit.com/user/MagicalHacker">MagicalHacker</a>
        </p>
        <p>
          Made possible thanks to <a target="_blank" href="https://edhrec.com/">edhrec.com</a>
        </p>
        <p>
          Data last updated: {this.state.updated}
        </p>
        <div className="Section">
          <div className="Total-Index">
            Overall Index: <span className="Index-Score">{this.state.current.index}</span>
          </div>
          <p>
            the higher the percent, the more hip you are
          </p>
        </div>
        <div className="row Section">
          <div className="col-md-3"></div>
          <Select
            className="col-md-6"
            options={this.state.options}
            onChange={this.onChange}
            autofocus
            placeholder="Type in Commander name..."
          />
          <div className="col-md-3"></div>
        </div>
        <List display={this.state.current}/>
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
        <MainView />,
        document.getElementById('root')
      );
    });
};

export default View;
