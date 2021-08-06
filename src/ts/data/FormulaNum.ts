import {NormalNum} from "./numbers/NormalNum";

export abstract class FormulaNum {
    public isDecimal(): boolean {
        return false
    }

    public isFraction(): boolean {
        return false
    }

    public getDenominator(): number {
        return 1;
    }

    public abstract times(times: NormalNum): FormulaNum

    public abstract getNumerator(): number

    public abstract toString(): string
}

declare const numTypes: ["normal", "decimal", "fraction"]
export declare type NumberType = typeof numTypes[number]

