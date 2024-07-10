/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!***************************!*\
  !*** ./src/background.js ***!
  \***************************/
chrome.runtime.onInstalled.addListener(function () {
  setMidnightAlarm();
  chrome.storage.local.set({
    dailyLimit: 0,
    currCount: 0
  });
});

// resetting currCount at midnight
var setMidnightAlarm = function setMidnightAlarm() {
  var midNight = new Date();
  midNight.setHours(0, 0, 0, 0); // Set to midnight

  chrome.alarms.create('resetCount', {
    when: midNight.getTime(),
    periodInMinutes: 1440
  });
};
chrome.alarms.onAlarm.addListener(function (alarm) {
  if (alarm.name === 'resetCount') {
    chrome.storage.local.set({
      currCount: 0
    });
  }
});

//incrementing currCount
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'incrementCount') {
    chrome.storage.local.get(['currCount'], function (result) {
      var currCount = result.currCount || 0;
      chrome.storage.local.set({
        currCount: currCount + 1
      });
      sendResponse({
        newCount: currCount + 1
      });
    });
    return true;
  }
});
/******/ })()
;
//# sourceMappingURL=background.js.map