interface Attributes {
    text: string;
    complete?: boolean;
}

export class Todo {
    id?: string;
    text: string;
    complete: boolean;

    constructor({ text, complete = false }: Attributes) {
        this.id = this.uuidv4();
        this.text = text;
        this.complete = complete;
    }

    uuidv4(): string {
        return (String(1e7) + -1e3 + -4e3 + -8e3 + -1e11).toString().replace(/[018]/g, c =>
            (Number(c) ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))).toString(16)
        );
    }

}