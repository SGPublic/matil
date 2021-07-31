import {FormulaNum} from "../FormulaNum";

export class DecimalNum extends FormulaNum {
    public readonly num: number
    private constructor(num: number) {
        super()
        this.num = Math.ceil(num * 100) / 100
    }

    public isDecimal(): boolean {
        return true;
    }

    public static rand(max: number, min: number, base: DecimalNum|undefined = undefined): DecimalNum {
        const num = Math.random() * (max - min) + min
        if (base === undefined){
            return new DecimalNum(num)
        }
        return new DecimalNum(base.num * Math.ceil(num))
    }

    public toString(): string {
        return this.num.toFixed(2);
    }
}