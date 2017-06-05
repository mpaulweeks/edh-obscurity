
const MTG = {};

// Namespace for stateless helper functions
MTG.Calc = {};
MTG.Calc.calculateIndex = function(){
  let percents = [];
  let sum = 0;
  MTG.Data.getCurrent().forEach(function (cardName){
    const cardPercent = MTG.Data.getCount(cardName) / MTG.Data.getMaxCount();
    percents.push(cardPercent);
    sum += cardPercent;
  });
  return Math.floor(100 * (1 - (sum / percents.length)));
};
MTG.Calc.calculateCardIndex = function(cardName){
  const percent = MTG.Data.getCount(cardName) / MTG.Data.getMaxCount();
  return Math.floor(100 * (1 - percent));
}

// Stateful container of card info
MTG.Data = {};
MTG.Data.init = function(rawData){
  const rawCounts = rawData.counts;
  let lookup = {};
  rawCounts.forEach(function (tuple){
    const cardName = tuple[0];
    const cardCount = tuple[1];
    lookup[cardName] = cardCount;
  });
  let maxCardName = rawCounts[0][0];
  rawCounts.forEach(function (tuple){
    const cardName = tuple[0];
    const cardCount = tuple[1];
    if (cardCount > lookup[maxCardName]){
      maxCardName = cardName;
    }
  });

  MTG.Data.RawData = rawData;
  MTG.Data.Counts = lookup;
  MTG.Data.MaxCardName = maxCardName;
  MTG.Data.Current = {};

  // load url params here
  const param = MTG.Data.readUrlParam('c');
  if(param){
    MTG.Data.decodeCards(param).forEach(function (cardName){
      MTG.Data.addCard(cardName);
    });
  }
  window.history.replaceState({}, "", '?');
}
MTG.Data.getAllCards = function(){
  return Object.keys(MTG.Data.Counts).sort();
}
MTG.Data.getCount = function(cardName){
  return MTG.Data.Counts[cardName];
}
MTG.Data.getMaxCount = function(cardName){
  return MTG.Data.getCount(MTG.Data.MaxCardName);
}
MTG.Data.addCard = function(cardName){
  MTG.Data.Current[cardName] = true;
}
MTG.Data.removeCard = function(cardName){
  delete MTG.Data.Current[cardName];
}
MTG.Data.getCurrent = function(){
  return Object.keys(MTG.Data.Current);
}
MTG.Data.encodeCurrent = function(){
  const serialized = MTG.Data.getCurrent().sort().join('|');
  const encoded = window.btoa(serialized);
  return encoded;
}
MTG.Data.decodeCards = function(encoded){
  const serialized = window.atob(encoded);
  const cardNames = serialized.split('|');
  return cardNames;
}
MTG.Data.readUrlParam = function(paramName, asList){
  asList = asList || false;
  var vars = {};
  var q = document.URL.split('?')[1];
  if(q !== undefined){
    q = q.split('&');
    for(var i = 0; i < q.length; i++){
      var param = q[i].split('=');
      var name = param[0];
      var value = param[1];
      vars[name] = vars[name] || [];
      vars[name].push(value);
    }
  }
  if (vars.hasOwnProperty(paramName)){
    if (vars[paramName].length === 1 && !asList){
      return vars[paramName][0];
    }
    return vars[paramName];
  }
  return null;
}

// ViewHelper is stateless funcs for Views
MTG.ViewHelper = {};
MTG.ViewHelper.compareCards = function(a,b) {
  if (a.percent < b.percent)
    return -1;
  if (a.percent > b.percent)
    return 1;
  return 0;
}
MTG.ViewHelper.getCard = function(cardName){
  return {
    name: cardName,
    count: MTG.Data.getCount(cardName),
    index: MTG.Calc.calculateCardIndex(cardName),
    maxCount: MTG.Data.getMaxCount()
  }
}
MTG.ViewHelper.getCurrent = function(onRemove){
  let cards = [];
  MTG.Data.getCurrent().forEach(function(cardName){
    let cardDisplay = MTG.ViewHelper.getCard(cardName);
    cardDisplay.onRemove = function(){
      onRemove(cardName);
    };
    cards.push(cardDisplay);
  });
  let index = MTG.Calc.calculateIndex();
  if(isNaN(index)){
    index = '??';
  }
  return {
    permalink: MTG.ViewHelper.generatePermalink(),
    index: index,
    cards: cards.sort(MTG.ViewHelper.compareCards)
  }
}
MTG.ViewHelper.getUpdated = function(){
  return new Date(MTG.Data.RawData.updated).toLocaleDateString();
}
MTG.ViewHelper.generatePermalink = function(){
  const cardData = MTG.Data.encodeCurrent();
  const params = "?c=" + (cardData || '');
  const location = window.location;
  const baseUrl = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
  return baseUrl + params;
}

MTG.Public = function(){
  return MTG;
};
window.MTG = MTG.Public();

export default MTG;
