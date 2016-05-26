"use strict";

$(function () {

  //createBuildinding(110, {}, {});
});

// function createConstObject(type, powerGenerated, product, productGenerated, productConsumed, productCost, moneyGenerated, useTick, workers, maxWorkers, upkeepCost, generatesPts, importsPeople, chanceImport, tickRate, polution) {
//
//   return {
//     type: type,
//     powerGen: powerGenerated,
//     powerConsume: powerConsumed
//     resource: product,
//     productGened: productGenerated,
//     productEaten: productConsumed,
//     costEaten: productCost,
//     monies: moneyGenerated,
//     useTime: useTick,
//     myWorks: workers,
//     maxWorks: maxWorkers,
//     upkeep: upkeepCost,
//     pts: generatesPts,
//     imports: importsPeople,
//     likelihood: chanceImport,
//     importTick: tickRate,
//     polutes: polution
//   };
// }

// function createBuilding() {
//
//   alert(currClickX + " :: " + currClickY);
//   var canvas = document.getElementById('canvas');
//   var daCxt = canvas.getContext('2d');
//
//   daCxt.drawImage(buildPlace, currClickX, currClickY);
// }

function createLumberMill() {

  createBuildinding(200, {}, {
    type: 'lumbermill',
    powerGen: 0,
    powerConsume: 0,
    resource: 'lumber',
    productGened: randomRange(1, 3),
    productEaten: '',
    costEaten: 0,
    monies: 0,
    useTime: 5,
    myWorks: 1,
    maxWorks: 1,
    upkeep: 5,
    pts: 0,
    imports: 0,
    likelihood: 0,
    importTick: 0,
    polutes: 0,
    location: [currClickX, currClickY]
  });

  //createBuilding();
}

function createWaterPump() {

  createBuildinding(150, { lumber: 15 }, {
    type: 'waterpump',
    powerGen: 0,
    powerConsume: 0,
    resource: 'water',
    productGened: randomRange(1, 15),
    productEaten: '',
    costEaten: 0,
    monies: 0,
    useTime: 5,
    myWorks: 1,
    maxWorks: 1,
    upkeep: 5,
    pts: 0,
    imports: 0,
    likelihood: 0,
    importTick: 0,
    polutes: 0,
    location: [currClickX, currClickY]
  });
}

function createWaterTurbine() {

  createBuildinding(300, { lumber: 30 }, {
    type: 'waterturbine',
    powerGen: 5,
    powerConsume: 0,
    resource: 'power',
    productGened: randomRange(1, 7),
    productEaten: 'water',
    costEaten: 5,
    monies: 0,
    useTime: 10,
    myWorks: 1,
    maxWorks: 1,
    upkeep: 5,
    pts: 0,
    imports: 0,
    likelihood: 0,
    importTick: 0,
    polutes: 0,
    location: [currClickX, currClickY]
  });
}

function createCoalGenerator() {

  createBuildinding(500, { lumber: 30, coal: 50 }, {
    type: 'coalGenerator',
    powerGen: 15,
    powerConsume: 0,
    resource: 'power',
    productGened: randomRange(1, 20),
    productEaten: 'coal',
    costEaten: 5,
    monies: 0,
    useTime: 10,
    myWorks: 1,
    maxWorks: 1,
    upkeep: 5,
    pts: 0,
    imports: 0,
    likelihood: 0,
    importTick: 0,
    polutes: 0,
    location: [currClickX, currClickY]
  });
}

function createCoalMine() {

  createBuildinding(500, { lumber: 50 }, {
    type: 'coalMine',
    powerGen: 0,
    powerConsume: 2,
    resource: 'coalOre',
    productGened: randomRange(1, 10),
    productEaten: 'power',
    costEaten: 2,
    monies: 0,
    useTime: 10,
    myWorks: 1,
    maxWorks: 1,
    upkeep: 5,
    pts: 0,
    imports: 0,
    likelihood: 0,
    importTick: 0,
    polutes: 0,
    location: [currClickX, currClickY]
  });
}

function createIronMine() {

  createBuildinding(750, { lumber: 50, coalOre: 10 }, {
    type: 'ironMine',
    powerGen: 0,
    powerConsume: 5,
    resource: 'ironOre',
    productGened: randomRange(1, 5),
    productEaten: 'power',
    costEaten: 5,
    monies: 0,
    useTime: 10,
    myWorks: 1,
    maxWorks: 1,
    upkeep: 10,
    pts: 0,
    imports: 0,
    likelihood: 0,
    importTick: 0,
    polutes: 0,
    location: [currClickX, currClickY]
  });
}

