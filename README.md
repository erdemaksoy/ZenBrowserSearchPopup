# Zen Search and Currency Converter Popup 🚀

A lightweight, privacy-focused Manifest V3 browser extension designed exclusively for **Zen Browser** (and Gecko-based browsers). 

This extension bridges a favorite feature gap across browsers by bringing **Opera GX's iconic text-selection popup utility** straight into Zen Browser's beautiful, minimalist ecosystem. Highlight any text to search instantly or convert foreign currencies on the fly!

---

## ✨ Features

### 🔍 1. Contextual Instant Search
* **Zero Friction:** Highlight any word, phrase, or sentence, and a minimalist popup appears instantly.
* **Zen Native:** Click the search icon to execute a web query using Zen Browser's default active search engine without distracting your current flow.

### 💱 2. Smart Currency Conversion
* **Automatic Detection:** Recognizes global currency patterns (like `$150`, `45 EUR`, `£20`) immediately within the selected text.
* **Local Processing:** Formats and converts foreign price points into your local currency automatically using standard Web APIs (`Intl`) and real-time exchange rates.
* **Cached Rates:** Uses localized storage to cache rates efficiently, minimizing network requests and maximizing speed.

---

## 🛠️ Project Architecture & Manifest Structure

To understand how the extension operates under the hood, here is a breakdown of our configuration based on Manifest V3:

```json
{
  "manifest_version": 3,
  "name": "Zen Search and Currency Converter Popup",
  "version": "1.0.0",
  "permissions": [
    "storage",
    "search"
  ],
  "background": {
    "scripts": ["background.js"]
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": [
        "utils.js",
        "currency-service.js",
        "popup-manager.js",
        "content.js"
      ]
    }
  ],
  "browser_specific_settings": {
    "gecko": {
      "id": "zen-search-and-currency-converter-popup@erdem.dev",
      "data_collection_permissions": {
        "required": ["none"]
      }
    }
  }
}
