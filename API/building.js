'use strict';

function Building(cost, profit, maxWorkers, produceDuration) {

  //Should remain constant
  this.cost = cost;
  this.profit = profit;
  this.maxWorkers = maxWorkers;
  this.produceDuration = produceDuration;

  this.upkeepCost = 0.0;
  this.currWorkers = 0;
  this.generatesPower = 0; //leave 0 for false, any other number vals to true
  this.requiresPower = 0; //leave 0 for false, any other number vals to true
  this.generatesResearchPts = 0; //leave 0 for false, any other number vals to true
  this.isDangerous = 0; //0 for non-dangerous, val = range of danger

  this.type = '';
  this.name = '';

  this.costModifier = 100; //should be percent based
  this.profitModifier = 100; //should be percent based
  this.produceModifier = 100; //should be percent based
  this.upkeepModifier = 100; //should be percent based

  this.produces = [];
  this.produceStored = [];

  this.consumesPower = false;
}

class StarterHouse extends Building {

  constructor() {

    var parent = super(0, 10, 1, 5);
    parent.currWorkers = 1;
    parent.name = 'Starter House';
  }
}
