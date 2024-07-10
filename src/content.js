chrome.storage.local.get(['dailyLimit', 'currCount'], (result) => {
  const dailyLimit = result.dailyLimit;
  const currCount = result.currCount;

  if (currCount >= dailyLimit) {
    document.body.innerHTML = 'Instagram is blocked for today'
  } else {
    chrome.runtime.sendMessage({action: 'incrementCount'}, (response) => {
      console.log('Visit Count Incremented to', response.newCount);
    })
  }
})






















// chrome.storage.local.get(['limit', 'currentCount'], (result) => {
//   const limit = result.limit || 0;
//   const currentCount = result.currentCount || 0;

//   if (currentCount >= limit) {
//     document.body.innerHTML = '<h1>Instagram access blocked for today</h1>';
//   } else {
//     chrome.runtime.sendMessage({ action: 'incrementCount' }, (response) => {
//       console.log('Visit count incremented to', response.newCount);
//     });
//   }
// });