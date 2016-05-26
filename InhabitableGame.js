"use strict";

var buildingArray = [];
var resources = {
  water: 0,
  lumber: 0,
  power: 0,
  coffee: 0,
  tobacco: 0,
  fruits: 0,
  vegies: 0,
  coal: 0,
  iron: 0,
  gold: 0
};

var filledSpaces = [];
var rawResources = {
  coalMines: [],
  ironMines: [],
  goldMines: [],
  forests: [],
  lakes: []
};

var start = +(new Date);

var money = 1000; //TODO: change back
var upkeepCost = 0;

var points = 0;

var citizens = 1;
var death = 0;
var health = 100;
var pollution = 0;

var moneyPerCitizen = 2;

var base = 16;
var squareSize = 16 * 25;

var lastClickX = -1;
var lastClickY = -1;

var currClickX = -1;
var currClickY = -1;

var grassSprite = new Image();
var grassSprite1 = new Image();
var forestTree = new Image();
var coalOre = new Image();
var ironOre = new Image();
var goldOre = new Image();
var lakes = new Image();

//buildings
//var buildPlace = new Image();
var dockImg = new Image();
var planeImg = new Image();
var farmImg = new Image();
var lumbermillImg = new Image();
var waterpumpImg = new Image();
var coalMineImg = new Image();
var ironMineImg =  new Image();
var goldMineImg = new Image();
var powergenImg = new Image();

var associationsList = {

  'coalMine': 'coalOre',
  'ironMine': 'ironOre',
  'goldMine': 'goldOre',
  'waterpump': 'waterpool',
  'lumbermill': 'forest'
};

function canIOperate(buildObj) {

  var left = getResource(buildObj.location[0] - base, buildObj.location[1]);
  var right = getResource(buildObj.location[0] + base, buildObj.location[1]);
  var up = getResource(buildObj.location[0], buildObj.location[1] + base);
  var down = getResource(buildObj.location[0], buildObj.location[1] - base);

  //console.log(buildObj.type, left, right, up, down);

  var iAmA = buildObj.type;
  var correctPair = associationsList[iAmA];

  if (left != null && left.type === correctPair) return left;
  if (right != null && right.type === correctPair) return right;
  if (up != null && up.type === correctPair) return up;
  if (down != null && down.type === correctPair) return down;

  return null;
}

String.prototype.toHHMMSS = function () {

  var sec_num = parseInt(this, 10);
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}

  return hours+':'+minutes+':'+seconds;
}

//initialCost = cost to create the building in the world
//creationCost = resources used to create buildingObject
// -- base off of resources object
//buildingObject = call to createConstObject
function createBuildinding(initialCost, creationCost, buildingObject) {

  //console.log(buildingObject.location);

  //console.log(money - initialCost);
  if (money - initialCost < 0) {

    alert('You lack the funds to create this building.');
    return;
  }

  for (var currRes in creationCost) {

    if (resources[currRes] == null || resources[currRes] - creationCost[currRes] < 0) {

      alert('You lack the resources required to build this, you need: ' + JSON.stringify(creationCost));
      return;
    }
  }

  money -= initialCost;
  for (var currRes in creationCost) {

    resources[currRes] -= creationCost[currRes];
  }

  buildingArray.push(buildingObject);
  console.log(buildingArray);
  //draw buidling at x, y location on canvas

  var toBuildAtLoc;
  //console.log(buildingArray[i].location, lastClickX, lastClickY);

  if (buildingObject.type === 'lumbermill') {

    toBuildAtLoc = lumbermillImg;
  } else if (buildingObject.type === 'waterpump') {

    toBuildAtLoc = waterpumpImg;
  } else if (buildingObject.type === 'waterturbine' || buildingObject.type === 'coalGenerator') {

    toBuildAtLoc = powergenImg;
  } else if (buildingObject.type === 'coalMine') {

    toBuildAtLoc = coalMineImg;
  } else if (buildingObject.type === 'ironMine') {

    toBuildAtLoc = ironMineImg;
  } else if (buildingObject.type === 'goldMine') {

    toBuildAtLoc = goldMineImg;
  } else if (buildingObject.type === 'coffeeFarm' ||
  buildingObject.type === 'tobaccoFarm' ||
  buildingObject.type === 'fruitFarm' ||
  buildingObject.type === 'vegiFarm') {

    toBuildAtLoc = farmImg;
  } else if (buildingObject.type === 'airport') {

    toBuildAtLoc = planeImg;
  } else if (buildingObject.type === 'dock') {

    toBuildAtLoc = dockImg;
  }

  var context = document.getElementById('canvas').getContext('2d');
  context.drawImage(toBuildAtLoc, currClickX, currClickY);
}

