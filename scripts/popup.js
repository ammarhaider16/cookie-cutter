import { analyzeCookiesWithGemini } from "./api.js";

// This script executes when the extension popup has been rendered.
document.addEventListener("DOMContentLoaded", () => {
  const analyzeCookiesButton = document.getElementById("analyzeCookiesButton");

  console.log("Buttons found, adding event listeners.");

  analyzeCookiesButton.addEventListener("click", onClickAnalyzeCookies);
});

const onClickAnalyzeCookies = async () => {
  const [cookieCount, purpose, safety] = await analyzeCookies();

  // Hide the button and initial text
  document.querySelector("p").style.display = "none";
  document.getElementById("analyzeCookiesButton").style.display = "none";

  // Show the results container
  const resultContainer = document.getElementById("resultContainer");
  resultContainer.style.display = "block";

  // Update components with example data
  document.getElementById(
    "cookieCount"
  ).textContent = `Cookies found: ${cookieCount}`;
  document.getElementById(
    "cookiePurpose"
  ).innerHTML = `\nWhat are cookies on this page doing?\n<p>${purpose}</p>`;
  document.getElementById(
    "cookieConcern"
  ).innerHTML = `\nShould I be concerned?\n<p>${safety}</p>`;
};

// This function executes the callback on the tabs.Tab instance that is last active. Will not work with Chrome DevTools or "chrome://" prages are the last active tabs.
const getCurrentTab = (callback) => {
  let queryOptions = { active: true, lastFocusedWindow: true };
  chrome.tabs.query(queryOptions, ([tab]) => {
    if (chrome.runtime.lastError) console.error(chrome.runtime.lastError);
    callback(tab);
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
const analyzeCookies = async () => {
  console.log("Received cookie display request.");
  try {
    const cookies = await getCookies();
    const cookiesList = cookies.split(";");
    const cookieCount = cookiesList.length;
    const analysis = await analyzeCookiesWithGemini(cookies);
    const breakdown = analysis.split(";");
    return [cookieCount, breakdown[0], breakdown[1]];
  } catch (error) {
    console.error("Failed to analyze cookies:", error);
    return [null, null];
  }
};
