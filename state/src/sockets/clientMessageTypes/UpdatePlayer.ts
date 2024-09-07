

export interface IUpdatePlayer {
    username: string;
    color: string;
}

export class UpdatePlayer implements IUpdatePlayer {
    username: string;
    color: string;

    constructor(username: string, color: string) {
        this.username = username;
        this.color = color;
    }

    static validate(o: any) {
        return typeof(o.username) === 'string' &&
            typeof(o.color) === 'string';
    }
}