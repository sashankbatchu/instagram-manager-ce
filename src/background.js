chrome.runtime.onInstalled.addListener(() => {
  setMidnightAlarm();
  chrome.storage.local.set({dailyLimit: 0, currCount: 0});
});


// resetting currCount at midnight
const setMidnightAlarm = () => {
  const midNight = new Date();
  midNight.setHours(0, 0, 0, 0); // Set to midnight

  chrome.alarms.create('resetCount', { when: midNight.getTime(), periodInMinutes: 1440 });
};

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'resetCount') {
    chrome.storage.local.set({currCount: 0});
  }
})


//incrementing currCount
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'incrementCount') {
    chrome.storage.local.get(['currCount'], (result) => {
      const currCount = result.currCount || 0;
      chrome.storage.local.set({currCount: currCount + 1});
      sendResponse({newCount: currCount + 1});
    })

    return true;
  }
})













