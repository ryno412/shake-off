/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

function isDefined(a) { return (typeof a !== 'undefined'); }

var adCounter = 1;

var Game = function (hash) {
  hash = hash || {};

  // Set class variables
  this.count = 0;

  // Define ending conditions
  if (isDefined(hash.endCount)) {
    this.endTimeMs = 0;
    this.endCount  = hash.endCount;
  }
  else if (isDefined(hash.endTimeMs)) {
    this.endTimeMs = hash.endTimeMs;
    this.endCount  = 0;
  }
  else {
    this.endTimeMs = 15000;
    this.endCount  = 0;
  }


  this.getReady();
};

//
// Return the number of ms elapsed since the game began, e.g. 12129 ms
//
Game.prototype.getTimeElapsedMs = function () {
  var currentTime = (new Date()).getTime();
  return currentTime - this.startTimeMs;
};

//
// Return the number of seconds elapsed since the game began, e.g. "12.13"
//
Game.prototype.getTimeElapsedSec = function () {
  var ms = this.getTimeElapsedMs();
  if (this.endTimeMs && ms > this.endTimeMs) {
    ms = this.endTimeMs;
  }

  // Make the ms printable
  var secs = Math.floor(ms / 1000);
  ms = Math.round((ms % 1000) / 10) + '';
  while (ms.length < 2) ms = '0' + ms;

  return secs + '.' + ms;
};

Game.prototype.getReady = function () {
  var _this = this;

  // Reset the DOM
  $('.end-game-div').hide();
  $('.ad-bottom').hide();
  $('.timer').html('0.00');

  var scoreDiv = $('.score');
  scoreDiv.html('3');

  // ..2..
  setTimeout(function () {
    scoreDiv.html('2');
  }, 1200);

  // ..1..
  setTimeout(function () {
    scoreDiv.html('1');
  }, 2200);

  // ..GO!..
  setTimeout(function () {
    scoreDiv.html('GO!');
    _this.start();
  }, 3200);
};

Game.prototype.start = function () {
  var _this = this;  

  this.running = true;
  this.startTimeMs = (new Date()).getTime();
  
  this.redrawInterval = setInterval(function () {
    _this.redraw();
  }, 40);
};

Game.prototype.stop = function () {
  this.running = false;
  clearInterval(this.redrawInterval);

  // Show funny message
  var message = "Great job!";
  $('.end-message').html(message);

  // Update the UI one last time
  this.redraw();
  $('.score').html(this.count);
  $('.end-game-div').show();

  // Load the next ad
  $('.ad-bottom').html('Showing ad ' + (++adCounter));
  $('.ad-bottom').show();
};

Game.prototype.redraw = function () {
  $('.timer').html(this.getTimeElapsedSec());
  if (this.count) {
    $('.score').html(this.count);
  }
};

Game.prototype.incrementCount = function () {
  if (this.running) {
    this.count++;
    this.checkFinished(); // Check if finished
  }
};

Game.prototype.checkFinished = function () {
  if (!this.running) {
    console.error('calling checkFinished() on a stopped game!');
  }

  // Check if we reached the target count
  if (this.endCount) {
    if (this.count >= this.endCount) {
      this.stop();
    }
  }
  // By default, check if time expired
  else {
    if (this.getTimeElapsedMs() >= this.endTimeMs) {
      this.stop();
    }
  }
};


