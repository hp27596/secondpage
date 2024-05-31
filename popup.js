document.addEventListener("DOMContentLoaded", () => {
  const toggleSwitch = document.getElementById("toggleSwitch");
  const coffeeLink = document.getElementById("coffeeLinkClick");
  const newsletterLink = document.getElementById("newsletterLinkClick");

  // Set the default state to enabled
  chrome.storage.sync.get("isEnabled", (data) => {
    toggleSwitch.checked = data.isEnabled !== false;
  });

  // Update the state when the switch is toggled
  toggleSwitch.addEventListener("change", (event) => {
    const isEnabled = event.target.checked;
    chrome.storage.sync.set({ isEnabled }, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.reload(tabs[0].id);
        }
      });
    });
  });

  // Open the coffee link in a new tab
  coffeeLink.addEventListener("click", () => {
    chrome.tabs.create({ url: "https://www.buymeacoffee.com/peternguyen" });
  });

  // Open the newsletter link in a new tab
  newsletterLink.addEventListener("click", () => {
    chrome.tabs.create({ url: "https://thesolofoundernewsletter.com/subscribe?utm_source=secondpage" });
  });
});