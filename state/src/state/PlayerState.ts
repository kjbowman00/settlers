
// Only for player meta data
export class PlayerState {
    id: string;
    username: string;
    color: string;

    constructor(id: string, username: string, color: string) {
        this.id = id;
        this.username = username;
        this.color = color;
    }
}