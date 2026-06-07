// Temel semboller ve mutlak kısaltmalar varsayılan olarak kalıyor
let currencySymbolMap = {
    '$': 'USD', '€': 'EUR', '£': 'GBP', '¥': 'JPY', '₽': 'RUB', '₺': 'TRY', 'TL': 'TRY'
};

// İlk başta geniş bir regex ile başlar, motor çalışınca bu dinamik olarak güncellenir
let currencyRegex = /([$€£¥₽₺]|[A-Za-z]{3})\s*([\d,.]+)|([\d,.]+)\s*([$€£¥₽₺]|[A-Za-z]{3})/i;

/**
 * Tarayıcının yerel dil motorunu kullanarak tüm dünya para birimlerini haritaya işler.
 * @param {Array} isoCodes - API'den dönen geçerli para birimi kodları dizisi (Örn: ["USD", "EUR", ...])
 */
function buildDynamicCurrencyEngine(isoCodes) {
    // Kolaylık olsun diye en sık kullanılan Türkçe argoları/kısaltmaları önden verelim
    currencySymbolMap['dolar'] = 'USD';
    currencySymbolMap['euro'] = 'EUR';
    currencySymbolMap['avro'] = 'EUR';
    currencySymbolMap['sterlin'] = 'GBP';
    currencySymbolMap['ruble'] = 'RUB';
    currencySymbolMap['yen'] = 'JPY';

    // Tarayıcının yerel isim oluşturucuları (Yerleşik Sözlük)
    const trNames = new Intl.DisplayNames(['tr'], { type: 'currency' });
    const enNames = new Intl.DisplayNames(['en'], { type: 'currency' });

    isoCodes.forEach(code => {
        try {
            // 1. Evrensel sembolü dinamik olarak çıkart (Örn: CAD için "CA$")
            const parts = new Intl.NumberFormat('en', { style: 'currency', currency: code }).formatToParts(1);
            const currencyPart = parts.find(p => p.type === 'currency');
            if (currencyPart) {
                const symbol = currencyPart.value;
                if (symbol.length < 4 && !currencySymbolMap[symbol]) {
                    currencySymbolMap[symbol] = code;
                }
            }

            // 2. Türkçe ve İngilizce tam isimleri çek (Örn: "Amerikan Doları", "Japanese Yen")
            const trFullName = trNames.of(code).toLowerCase();
            const enFullName = enNames.of(code).toLowerCase();

            // Kelimeleri tek tek ayırıp haritaya ekle (Böylece hem "dolar" hem "doları" yakalanır)
            const words = [...trFullName.split(/[\s,.\/]+/), ...enFullName.split(/[\s,.\/]+/)];

            words.forEach(word => {
                // Çok kısa anlamsız bağlaçları eliyoruz (örn: "ve", "of")
                if (word.length > 2 && !currencySymbolMap[word]) {
                    currencySymbolMap[word] = code;
                }
            });

        } catch (e) {
            // Tarayıcının tanımadığı çok eski/egzotik bir para birimi gelirse pas geç
        }
    });

    // CRITICAL REGEX BUILDING: 
    // Regex oluştururken uzun kelimelerin/sembollerin önce gelmesi gerekir.
    // Yoksa regex "doları" kelimesini ararken "dol" kısmını önden kapıp hata yapabilir.
    const sortedKeys = Object.keys(currencySymbolMap).sort((a, b) => b.length - a.length);
    const escapedPatterns = sortedKeys.map(s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|');

    // Yeni devasa dinamik regex pattern'ımız hazır!
    currencyRegex = new RegExp(`(${escapedPatterns})\\s*([\\d,.]+)|([\\d,.]+)\\s*(${escapedPatterns})`, 'i');
}

function detectCurrency(text) {
    const match = text.match(currencyRegex);
    if (!match) return null;

    let rawCurrency = match[1] || match[4];
    let rawAmount = match[2] || match[3];

    const cleanAmount = parseFloat(rawAmount.replace(/,/g, ''));
    if (isNaN(cleanAmount)) return null;

    const lookup = rawCurrency.toLowerCase();
    // Haritadan eşleştirme yap (Önce tam eşleşme, sonra lowercase denemesi, en son fallback)
    const isoCode = currencySymbolMap[rawCurrency] || currencySymbolMap[lookup] || lookup.toUpperCase();

    return isoCode.length === 3 ? { amount: cleanAmount, code: isoCode } : null;
}

function getSystemTimeZone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { currencySymbolMap, buildDynamicCurrencyEngine, detectCurrency, getSystemTimeZone };
}