function createConstObject(type, powerGenerated, powerConsumed, product, productGenerated, productConsumed, productCost, moneyGenerated, useTick, workers, maxWorkers, upkeepCost, generatesPts, importsPeople, chanceImport, tickRate, polution, x, y) {

  return {
    type: type,
    powerGen: powerGenerated,
    powerConsume: powerConsumed,
    resource: product,
    productGened: productGenerated,
    productEaten: productConsumed,
    costEaten: productCost,
    monies: moneyGenerated,
    useTime: useTick,
    myWorks: workers,
    maxWorks: maxWorkers,
    upkeep: upkeepCost,
    pts: generatesPts,
    imports: importsPeople,
    likelihood: chanceImport,
    importTick: tickRate,
    polutes: polution,
    location: [x, y]
  };
}

function buildingToString(buildingObjType) {

  return '<span>' + buildingObjType.type.toUpperCase() + '(' + Math.floor(buildingObjType.location[0] / base) + ', ' + Math.floor(buildingObjType.location[1] / base) + ')';
}

function randomRange(min, max) {

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isSpaceFull(x, y) {

  for (var i = 0; i < filledSpaces.length; i++) {
    if (filledSpaces[i][0] === x && filledSpaces[i][1] === y) {
      return filledSpaces[i];
    }
  }

  return null;
}

function getResource(x, y) {

  if (isSpaceFull(x, y) == null) {
    return null;
  }

  for (var resource in rawResources) {
    var currElem = rawResources[resource];

    for (var i = 0; i < currElem.length; i++) {

      if (currElem[i].location[0] === x && currElem[i].location[1] === y) {

        return currElem[i];
      }
    }
  }

  return null;
}

function localizeName(name) {

  if (name === 'forest') {

    return 'Forest';
  } else if (name === 'waterpool') {

    return 'Waterpool';
  } else if (name === 'coalOre') {

    return 'Coal Ore';
  } else if (name === 'ironOre') {

    return 'Iron Ore';
  } else if (name === 'goldOre') {

    return 'Gold Ore';
  }
}

function createGrassPlane() {

  var canvas = document.getElementById('canvas').getContext('2d');

  grassSprite.onload = function() {
    for (var x = 0; x < squareSize/base; x++) {
      for (var y = 0; y < squareSize/base; y++) {
        if ((x % 2 === 0 && y % 2 === 0) || (x % 2 !== 0 && y % 2 !== 0)) {
          canvas.drawImage(grassSprite, x * base, y * base);
        } else {
          canvas.drawImage(grassSprite1, x * base, y * base);
        }

        //attempt to generate a tree at locaiton
        if (randomRange(0, 35) > 34 && isSpaceFull(x * base, y * base) == null) {

          filledSpaces.push([x * base, y * base]);
          canvas.drawImage(forestTree, x * base, y * base);
          rawResources['forests'].push({
            type: 'forest',
            amount: randomRange(75, 250),
            location: [x * base, y * base]
          });
        }

        //attempt to generate coal ore at current location
        if (Math.random() < .01 && isSpaceFull(x * base, y * base) == null && rawResources['coalMines'].length < 15) {

          filledSpaces.push([x * base, y * base]);
          canvas.drawImage(coalOre, x * base, y * base);
          rawResources['coalMines'].push({
            type: 'coalOre',
            amount: randomRange(15, 125),
            location: [x * base, y * base]
          });
        }

        //attempt to generate iron ore at current location
        if (Math.random() < .005 && isSpaceFull(x * base, y * base) == null && rawResources['ironMines'].length < 7) {

          filledSpaces.push([x * base, y * base]);
          canvas.drawImage(ironOre, x * base, y * base);
          rawResources['ironMines'].push({
            type: 'ironOre',
            amount: randomRange(15, 75),
            location: [x * base, y * base]
          });
        }

        //attempt to generate gold ore at current location
        if (Math.random() < .003 && isSpaceFull(x * base, y * base) == null && rawResources['goldMines'].length < 3) {

          filledSpaces.push([x * base, y * base]);
          canvas.drawImage(goldOre, x * base, y * base);
          rawResources['goldMines'].push({
            type: 'goldOre',
            amount: randomRange(15, 25),
            location: [x * base, y * base]
          });
        }

        //attempt to generate gold ore at current location
        if (Math.random() < .005 && isSpaceFull(x * base, y * base) == null && rawResources['lakes'].length < 7) {

          filledSpaces.push([x * base, y * base]);
          canvas.drawImage(lakes, x * base, y * base);
          rawResources['lakes'].push({
            type: 'waterpool',
            amount: randomRange(250, 800),
            location: [x * base, y * base]
          });
        }
      }
    }
  };

  //console.log(rawResources);

  grassSprite.src = "images/grass.png";
  grassSprite1.src = "images/grass1.png";
  forestTree.src = "images/littleTree.png";
  coalOre.src = "images/coal.png";
  ironOre.src = "images/iron.png";
  goldOre.src = "images/gold.png";
  lakes.src = "images/waterpool.png";
  //buildPlace.src = "images/placeholder.png";

  //buildings
  dockImg.src = "images/dock.png";
  planeImg.src = "images/airport.png";
  farmImg.src = "images/farm.png";
  lumbermillImg.src = "images/lumbermill.png";
  waterpumpImg.src = "images/waterpump.png";
  coalMineImg.src = "images/coalMine.png";
  ironMineImg.src = "images/ironMine.png";
  goldMineImg.src = "images/goldMine.png";
  powergenImg.src = "images/powerGeneration.png";
}

$(function() {

  //createBuildinding(0, { water: 0 }, {});
  createGrassPlane();

  buildingArray.push(createConstObject(
    'starterHouse',
    0, 0, '', 0, '', 0, 10, 5, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0
  ));

  setInterval(function() {

    var now = +(new Date);
    var timeElapsed = Math.round((now - start) / 1000);

    //populate body with building
    var importation = document.getElementById('importationBuild');
    importation.innerHTML = "<img src=\"images/dock.png\">";
    var farms = document.getElementById('farmBuild');
    farms.innerHTML = "<img src=\"images/farm.png\">";
    var resourceBuild = document.getElementById('resourceBuild');
    resourceBuild.innerHTML = "<img src=\"images/lumbermill.png\">";
    var mine = document.getElementById('mineBuild');
    mine.innerHTML = "<img src=\"images/coalMine.png\">";
    var powerBuild = document.getElementById('powerBuild');
    powerBuild.innerHTML = "<img src=\"images/powerGeneration.png\">";

    for (var j = 0; j < buildingArray.length; j++) {

      var myCurrentBuidling = buildingArray[j].type;
      if (myCurrentBuidling === 'dock' || myCurrentBuidling === 'airport') {

        importation.innerHTML += '<p>' + buildingToString(buildingArray[j]) + '</p>';
      } else if (myCurrentBuidling === 'lumbermill' || myCurrentBuidling === 'waterpump') {

        resourceBuild.innerHTML += '<p>' + buildingToString(buildingArray[j]) + '</p>';
      }
    }

    //other things
    document.getElementById('time').innerHTML = (timeElapsed + "").toHHMMSS();
    for (var i = 0; i < buildingArray.length; i++) {

      if (timeElapsed % buildingArray[i].useTime === 0) {

        if (resources[buildingArray[i].productEaten] - buildingArray[i].costEaten < 0) {}
        else {
          if (buildingArray[i].type === 'starterHouse' || canIOperate(buildingArray[i]) != null) {

            var toOpOn = canIOperate(buildingArray[i]);
            if (toOpOn != null) {

              toOpOn.amount = toOpOn.amount - 1;
            }
            resources[buildingArray[i].productEaten] -= buildingArray[i].costEaten;
            resources[buildingArray[i].resource] += buildingArray[i].productGened;
            money += buildingArray[i].monies;
            upkeepCost += buildingArray[i].upkeep;
            points += buildingArray[i].pts;
            pollution += buildingArray[i].polutes;

            if (buildingArray[i].imports > 0) {
              if (randomRange(0, buildingArray[i].likelihood) > buildingArray[i].likelihood + 1) {

                citizens += randomRange(1, buildingArray[i].imports);
              }
            }
          }
        }
      }
    }

    if (timeElapsed % 10 === 0) {

      money -= upkeepCost;
      upkeepCost = 0;
    }

    if (timeElapsed % 5 === 0) {

      money += moneyPerCitizen * citizens;
    }

    document.getElementById('funds').innerHTML = money;
    document.getElementById('upkeepCost').innerHTML = upkeepCost;
    document.getElementById('perCitizen').innerHTML = moneyPerCitizen;

    for (var resource in resources) {


      var gotted = document.getElementById(resource);
      if (gotted != null) {
        gotted.innerHTML = resources[resource];
      }
    }

    var resourceAt =  getResource(currClickX, currClickY);
    if (resourceAt != null) {
      document.getElementById('resourceType').innerHTML = localizeName(resourceAt.type);
      document.getElementById('resourceRemaining').innerHTML = resourceAt.amount;
    } else {

      document.getElementById('resourceType').innerHTML = 'None';
      document.getElementById('resourceRemaining').innerHTML = 0;
    }
  }, 1000);

  var canvasElem = document.getElementById('canvas');

  canvasElem.addEventListener("mousedown", getPosition, false);

  function getPosition(event) {

    var rect = canvasElem.getBoundingClientRect();
    var x = Math.floor((event.clientX - rect.left) / base) * base;
    var y = Math.floor((event.clientY - rect.top) / base) * base;

    currClickX = x;
    currClickY = y;

    var resourceAt =  getResource(x, y);

    if (resourceAt != null) {
      document.getElementById('resourceType').innerHTML = localizeName(resourceAt.type);
      document.getElementById('resourceRemaining').innerHTML = resourceAt.amount;
    } else {

      document.getElementById('resourceType').innerHTML = 'None';
      document.getElementById('resourceRemaining').innerHTML = 0;
    }

    document.getElementById('xyclick').innerHTML = '(' + x / base + ' ,' + y / base + ')';

    var context = canvasElem.getContext('2d');
    //context.globalCompositeOperation='destination-over';

    if (lastClickX !== -1) {
      context.clearRect(lastClickX - 1, lastClickY - 1, base + 2, base + 2);
    }

    //Redraw the grass texture at the current location
    if ((lastClickX/base % 2 === 0 && lastClickY/base % 2 === 0) || (lastClickX/base % 2 !== 0 && lastClickY/base % 2 !== 0)) {
      context.drawImage(grassSprite, lastClickX - 1, lastClickY - 1, 18, 18);
    } else {
      context.drawImage(grassSprite1, lastClickX - 1, lastClickY - 1, 18, 18);
    }

    //redraw resource at this location
    var lastResouce = getResource(lastClickX, lastClickY);
    if (lastResouce != null && lastClickX !== -1) {
      if (lastResouce.type === 'forest') {

        context.drawImage(forestTree, lastClickX, lastClickY);
      } else if (lastResouce.type === 'coalOre') {

        context.drawImage(coalOre, lastClickX, lastClickY);
      } else if (lastResouce.type === 'ironOre') {

        context.drawImage(ironOre, lastClickX, lastClickY);
      } else if (lastResouce.type === 'goldOre') {

        context.drawImage(goldOre, lastClickX, lastClickY);
      } else if (lastResouce.type === 'waterpool') {

        context.drawImage(lakes, lastClickX, lastClickY);
      }
    }

    for (var i in buildingArray) {

      //console.log(buildingArray[i].location, lastClickX, lastClickY);
      if (buildingArray[i].location[0] === lastClickX && buildingArray[i].location[1] === lastClickY) {

        var toBuildAtLoc;
        //console.log(buildingArray[i].location, lastClickX, lastClickY);
        if (buildingArray[i].location[0] === lastClickX && buildingArray[i].location[1] === lastClickY) {

          if (buildingArray[i].type === 'lumbermill') {

            toBuildAtLoc = lumbermillImg;
          } else if (buildingArray[i].type === 'waterpump') {

            toBuildAtLoc = waterpumpImg;
          } else if (buildingArray[i].type === 'waterturbine' || buildingArray[i].type === 'coalGenerator') {

            toBuildAtLoc = powergenImg;
          } else if (buildingArray[i].type === 'coalMine') {

            toBuildAtLoc = coalMineImg;
          } else if (buildingArray[i].type === 'ironMine') {

            toBuildAtLoc = ironMineImg;
          } else if (buildingArray[i].type === 'goldMine') {

            toBuildAtLoc = goldMineImg;
          } else if (buildingArray[i].type === 'coffeeFarm' ||
          buildingArray[i].type === 'tobaccoFarm' ||
          buildingArray[i].type === 'fruitFarm' ||
          buildingArray[i].type === 'vegiFarm') {

            toBuildAtLoc = farmImg;
          } else if (buildingArray[i].type === 'airport') {

            toBuildAtLoc = planeImg;
          } else if (buildingArray[i].type === 'dock') {

            toBuildAtLoc = dockImg;
          }

          context.drawImage(toBuildAtLoc, lastClickX, lastClickY);
        }
        //console.log('Found  it');
        //context.drawImage(toBuildAtLoc, lastClickX, lastClickY);
      }
    }

    context.beginPath();
    context.rect(x, y, base, base);
    context.lineWidth = 1;
    context.strokeStyle = 'black';
    context.stroke();

    lastClickY = y;
    lastClickX = x;
  }
});
