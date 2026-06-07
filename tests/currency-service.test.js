// Mock browser globals before requiring currency-service
global.chrome = {
    storage: {
        local: {
            get: jest.fn(),
            set: jest.fn()
        }
    },
    runtime: {
        sendMessage: jest.fn()
    }
};

global.navigator = { language: 'en-US' };

// Mock Intl timezone
const DateTimeFormatObj = {
    resolvedOptions: () => ({ timeZone: 'America/New_York' })
};
global.Intl.DateTimeFormat = jest.fn(() => DateTimeFormatObj);
global.getSystemTimeZone = () => DateTimeFormatObj.resolvedOptions().timeZone;

const { getTargetCurrency, initializeExtensionData } = require('../currency-service');

describe('currency-service.js Timezone/Language Target Resolution', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Default Chrome storage mock extended with more regions
        chrome.storage.local.get.mockImplementation((keys, cb) => {
            cb({
                zen_tz_map: {
                    'America/New_York': 'USD',
                    'America/Los_Angeles': 'USD',
                    'Europe/London': 'GBP',
                    'Europe/Paris': 'EUR',
                    'Asia/Tokyo': 'JPY',
                    'Asia/Shanghai': 'CNY'
                }
            });
        });
    });

    // 1. America East & West tests
    test('should resolve target currency for America East (New York)', async () => {
        DateTimeFormatObj.resolvedOptions = () => ({ timeZone: 'America/New_York' });
        global.navigator.language = 'tr-TR'; // Timezone overrides language
        const target = await getTargetCurrency();
        expect(target).toBe('USD');
    });

    test('should resolve target currency for America West (Los Angeles)', async () => {
        DateTimeFormatObj.resolvedOptions = () => ({ timeZone: 'America/Los_Angeles' });
        global.navigator.language = 'ja-JP'; 
        const target = await getTargetCurrency();
        expect(target).toBe('USD');
    });

    // 2. Europe tests
    test('should resolve target currency for Europe (London)', async () => {
        DateTimeFormatObj.resolvedOptions = () => ({ timeZone: 'Europe/London' });
        global.navigator.language = 'tr-TR'; 
        const target = await getTargetCurrency();
        expect(target).toBe('GBP');
    });

    test('should resolve target currency for Europe (Paris) into EUR', async () => {
        DateTimeFormatObj.resolvedOptions = () => ({ timeZone: 'Europe/Paris' });
        global.navigator.language = 'en-US'; 
        const target = await getTargetCurrency();
        expect(target).toBe('EUR');
    });

    // 3. Asia tests
    test('should resolve target currency for Asia (Tokyo) into JPY', async () => {
        DateTimeFormatObj.resolvedOptions = () => ({ timeZone: 'Asia/Tokyo' });
        global.navigator.language = 'en-US'; 
        const target = await getTargetCurrency();
        expect(target).toBe('JPY');
    });

    test('should resolve target currency for Asia (Shanghai) into CNY', async () => {
        DateTimeFormatObj.resolvedOptions = () => ({ timeZone: 'Asia/Shanghai' });
        global.navigator.language = 'en-US'; 
        const target = await getTargetCurrency();
        expect(target).toBe('CNY');
    });

    // 4. Fallback Logic Tests (Timezone not found, relies on Language)
    test('should absolute fallback to TRY for Istanbul timezone', async () => {
        DateTimeFormatObj.resolvedOptions = () => ({ timeZone: 'Europe/Istanbul' });
        global.navigator.language = 'en-US'; // Irrelevant, Istanbul is absolute
        const target = await getTargetCurrency();
        expect(target).toBe('TRY');
    });

    test('should fallback to navigator.language (ja-JP -> JPY) if timezone map fails', async () => {
        DateTimeFormatObj.resolvedOptions = () => ({ timeZone: 'Unknown/City' });
        global.navigator.language = 'ja-JP'; 
        const target = await getTargetCurrency();
        expect(target).toBe('JPY');
    });

    test('should fallback to navigator.language (de-DE -> EUR) if timezone map fails', async () => {
        DateTimeFormatObj.resolvedOptions = () => ({ timeZone: 'Unknown/City' });
        global.navigator.language = 'de-DE'; 
        const target = await getTargetCurrency();
        expect(target).toBe('EUR');
    });

    test('should default to USD if all else fails (Unknown Timezone + Unknown Lang)', async () => {
        DateTimeFormatObj.resolvedOptions = () => ({ timeZone: 'Unknown/City' });
        global.navigator.language = 'unknown-lang'; 
        const target = await getTargetCurrency();
        expect(target).toBe('USD'); // Final fallback
    });
});
