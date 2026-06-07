const { detectCurrency, buildDynamicCurrencyEngine, currencySymbolMap } = require('../utils');

describe('utils.js Currency Detection Engine', () => {
    beforeAll(() => {
        // Initialize dynamic currency engine with some known codes
        buildDynamicCurrencyEngine(['USD', 'EUR', 'TRY', 'JPY', 'GBP', 'RUB']);
    });

    test('should correctly identify USD variations', () => {
        expect(detectCurrency('100$')).toEqual({ amount: 100, code: 'USD' });
        expect(detectCurrency('$ 50')).toEqual({ amount: 50, code: 'USD' });
        expect(detectCurrency('100.5 Dolar')).toEqual({ amount: 100.5, code: 'USD' });
        expect(detectCurrency('100 Doları')).toEqual({ amount: 100, code: 'USD' }); // Should catch TR mapped word
    });

    test('should correctly identify EUR variations', () => {
        expect(detectCurrency('50€')).toEqual({ amount: 50, code: 'EUR' });
        expect(detectCurrency('100 Euro')).toEqual({ amount: 100, code: 'EUR' });
        expect(detectCurrency('Avro 200.50')).toEqual({ amount: 200.5, code: 'EUR' });
    });

    test('should correctly identify TRY variations', () => {
        expect(detectCurrency('100 TL')).toEqual({ amount: 100, code: 'TRY' });
        expect(detectCurrency('₺50')).toEqual({ amount: 50, code: 'TRY' });
        expect(detectCurrency('250.75 Türk Lirası')).toEqual({ amount: 250.75, code: 'TRY' });
    });

    test('should correctly identify JPY variations', () => {
        expect(detectCurrency('500 ¥')).toEqual({ amount: 500, code: 'JPY' });
        expect(detectCurrency('1000 Yen')).toEqual({ amount: 1000, code: 'JPY' });
    });

    test('should ignore text with no currency', () => {
        expect(detectCurrency('Hello World 100')).toBeNull();
        expect(detectCurrency('100')).toBeNull();
    });
});
