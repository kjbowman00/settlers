import { classifyAs } from "../../state/src/sockets/Classifier.js";
import { MenuManager } from "./components/MenuManager.js";

onload = () => {
    let menuManager = new MenuManager();
}

class TestThing {
    num: number;
    constructor(num: number) {
        this.num = num;
    }

    modify(num: number) {
        this.num = num;
    }
}

const thing = {num: 1};
const testThing = classifyAs(thing, TestThing);

console.log(testThing);
testThing.modify(5);

console.log(testThing);