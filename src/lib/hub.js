/*
This file is part of the GhostDriver by Ivan De Marino <http://ivandemarino.me>.

Copyright (c) 2012, Ivan De Marino <http://ivandemarino.me>
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice,
      this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice,
      this list of conditions and the following disclaimer in the documentation
      and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

function _nodeConf(ip, port, hub) {
  var ref$, hubHost, hubPort;

  ref$ = hub.match(/([\w\d\.]+):(\d+)/);
  hubHost = ref$[1];
  hubPort = +ref$[2]; //< ensure it's of type "number"

  return {
      capabilities: [{
          browserName: "phantomjs",
          maxInstances: 1,
          seleniumProtocol: "WebDriver"
      }],
      configuration: {
          hub: hub,
          hubHost: hubHost,
          hubPort: hubPort,
          port: port,
          proxy: "org.openqa.grid.selenium.proxy.DefaultRemoteProxy",
          // Note that multiple webdriver sessions or instances within a single
          // Ghostdriver process will interact in unexpected and undesirable ways.
          maxSession: 1,
          register: true,
          registerCycle: 5000,
          role: "wd",
          url: "http://" + ip + ":" + port,
          remoteHost: "http://" + ip + ":" + port
      }
  };
}

function _open(page, hub, status) {
  if(status !== 'success') {
      console.log("Unable to contact grid " + hub + ": " + status);
      ghostdriver.exit();
  }
  if(page.framePlainText !== 'ok') {
      console.log("Problem registering with grid " + hub + ": " + page.content);
      ghostdriver.exit();
  }
  console.log(
    "Registered with grid hub: " + hub + " (" + page.framePlainText + ")"
  );
}

function register(ip, port , hub) {
  var page = require('webpage').create();
  if (!hub.match('https?://')) {
    hub = 'http://' + hub;
  }
  if(!hub.match(/\/$/)) {
      hub += '/';
  }
  page.open(
    hub + 'grid/register', {
      operation: 'post',
      data: JSON.stringify(_nodeConf(ip, port, hub)),
      headers: {
        'Content-Type': 'application/json'
      }
    },
    _open.bind(null, page, hub)
  );
}

module.exports = register;