"use strict";

var primaryQuery = "https://www.quandl.com/api/v3/datasets/";
var apiKey = "?api_key=LX7VfcHnzf2e9xkexU6i";

var resourceMap = {
  "DOE/COAL": 'coal' ,
  "ODA/PIORECR_USD": 'iron' ,
  "WORLDBANK/WLD_GOLD": 'gold' ,
  "ODA/PTEA_USD": 'tobacco' ,
  "ODA/PLOGORE_USD": 'lumber',
  "ODA/PCOFFROB_USD": 'coffee' ,
  "ODA/PSUGAUSA_USD": 'fruits' ,
  "ODA/PRUBB_USD": 'vegies'
};

//jsonp.afeld.me/?url=
//encodeURIComponent('http://www.quandl.com/api/v3/datasets/WORLDBANK/WLD_BANANA_US')

var finalPrices = {
  'coal': 0,
  'iron': 0,
  'gold': 0,
  'tobacco': 0,
  'lumber': 0,
  'coffee': 0,
  'fruits': 0,
  'vegies': 0
};

function resourceMapCall(url, name) {

  $.ajax({
    type: 'GET',
    dataType: 'json',
    url: url,
  }).done(function(output) {

    finalPrices[name] = makeReasonable(output.dataset_data.data[0][1]);
    //console.log(name, output.dataset_data.data[0][1]);
    //console.log(finalPrices);
    document.getElementById('coalVal').innerHTML = '$' + finalPrices.coal;
    document.getElementById('goldVal').innerHTML = '$' + finalPrices.gold;
    document.getElementById('ironVal').innerHTML = '$' + finalPrices.iron;
    document.getElementById('tobaccoVal').innerHTML = '$' + finalPrices.tobacco;
    document.getElementById('lumberVal').innerHTML = '$' + finalPrices.lumber;
    document.getElementById('fruitsVal').innerHTML = '$' + finalPrices.fruits;
    document.getElementById('vegiesVal').innerHTML = '$' + finalPrices.vegies;
    document.getElementById('coffeeVal').innerHTML = '$' + finalPrices.coffee;
  });
}

function makeReasonable(number) {

  if (number > 1000) {
    return Math.floor(number / 100);
  }

  if (number > 25) {

    return Math.floor(number / 15);
  }

  return Math.floor(number / 10);
}

function sellResource(selling) {

  var result = prompt("How much " + selling + " would you like to sell?" , "1");

  if (result != null && !isNaN(result)) {
    if (result <= resources[selling]) {

      money += (finalPrices[selling] * result);
      resources[selling] -= result;
      alert('You successfully sold ' + result + ' ' + selling);
    } else {

      alert('You do not have enough ' + selling + '. You have ' + resources[selling] + ' and want to sell ' + result);
    }

  }
}

$(function() {

  for (var prop in resourceMap) {

    resourceMapCall(primaryQuery + prop + '/data.json' + apiKey, resourceMap[prop]);
  }
});
