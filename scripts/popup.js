// This script executes when the extension popup has been rendered.

document.addEventListener("DOMContentLoaded", () => {
  const injectLogButton = document.getElementById("injectLogButton");

  const getCookiesButton = document.getElementById("getCookiesButton");

  console.log("Buttons found, adding event listener.");

  injectLogButton.addEventListener("click", testInjectLog);

  getCookiesButton.addEventListener("click", getCookies);
});

// This function executes the callback on the tabs.Tab instance that is last active. Will not work with Chrome DevTools or "chrome://" prages are the last active tabs.
const getCurrentTab = (callback) => {
  let queryOptions = { active: true, lastFocusedWindow: true };
  chrome.tabs.query(queryOptions, ([tab]) => {
    if (chrome.runtime.lastError) console.error(chrome.runtime.lastError);
    callback(tab);
  });
};

// This is a test script injection.
const testInjectLog = () => {
  console.log("Received log injection request.");

  getCurrentTab((tab) => {
    if (tab) {
      chrome.scripting
        .executeScript({
          target: { tabId: tab.id },
          func: () => console.log("This is a test injection."),
        })
        .then(console.log("Injected a function!"));
    } else {
      console.log("No tab found!");
    }
  });
};

// This function gets cookies that are in use in the active browser tab.
const getCookies = () => {
  console.log("Received cookie access request.");
};
