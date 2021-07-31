import {FormulaNum} from "../FormulaNum";
import {DecimalNum} from "./DecimalNum";

export class NormalNum extends FormulaNum {
    public readonly num: number
    private constructor(num: number) {
        super()
        this.num = num
    }

    public static rand(max: number, min: number, base: NormalNum|undefined = undefined): NormalNum {
        const num = Math.ceil(DecimalNum.rand(max, min).num)
        if (base === undefined){
            return new NormalNum(num)
        }
        return new NormalNum(num * base.num)
    }

    public toString(): string {
        return this.num.toString();
    }
}