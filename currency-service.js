const CACHE_DURATION = 30 * 60 * 1000;

async function initializeExtensionData() {
    return new Promise((resolve) => {
        chrome.storage.local.get(['zen_tz_map', 'rates_USD', 'rates_USD_time'], async (result) => {
            let tzMap = result.zen_tz_map;

            if (!tzMap) {
                const response = await chrome.runtime.sendMessage({ action: "fetchTimezoneMap" });
                if (response && response.success) {
                    tzMap = response.data;
                    chrome.storage.local.set({ zen_tz_map: tzMap });
                }
            }

            let rates = result.rates_USD;
            let cacheTime = result.rates_USD_time;

            if (!rates || !cacheTime || (Date.now() - parseInt(cacheTime) > CACHE_DURATION)) {
                const response = await chrome.runtime.sendMessage({ action: "fetchRates", base: "USD" });
                if (response && response.success) {
                    rates = response.data.rates;
                    chrome.storage.local.set({ rates_USD: rates, rates_USD_time: Date.now() });
                }
            }

            if (rates) {
                buildDynamicCurrencyEngine(Object.keys(rates));
            }

            resolve(tzMap);
        });
    });
}

async function getTargetCurrency() {
    const timeZone = getSystemTimeZone();

    // Absolute local safeguard for Turkey's timezone
    if (timeZone === 'Europe/Istanbul' || timeZone === 'Asia/Istanbul') {
        return 'TRY';
    }

    const tzMap = await initializeExtensionData();
    let target = tzMap ? tzMap[timeZone] : null;

    if (!target) {
        // Fallback to language detection if timezone mapping fails
        const lang = (typeof navigator !== 'undefined' && navigator.language ? navigator.language : '').toLowerCase();
        if (lang.includes('tr')) target = 'TRY';
        else if (lang.includes('en-gb')) target = 'GBP';
        else if (lang.includes('en-us')) target = 'USD';
        else if (lang.includes('ja')) target = 'JPY';
        else if (lang.includes('de') || lang.includes('fr') || lang.includes('it') || lang.includes('es') || lang.includes('nl')) target = 'EUR';
        else target = 'USD'; // Safe global fallback
    }

    return target;
}

async function fetchExchangeRate(base, target) {
    const cacheKey = `rates_${base}`;
    const cacheTimeKey = `${cacheKey}_time`;

    return new Promise((resolve) => {
        chrome.storage.local.get([cacheKey, cacheTimeKey], async (result) => {
            const cachedRates = result[cacheKey];
            const cacheTime = result[cacheTimeKey];

            if (cachedRates && cacheTime && (Date.now() - parseInt(cacheTime) < CACHE_DURATION)) {
                resolve(cachedRates[target]);
                return;
            }

            const response = await chrome.runtime.sendMessage({ action: "fetchRates", base: base });
            if (response && response.success) {
                const rates = response.data.rates;
                let dataToSet = {};
                dataToSet[cacheKey] = rates;
                dataToSet[cacheTimeKey] = Date.now();
                chrome.storage.local.set(dataToSet);
                resolve(rates[target]);
            } else {
                resolve(null);
            }
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initializeExtensionData, getTargetCurrency, fetchExchangeRate };
}
