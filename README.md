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

## 🛠️ Project Architecture

This extension is built on modern Manifest V3 standards with a highly modular and lightweight script execution order to guarantee high performance and low memory footprints:

* **`utils.js`**: Core helper functions shared across the UI components.
* **`currency-service.js`**: Deals with API fetch calls, currency string parsing, and computation logic.
* **`popup-manager.js`**: Handles the DOM injection, animations, and coordinates the selection UI coordinates.
* **`content.js`**: The main orchestration script that listens to user mouse event hooks (`mouseup`, `selectionchange`).

---

## 💾 Local Development & Installation

Since this extension is explicitly tailored for the **Zen Browser / Gecko** architecture, you can install and test it locally with ease:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/erdemaksoy/ZenBrowserSearchPopup.git](https://github.com/erdemaksoy/ZenBrowserSearchPopup.git)
   cd ZenBrowserSearchPopup
