// Imports
const {
    calculateTip,
    fahrenheitToCelsius,
    celsiusToFahrenheit,
} = require('../src/math');

test('Should calculate total with tip', () => {
    const total = calculateTip(10, 30);
    expect(total).toBe(13);
});

test('Should calculate total with default tip', () => {
    const total = calculateTip(10);
    expect(total).toBe(12);
});

test('Should convert 32 F to 0 C', () => {
    const result = fahrenheitToCelsius(32);
    expect(result).toBe(0);
});

test('Should convert 0 C to 32 F', () => {
    const result = celsiusToFahrenheit(0);
    expect(result).toBe(32);
});

test('Async test demo', (done) => {
    setTimeout(() => {
        expect(1).toBe(2);
        done();
    }, 2000);
});
