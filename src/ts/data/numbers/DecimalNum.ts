import {FormulaNum} from "../FormulaNum";
import {NormalNum} from "./NormalNum";

export class DecimalNum extends FormulaNum {
    public readonly num: number

    private constructor(num: number) {
        super()
        this.num = parseFloat(num.toFixed(2))
    }

    public getNumerator(): number {
        return this.num;
    }

    public isDecimal(): boolean {
        return true;
    }

    public times(times: NormalNum): DecimalNum {
        return DecimalNum.create(this.num * times.getNumerator());
    }

    public static rand(max: number, min: number): DecimalNum {
        return new DecimalNum(
            Math.random() * (max - min) + min
        )
    }

    public static create(num: number): DecimalNum {
        return new DecimalNum(num)
    }

    public toString(): string {
        return this.num.toFixed(2);
    }
}