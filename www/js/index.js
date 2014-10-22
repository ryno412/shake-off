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
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
      app.receivedEvent('deviceready');
      var $output = document.getElementById('output')
      console.log("DEVICE READY");
      $output.innerHTML = "RYAN";
      function alertDismissed() {
        // do something
      }

      var count = 0;
      var isUp = false;
      var ygravity = 0;

      function onSuccess(acceleration) {
        ygravity = 0.8*ygravity + (1-0.8)*acceleration.y;
        var yaccel = acceleration.y - ygravity;


        if (isUp && yaccel > 10) {
          isUp = false;
          count++;
        }
        else if (!isUp && yaccel < -10) {
          isUp = true;
          count++;
        }


        $output.innerHTML = yaccel + ' ' + count + ' ' + (isUp ? ' UP' : ' DOWN');
        console.log(
          "count  " + count +
          'Acceleration Y: ' + acceleration.y + '\n' +
           (isUp ? ' UP' : ' DOWN'));

      };

      function onError() {
        console.log("ERROR")
      };

      var options = { frequency: 40 };

      var watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
      //navigator.notification.beep(10);
      navigator.notification.alert(
        'You are the winner!',  // message
        alertDismissed,         // callback
        'Game Over',            // title
        'Done'                  // buttonName
      );


    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();