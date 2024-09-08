import { ClientSocketMessage } from "./ClientSocketMessage"

// (...args: any[] => T) represents a class creation function (just a class)
//      ...args: any[] means an arbitrary number of parameter arguments of any type.
export function classifyAs<T>(obj: object, classType: new (...args: any[])=> T) : T{
    return Object.create(classType.prototype, Object.getOwnPropertyDescriptors({num: 6})) as T;
}

