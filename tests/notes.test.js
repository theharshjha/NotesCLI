const add = (a, b) => a + b

test('returns sum of two numbers', () => {
    const res = add(3, 4);
    expect(res).toBe(6);
})