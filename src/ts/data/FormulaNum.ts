export abstract class FormulaNum {
    public isDecimal(): boolean {
        return false
    }

    public isFraction(): boolean {
        return false
    }

    public abstract toString(): string
}

declare const numTypes: ["normal", "decimal", "fraction"]
export declare type NumberTypes = typeof numTypes[number]

