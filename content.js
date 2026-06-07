initializeExtensionData();

document.addEventListener('mouseup', (event) => {
    setTimeout(async () => {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        if (!selectedText || selectedText.length <= 1) return;

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const currencyData = detectCurrency(selectedText);

    if (currencyData) {
        createUnifiedPopup(selectedText, rect, true);
        const targetCurrency = await getTargetCurrency();

        if (currencyData.code === targetCurrency) {
            const container = document.getElementById('zen-currency-container');
            if (container) container.previousSibling.remove();
            if (container) container.remove();
            return;
        }

        const rate = await fetchExchangeRate(currencyData.code, targetCurrency);
        if (rate) {
            const convertedValue = currencyData.amount * rate;
            const formatted = new Intl.NumberFormat(navigator.language, {
                style: 'currency',
                currency: targetCurrency,
                maximumFractionDigits: 0
            }).format(convertedValue);

            updatePopupCurrency(formatted);
        } else {
            const container = document.getElementById('zen-currency-container');
            if (container) {
                container.previousSibling.remove();
                container.remove();
            }
        }
    } else {
        createUnifiedPopup(selectedText, rect, false);
    }
    }, 10);
});

document.addEventListener('mousedown', (event) => {
    const popup = document.getElementById('zen-smart-popup');
    if (popup && !popup.contains(event.target)) {
        removeExistingPopup();
    }
});