
class CanValidate {
    constructor(...args: any[]) {
        // This is here to allow any potential inheritors have arbitrary constructors
    }
    static validate(o: any): boolean {
        return false;
    }
}

type baseTypes = 'undefined' | 'object' | 'boolean' |
    'number' | 'bigint' | 'string' | 'symbol' | 'function' | typeof CanValidate;

type arrayType = (baseTypes)[];
type arrayType2d = (arrayType)[];
type arrayType3d = (arrayType2d)[];

type types = baseTypes | arrayType | arrayType2d | arrayType3d;

/**
 * Checks if an object is of one of many possible types
 * @param o the object to check
 * @param args a list of possible types for the object
 * @returns 
 */
export function validateType(o: any, ...args: types[]) {

    const oType = typeof(o);

    for (const possibleType of args) {
        
        if (typeof possibleType === 'string') {
            // Check in base types
            if (oType === possibleType) return true;
        } else if ('validate' in possibleType) {
            // Class validation
            if (possibleType.validate(o)) return true;
        } else {
            // Array validation
            if (! Array.isArray(o)) return false;
            for (const element of o) {
                let atLeastOneInnerTypeValid = false;
                for (const possibleInnerArrayType of possibleType) {
                    if (validateType(element, possibleInnerArrayType)) atLeastOneInnerTypeValid = true;
                }
                if (! atLeastOneInnerTypeValid) return false;
            }
            return true;
        }
    }

    return false;
}

