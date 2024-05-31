async function fetchBlockedDomains() {
  try {
    const response = await fetch(chrome.runtime.getURL("blocked_domains.txt"));
    const text = await response.text();
    return text.split("\n").map(domain => domain.trim()).filter(domain => domain !== "");
  } catch (error) {
    console.error("Error fetching blocked domains:", error);
    return [];
  }
}

function isBlockedDomain(url, blockedDomains) {
  return blockedDomains.some(domain => url.hostname === domain || url.hostname.endsWith(`.${domain}`));
}

function hideSearchResults(blockedDomains) {
  const searchResults = document.querySelectorAll(".g");
  searchResults.forEach((result) => {
    const linkElement = result.querySelector("a");
    if (linkElement && linkElement.href) {
      try {
        const url = new URL(linkElement.href);
        if (isBlockedDomain(url, blockedDomains)) {
          result.style.display = "none";
        }
      } catch (error) {
        console.error("Invalid URL:", linkElement.href);
      }
    }
  });
}

chrome.storage.sync.get("isEnabled", (data) => {
  if (data.isEnabled !== false) {
    fetchBlockedDomains().then((blockedDomains) => {
      hideSearchResults(blockedDomains);

      const observer = new MutationObserver(() => {
        hideSearchResults(blockedDomains);
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }
});