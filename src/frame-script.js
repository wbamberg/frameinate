/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

let button = content.document.createElement("input");

function Button(name, handler) {
  let element = content.document.createElement("input");
  element.type = "button";
  element.value = name;
  element.name = name;
  element.addEventListener("click", handler, false);
  return element;
}

function TextArea(id) {
  let element = content.document.createElement("textarea");
  element.id = id;
  element.multiline = true;
  element.style.height = "10em";
  element.style.width = "95%";
  element.style.margin = "0.5em";
  element.style.border = "1px solid black";
  return element;
}

function Div(id) {
  let element = content.document.createElement("div");
  element.id = id;
  element.style.backgroundColor = "white";
  element.style.height = "2em";
  element.style.width = "100%";
  element.style.margin = "0.5em";
  element.style.border = "1px solid black";
  return element;
}

let body = content.document.createElement("body");
body.appendChild(Button("click me", testAPI(clickMeHandler)));
body.appendChild(Button("prompt", testAPI(promptHandler)));
body.appendChild(Button("locale", testAPI(localeHandler)));
body.appendChild(Button("console", testAPI(consoleHandler)));
body.appendChild(Button("window mediator", testAPI(windowMediator)));
body.appendChild(Button("session store", testAPI(sessionStore)));

let evalBox = TextArea("eval-box");
let evalButton = Button("eval", evalHandler);
let evalDiv = Div("eval-div");
evalDiv.appendChild(evalBox);
evalDiv.appendChild(evalButton);
body.appendChild(evalDiv);

let results = Div("results");
body.appendChild(results);

content.document.body = body;

function testAPI(api) {
  return test.bind(null, api)
}

function test(api) {
  results.textContent = "";
  try {
    results.textContent = api();
  }
  catch (error) {
    results.textContent = "Error: " + error.message;
  }  
}

/*
*/

function evalHandler() {
  let code = evalBox.value;
  test(eval.bind(null, code));
}

/*
Functions that test the APIs.

Each function can return something: this is put in the textbox for the "result"
of calling the API. If the function throws, it's caught and the error is logged
in the textbox.
*/

function clickMeHandler() {
  content.document.body.style.backgroundColor = "blue";
  return "dummy is ok";
}

function consoleHandler() {
  Components.utils.import("resource://gre/modules/devtools/Console.jsm");
  console.log("Hello from Firefox code"); //output messages to the console
  return "console is ok";
}

function promptHandler() {
  var promptSvc = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].
                  getService(Components.interfaces.nsISessionStore);
  promptSvc.alert(null, "My frame script", "Hello from a frame script");
  return "prompt service is ok";
}

function localeHandler() {
  content.document.body.style.backgroundColor = "green";
  return "locale is ok";
}

function windowMediator() {
  var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                 .getService(Components.interfaces.nsIWindowMediator);
  var win = wm.getMostRecentWindow("navigator:browser");
  return win.location.href;
}

function sessionStore() {
  var sStore = Components.classes["@mozilla.org/browser/sessionstore;1"]
    .getService(Components.interfaces.nsISessionStore);
  return sStore.getBrowserState();
}