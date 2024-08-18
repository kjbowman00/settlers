

// How is there no built in thing in typescript or javascript for this?
export function isValid(objToValidate: Object, referenceObj: Object) {
    if (objToValidate == null || objToValidate == undefined) return false;
    for (const key in referenceObj) {
        return typeof(referenceObj[key]) == typeof(objToValidate[key]);
    }
}