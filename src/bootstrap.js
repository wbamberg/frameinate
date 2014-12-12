/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

Cu.import("resource:///modules/CustomizableUI.jsm");

var console =
  Cu.import("resource://gre/modules/devtools/Console.jsm", {}).console;

function install(aData, aReason) {}

function uninstall(aData, aReason) {}

function startup(aData, aReason) {
  Frameinate.init();
}

function shutdown(aData, aReason) {
  Frameinate.uninit();
}

let Frameinate = {
  init : function() {
    let io =
      Cc["@mozilla.org/network/io-service;1"].
        getService(Ci.nsIIOService);

    // the 'style' directive isn't supported in chrome.manifest for bootstrapped
    // extensions, so this is the manual way of doing the same.
    this._ss =
      Cc["@mozilla.org/content/style-sheet-service;1"].
        getService(Ci.nsIStyleSheetService);
    this._uri = io.newURI("chrome://frameinate/skin/toolbar.css", null, null);
    this._ss.loadAndRegisterSheet(this._uri, this._ss.USER_SHEET);

    // create widget and add it to the main toolbar.
    CustomizableUI.createWidget(
      { id : "frameinate-button",
        defaultArea : CustomizableUI.AREA_NAVBAR,
        label : "Frameinate Button",
        tooltiptext : "Frameinate!",
        onCommand : function(aEvent) {
          Frameinate.attachFrameScript(aEvent.target.ownerDocument);
        }
      });
  },

  attachFrameScript : function(xulDocument) {
    var browserMM = xulDocument.defaultView.gBrowser.selectedBrowser.messageManager;
    browserMM.loadFrameScript("chrome://frameinate/content/frame-script.js", false);
  },

  uninit : function() {
    CustomizableUI.destroyWidget("frameinate-button");

    if (this._ss.sheetRegistered(this._uri, this._ss.USER_SHEET)) {
      this._ss.unregisterSheet(this._uri, this._ss.USER_SHEET);
    }
  }
};
