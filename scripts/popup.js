// This script executes when the extension popup has been rendered.
document.addEventListener("DOMContentLoaded", () => {
  const injectLogButton = document.getElementById("injectLogButton");

  const showCookiesButton = document.getElementById("showCookiesButton");

  console.log("Buttons found, adding event listeners.");

  injectLogButton.addEventListener("click", testInjectLog);

  showCookiesButton.addEventListener("click", showCookies);
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
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => console.log("This is a test injection."),
      });
    } else {
      console.log("No tab found!");
    }
  });
};

// This function gets cookies that are in use in the active browser tab.
const getCookies = async () => {
  console.log("Received cookie access request.");
  return new Promise((resolve, reject) => {
    getCurrentTab((tab) => {
      if (tab) {
        chrome.scripting
          .executeScript({
            target: { tabId: tab.id },
            func: () => document.cookie,
          })
          .then((injectionResults) => {
            resolve(injectionResults[0].result);
          })
          .catch((error) => {
            console.error("Failed to retrieve cookies:", error);
            reject(error);
          });
      } else {
        console.log("No tab found!");
        reject(new Error("No active tab found."));
      }
    });
  });
};

// This function will be the main function calling other functions to get cookies, and analyze what's going on.
const showCookies = async () => {
  console.log("Received cookie display request.");
  try {
    const cookies = await getCookies();
    console.log("Cookies in active tab:", cookies);
  } catch (error) {
    console.error("Failed to display cookies:", error);
  }
};
