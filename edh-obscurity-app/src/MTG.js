
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
  return (1 - (sum / percents.length)).toFixed(2) * 100;
};

// Stateful container of card info
MTG.Data = {};
MTG.Data.init = function(edhrecCounts){
  let lookup = {};
  edhrecCounts.forEach(function (tuple){
    const cardName = tuple[0];
    const cardCount = tuple[1];
    lookup[cardName] = cardCount;
  });
  let maxCardName = edhrecCounts[0][0];
  edhrecCounts.forEach(function (tuple){
    const cardName = tuple[0];
    const cardCount = tuple[1];
    if (cardCount > lookup[maxCardName]){
      maxCardName = cardName;
    }
  });

  MTG.Data.RawCounts = edhrecCounts;
  MTG.Data.Counts = lookup;
  MTG.Data.MaxCardName = maxCardName;
  MTG.Data.Current = {};

  MTG.Data.addCard('Phelddagrif');
  MTG.Data.addCard('Dragonlord Silumgar');
}
MTG.Data.getAllCards = function(){
  return Object.keys(MTG.Data.Counts);
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

// ViewHelper is stateless funcs for Views
MTG.ViewHelper = {};
MTG.ViewHelper.getCard = function(cardName){
  return {
    name: cardName,
    count: MTG.Data.getCount(cardName),
    maxCount: MTG.Data.getMaxCount()
  }
}
MTG.ViewHelper.getCurrent = function(){
  let cards = [];
  MTG.Data.getCurrent().forEach(function(cardName){
    cards.push(MTG.ViewHelper.getCard(cardName));
  });
  return {
    index: MTG.Calc.calculateIndex(),
    cards: cards
  }
}

MTG.Public = function(){
  return MTG;
};
window.MTG = MTG.Public();

export default MTG;
