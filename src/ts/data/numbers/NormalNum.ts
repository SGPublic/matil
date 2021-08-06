import {FormulaNum} from "../FormulaNum";
import {DecimalNum} from "./DecimalNum";

export class NormalNum extends FormulaNum {
    private readonly num: number
    private constructor(num: number) {
        super()
        this.num = num
    }

    public getNumerator(): number {
        return this.num;
    }

    public times(times: NormalNum): NormalNum {
        return NormalNum.create(this.num * times.num);
    }

    public static rand(max: number, min: number): NormalNum {
        return new NormalNum(Math.ceil(
            DecimalNum.rand(max, min).num
        ))
    }

    public static create(num: number): NormalNum {
        return new NormalNum(num)
    }

    public toString(): string {
        return this.num.toString();
    }
}