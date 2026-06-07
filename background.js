chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Completely bypasses web page CSP limits
    if (request.action === "fetchTimezoneMap") {
        fetch('https://cdn.jsdelivr.net/gh/bettiolo/timezone-to-currency/timezone-to-currency.json')
            .then(res => res.json())
            .then(data => sendResponse({ success: true, data }))
            .catch(err => sendResponse({ success: false, error: err.message }));
        return true;
    }

    if (request.action === "fetchRates") {
        fetch(`https://open.er-api.com/v6/latest/${request.base}`)
            .then(res => res.json())
            .then(data => sendResponse({ success: true, data }))
            .catch(err => sendResponse({ success: false, error: err.message }));
        return true;
    }

    // Native tab search simulation for Firefox/Zen Browser
    if (request.action === "nativeSearch") {
        if (typeof browser !== 'undefined' && browser.search && browser.search.search) {
            browser.search.search({ query: request.text });
        } else if (typeof chrome !== 'undefined' && chrome.search && chrome.search.query) {
            chrome.search.query({ text: request.text, disposition: "NEW_TAB" });
        } else {
            chrome.tabs.create({
                url: `https://www.google.com/search?q=${encodeURIComponent(request.text)}`,
                active: true
            });
        }
        sendResponse({ success: true });
    }
});