var app = {
  game: null,

  // Application Constructor
  initialize: function() {
    this.bindEvents();
  },

  DEBUG: !window.cordova,

  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);

    // DEBUG: If not in Cordova, use document.ready
    if (app.DEBUG) {
      $(document).ready(this.onDeviceReady);
    }
  },

  //
  // Transitions to a new page in the app
  //
  showPage: function (sel) {
    var next = $(sel);
    var current = $('.page.visible');

    // Wait for transitions to finish
    if (current.length > 1) return;

    // Apply new classes to pages
    current.addClass('beneath'); // Move current page to background
    next.addClass('visible'); // Make next page visible

    // Hide background page after the animation delay
    window.setTimeout(function () {
      current.removeClass('visible beneath');
    }, 400);
  },

  addParticle: function (x,y) {
    var particle = $('<div class="particle"></div>');
    particle.css('top', y+'px');
    particle.css('left', x+'px');

    var dx = Math.round(200*(Math.random()*2 - 1));
    var dy = Math.round(300*(Math.random()*2 - 1));
    var timeout = Math.round(140 * Math.random());
    var size = Math.round(10*Math.random() + 10);
    var r = Math.floor(64*Math.random() + 192);
    var g = Math.floor(128*Math.random() + 64);
    var b = Math.floor(64*Math.random() + 0);

    //particle.css('background', 'rgb(' + r + ',' + r + ',' + b + ')');

    // Trigger the animation
    setTimeout(function () {
      particle.addClass('grow');
      particle.css('top', (y+dy) + 'px');
      particle.css('left', (x+dx) + 'px');
      particle.css('width', size + 'px');
      particle.css('width', size + 'px');
      particle.css('height', size + 'px');
      particle.css('margin',  '-' + (size/2) + 'px');
      //particle.css('background', 'red');
      particle.css('background', 'rgb(' + r + ',' + b + ',' + b + ')');
    }, 10 + timeout);

    // Remove particle after animation is complete
    setTimeout(function () {
      particle.remove();
    }, 700);

    return particle;
  },

  explode: function () {
    var fragment = $(document.createDocumentFragment());
    for (var i = 0; i < 100; i++) {
      fragment.append(app.addParticle(100,100));
    }

    //count++;
    //fragment.append(addCounter(x, y));

    $('.game-page').append(fragment);
  },

  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady: function() {
    console.log('hellow world');

    // Add button handlers
    var tap = (app.DEBUG ? 'click' : 'touchstart');
    $('.btn-time-mode').on(tap, function () {
      app.showPage('.options-page-time');
    });
    $('.btn-race-mode').on(tap, function () {
      app.showPage('.options-page-race');
    });

    $('.options-page-time .button').on(tap, function (e) {
      // Create a new game with the chosen time
      var targetTime = $(e.target).attr('data-value');
      if (targetTime) {
        app.game = new Game({ endTimeMs: (targetTime*1000) });
        app.showPage('.game-page');
      }
    });
    $('.options-page-time .back-button').on(tap, function (e) {
      app.showPage('.title-page');
    });

    $('.options-page-race .button').on(tap, function (e) {
      // Create a new game with the chosen count
      var targetCount = $(e.target).attr('data-value');
      if (targetCount) {
        app.game = new Game({ endCount: targetCount });
        app.showPage('.game-page');
      }
    });
    $('.options-page-race .back-button').on(tap, function (e) {
      app.showPage('.title-page');
    });

    $('.play-again-button').on(tap, function (e) {
      app.showPage('.title-page');
    });


    $('body').on(tap, function () {
      if (app.game.running) {
        $('.shaker').toggleClass('down');
        //app.explode();
        app.game.incrementCount();
      }
    });
/*

    var watchID = navigator.accelerometer.watchAcceleration(function (acceleration) {
      var element = document.getElementById('test');
      element.innerHTML = 'Y: ' + acceleration.y + ', ' + acceleration.timestamp;
      console.log('Hello ', acceleration);
    }, function () {
      console.log('watchAcceleration.onError!');
    }, { frequency: 40 });
    
    var media = new Media('media/smw_coin.wav', function () {
      console.log('~~~~~~~~~~~~~~~~~~~~ Loaded smw_coin');
    });
    var media2 = new Media('media/smw_coin.wav', function () {
      console.log('~~~~~~~~~~~~~~~~~~~~ Loaded smw_coin');
    });
    var media3 = new Media('media/ooh-yeah.mp3', function () {
      console.log('~~~~~~~~~~~~~~~~~~~~ Loaded smw_coin');
    });
    media.play();
    var ctr = 0;

    $('#test').on('mouseup', function () {
      ctr = (ctr+1) % 3;
      if (ctr == 2) media3.play();
      else if (ctr == 1) media2.play();
      else media.play();
    });

    var element = document.getElementById('test');
    element.innerHTML = 'WILSON';
    console.log('~~~~~~~~~~~~~~~~~~~~ Set name to WILSON', navigator.accelerometer.watchAcceleration);

    navigator.accelerometer.getCurrentAcceleration(function (acceleration) {
      console.log('Succses ' + acceleration.y);
    }, function () {
      console.log('getCurrentAcceleration.onError!');
    });*/
  },

};

app.initialize()