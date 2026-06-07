if (!document.getElementById('zen-popup-styles')) {
    const style = document.createElement('style');
    style.id = 'zen-popup-styles';
    style.textContent = `
    @keyframes zen-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
    document.head.appendChild(style);
}

function createUnifiedPopup(selectedText, rect, isCurrency) {
    removeExistingPopup();

    const popup = document.createElement('div');
    popup.id = 'zen-smart-popup';

    Object.assign(popup.style, {
        position: 'absolute',
        top: `${rect.top + window.scrollY - 42}px`,
        left: `${rect.left + window.scrollX + (rect.width / 2) - 45}px`,
        backgroundColor: '#09090b', // Pitch Black / Obsidian
        border: '1px solid #27272a', // Subtle dark gray border
        color: '#f4f4f5',
        padding: '6px 12px',
        borderRadius: '6px',
        zIndex: '999999',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        boxShadow: '0 4px 20px rgba(0,0,0,0.7)',
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        whiteSpace: 'nowrap'
    });

    // Prevent interactions inside the popup from triggering document listeners
    popup.addEventListener('mousedown', (e) => e.stopPropagation());
    popup.addEventListener('mouseup', (e) => e.stopPropagation());

    // Pure Minimalist Text Search Button
    const searchBtn = document.createElement('button');
    searchBtn.textContent = 'Search';
    stylePopupComponent(searchBtn);
    searchBtn.onclick = () => {
        chrome.runtime.sendMessage({ action: "nativeSearch", text: selectedText });
        removeExistingPopup();
    };
    popup.appendChild(searchBtn);

    // Currency Block
    if (isCurrency) {
        const divider = document.createElement('span');
        divider.textContent = '·'; // Sleek dot separator instead of pipe
        divider.style.color = '#3f3f46';
        popup.appendChild(divider);

        const currencyContainer = document.createElement('div');
        currencyContainer.id = 'zen-currency-container';
        currencyContainer.style.display = 'flex';
        currencyContainer.style.alignItems = 'center';

        const spinner = document.createElement('div');
        Object.assign(spinner.style, {
            width: '10px',
            height: '10px',
            border: '2px solid #27272a',
            borderTop: '2px solid #22c55e', // Vibrant green spinner accent
            borderRadius: '50%',
            animation: 'zen-spin 0.5s linear infinite'
        });

        currencyContainer.appendChild(spinner);
        popup.appendChild(currencyContainer);
    }

    document.body.appendChild(popup);
}

function updatePopupCurrency(formattedValue) {
    const container = document.getElementById('zen-currency-container');
    if (container) {
        container.textContent = formattedValue;
        container.style.color = '#22c55e'; // Modern green text
        container.style.fontWeight = '500';
        container.style.fontSize = '12px';
    }
}

function stylePopupComponent(btn) {
    Object.assign(btn.style, {
        background: 'none',
        border: 'none',
        color: '#e4e4e7',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '500',
        padding: '2px 4px',
        borderRadius: '4px',
        transition: 'color 0.15s ease, background 0.15s ease'
    });
    btn.onmouseover = () => {
        btn.style.backgroundColor = '#18181b';
        btn.style.color = '#ffffff';
    };
    btn.onmouseout = () => {
        btn.style.backgroundColor = 'transparent';
        btn.style.color = '#e4e4e7';
    };
}

function removeExistingPopup() {
    const popup = document.getElementById('zen-smart-popup');
    if (popup) popup.remove();
}