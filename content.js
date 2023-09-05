// Send a message to the background script with the tab URL
chrome.runtime.sendMessage({ url: window.location.href });