function createGoldMine() {

  createBuildinding(1000, { lumber: 50, coalOre: 10, ironOre: 20 }, {
    type: 'goldMine',
    powerGen: 0,
    powerConsume: 10,
    resource: 'goldOre',
    productGened: randomRange(1, 3),
    productEaten: 'power',
    costEaten: 10,
    monies: 0,
    useTime: 10,
    myWorks: 1,
    maxWorks: 1,
    upkeep: 15,
    pts: 0,
    imports: 0,
    likelihood: 0,
    importTick: 0,
    polutes: 0,
    location: [currClickX, currClickY]
  });
}

function createCoffeeFarm() {

  createBuildinding(500, { lumber: 100, coalOre: 10 }, {
    type: 'coffeeFarm',
    powerGen: 0,
    powerConsume: 0,
    resource: 'coffee',
    productGened: randomRange(1, 10),
    productEaten: '',
    costEaten: 0,
    monies: 0,
    useTime: 10,
    myWorks: 1,
    maxWorks: 1,
    upkeep: 5,
    pts: 0,
    imports: 0,
    likelihood: 0,
    importTick: 0,
    polutes: 0,
    location: [currClickX, currClickY]
  });
}

function createTobaccoFarm() {

  createBuildinding(500, { lumber: 100, coalOre: 5 }, {
    type: 'tobaccoFarm',
    powerGen: 0,
    powerConsume: 0,
    resource: 'tobacco',
    productGened: randomRange(1, 5),
    productEaten: '',
    costEaten: 0,
    monies: 0,
    useTime: 10,
    myWorks: 1,
    maxWorks: 1,
    upkeep: 5,
    pts: 0,
    imports: 0,
    likelihood: 0,
    importTick: 0,
    polutes: 0,
    location: [currClickX, currClickY]
  });
}

function createFruitFarm() {

  createBuildinding(500, { lumber: 100, coffee: 5, tobacco: 5 }, {
    type: 'fruitFarm',
    powerGen: 0,
    powerConsume: 0,
    resource: 'fruits',
    productGened: randomRange(5, 15),
    productEaten: '',
    costEaten: 0,
    monies: 0,
    useTime: 10,
    myWorks: 1,
    maxWorks: 1,
    upkeep: 5,
    pts: 0,
    imports: 0,
    likelihood: 0,
    importTick: 0,
    polutes: 0,
    location: [currClickX, currClickY]
  });
}

function createVegieFarm() {

  createBuildinding(500, { lumber: 100, coffee: 10, tobacco: 10 }, {
    type: 'vegiFarm',
    powerGen: 0,
    powerConsume: 0,
    resource: 'vegies',
    productGened: randomRange(2, 10),
    productEaten: '',
    costEaten: 0,
    monies: 0,
    useTime: 10,
    myWorks: 1,
    maxWorks: 1,
    upkeep: 5,
    pts: 0,
    imports: 0,
    likelihood: 0,
    importTick: 0,
    polutes: 0,
    location: [currClickX, currClickY]
  });
}

function createAirPort() {

  createBuildinding(2500, { lumber: 100, goldOre: 125, ironOre: 100 }, {
    type: 'airport',
    powerGen: 0,
    powerConsume: 10,
    resource: '',
    productGened: 0,
    productEaten: 'power',
    costEaten: 10,
    monies: 0,
    useTime: 20,
    myWorks: 1,
    maxWorks: 1,
    upkeep: 10,
    pts: 0,
    imports: 1,
    likelihood: 50,
    importTick: 10,
    polutes: 0,
    location: [currClickX, currClickY]
  });
}

function createDock() {

  createBuildinding(1500, { lumber: 100, ironOre: 100 }, {
    type: 'dock',
    powerGen: 0,
    powerConsume: 10,
    resource: '',
    productGened: 0,
    productEaten: 'power',
    costEaten: 10,
    monies: 0,
    useTime: 30,
    myWorks: 1,
    maxWorks: 1,
    upkeep: 10,
    pts: 0,
    imports: 1,
    likelihood: 25,
    importTick: 10,
    polutes: 0,
    location: [currClickX, currClickY]
  });
}
