# Zen Search and Currency Converter Popup 🚀

A lightweight, privacy-focused Manifest V3 browser extension designed exclusively for **Zen Browser** (and Gecko-based browsers). 

This extension bridges a favorite feature gap across browsers by bringing **Opera GX's iconic text-selection popup utility** straight into Zen Browser's beautiful, minimalist ecosystem. Highlight any text to search instantly or convert foreign currencies on the fly!

<div align="center">

# 🚀 Try It Live!

**Want to experience it right away?** The extension is officially published on the Firefox Add-ons store. Elevate your Zen Browser experience with just one click!

[![Install on Firefox](https://img.shields.io/badge/Firefox_Add--ons-Install_Extension-FF7139?style=for-the-badge&logo=firefox-browser&logoColor=white)](https://addons.mozilla.org/en-US/firefox/addon/search-and-currency-popup/)

---

</div>

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

## 🛠️ Project Architecture & Manifest Template

To make the extension work correctly in Gecko-based environments (like Zen Browser), a valid Manifest V3 structure is required. Below is the standard configuration template used in this project:

```json
{
  "manifest_version": 3,
  "name": "Zen Search and Currency Converter Popup",
  "version": "1.0.0",
  "description": "Brings the popular Opera GX text selection popup to Zen Browser.",
  "permissions": [
    "storage",
    "search"
  ],
  "background": {
    "scripts": [
      "background.js"
    ]
  ],
  "content_scripts": [
    {
      "matches": [
        "<all_urls>"
      ],
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
      "id": "your-extension-id@example.com",
      "data_collection_permissions": {
        "required": ["none"]
      }
    }
  }
}
```

### 🔑 Script Execution Order

The order of scripts inside the `js` array of `content_scripts` is highly critical. Since JavaScript files depend on each other's global objects, they must be loaded sequentially:

1. **`utils.js`**: Core helper utilities and shared configurations.
2. **`currency-service.js`**: Handles API communication, parsing logic, and math calculations.
3. **`popup-manager.js`**: Controls DOM injection, positioning logic, and UI rendering.
4. **`content.js`**: The main orchestrator that listens to mouse hooks and text selections.

---

## 💾 Local Development & Installation

Since this extension is explicitly tailored for the **Zen Browser** architecture, you can install and test it locally with ease:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
   cd your-repo-name
   ```
2. Set up your local configuration file (`manifest.json`) using the template provided above.
3. Open Zen Browser and navigate to `about:debugging`.
4. Click on **"This Firefox"** (or **"This Zen"**) in the left panel.
5. Click **"Load Temporary Add-on..."** (Geçici Eklenti Yükle).
6. Select the `manifest.json` file from your project folder.
7. *Voilà!* Test it out by highlighting some text or prices on any web page.

---

## 🔒 Privacy First
* **No Tracking:** This extension runs entirely inside your client-side sandbox environment.
* **Zero Telemetry:** Data collection permissions are strictly disabled (`none`). Your browsing patterns, highlighted words, and local parameters never leave your local machine.

## 📄 License
This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details. Feel free to clone, modify, and distribute!
