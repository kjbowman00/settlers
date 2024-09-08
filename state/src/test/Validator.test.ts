import { validateType } from "../sockets/Validator";


test("Test Primitive Types", () => {
    let myVar :any = undefined;
    expect(validateType(myVar, 'undefined')).toBe(true);

    myVar = {};
    expect(validateType(myVar, 'object')).toBe(true);

    myVar = true;
    expect(validateType(myVar, 'boolean')).toBe(true);

    myVar = 5;
    expect(validateType(myVar, 'number')).toBe(true);

    myVar = BigInt(1);
    expect(validateType(myVar, 'bigint')).toBe(true);
    
    myVar = 'myString';
    expect(validateType(myVar, 'string')).toBe(true);

    myVar = Symbol('mySymbol');
    expect(validateType(myVar, 'symbol')).toBe(true);

    myVar = () => {};
    expect(validateType(myVar, 'function')).toBe(true);
});

test("Test optionally undefined", () => {
    let myVar: any = 5;
    expect(validateType(myVar, 'number', 'undefined')).toBe(true);
    myVar = undefined;
    expect(validateType(myVar, 'number', 'undefined')).toBe(true);
    myVar = 'aString';
    expect(validateType(myVar, 'number', 'undefined')).toBe(false);
});

class TestClass {
    num: number;
    str: string;
    optional: number | undefined;
    constructor(num: number, str: string, optional: number | undefined) {
        this.num = num;
        this.str = str;
        this.optional = optional;
    }
    static validate(o: any): boolean {
        return validateType(o, 'object') &&
            validateType(o.num, 'number') &&
            validateType(o.str, 'string') &&
            validateType(o.optional, 'number', 'undefined');
    }
}
test("Test class validation", () => {
    expect(validateType({num: 5, str: 'hello', optional: 5}, TestClass)).toBe(true);
    expect(validateType({num: 5, str: 'hello', optional: undefined}, TestClass)).toBe(true);
    expect(validateType({num: 5, optional: undefined}, TestClass)).toBe(false);
});
class TestClassHolder {
    num: number;
    testClass: TestClass;
    constructor(num: number) {
        this.num = num;
        this.testClass = new TestClass(num, 'test', 1);
    }
    static validate(o: any): boolean {
        return validateType(o, 'object') &&
            validateType(o.num, 'number') &&
            validateType(o.testClass, TestClass);
    }
}
test("Test class holding another class", () => {
    const holder = new TestClassHolder(5);
    expect(validateType(holder, TestClassHolder)).toBe(true);
    expect(validateType({num: 1, testClass: {num: 5, str: ''}}, TestClassHolder)).toBe(true);
    expect(validateType({num: 1, testClass: {}}, TestClassHolder)).toBe(false);
});

test("Test arrays", () => {
    const arr: string[] = ['hi', 'hello'];
    expect(validateType(arr, ['string'])).toBe(true);
    expect(validateType(arr, ['number'])).toBe(false);

    const arr2: (string | undefined)[] = ['hi', undefined];
    expect(validateType(arr2, ['string', 'undefined'])).toBe(true);
    expect(validateType(arr2, ['string'])).toBe(false);
    
    const arr3: (string | undefined)[][] = [['hi', undefined]];
    expect(validateType(arr3, [['string', 'undefined']])).toBe(true);
    expect(validateType(arr3, ['string', 'undefined'])).toBe(false);

    const arr4 = [[['hi', 'hello']]];
    expect(validateType(arr4, [[['string']]])).toBe(true);
});