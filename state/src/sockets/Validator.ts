

// How is there no built in thing in typescript or javascript for this?
export function isValid(objToValidate: any, referenceObj: any): boolean {
    console.log(objToValidate);
    console.log(referenceObj);
    if (objToValidate == null || objToValidate == undefined) return false;
    let valid = true;
    for (const key in referenceObj) {
        if (typeof(referenceObj[key]) !== typeof(objToValidate[key])) {
            valid = false;
        } 
        if (typeof(referenceObj[key] == "object")) {
            const subValid = isValid(objToValidate[key], referenceObj[key]);
            if (!subValid) valid = false;
        }
    }
    return valid;
}