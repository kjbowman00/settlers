

// How is there no built in thing in typescript or javascript for this?
export function isValid(objToValidate: Object, referenceObj: Object) {
    console.log(objToValidate);
    console.log(referenceObj);
    if (objToValidate == null || objToValidate == undefined) return false;
    let isValid = true;
    for (const key in referenceObj) {
        if (typeof(referenceObj[key]) !== typeof(objToValidate[key])) {
            isValid = false;
        }
    }
    return isValid;
}