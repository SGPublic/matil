import {FormulaNum} from "../FormulaNum";

export class FractionNum extends FormulaNum {
    // 分子
    public readonly numerator: number
    // 分母
    public readonly denominator: number

    private constructor(numerator: number, denominator: number) {
        super()
        this.numerator = numerator
        this.denominator = denominator
    }

    public static rand(max: number, base: FractionNum|undefined = undefined, isDiv: boolean = false){
        if (base === undefined){
            return new FractionNum(
                Math.ceil(Math.random() * max),
                Math.ceil(Math.random() * max)
            )
        }
        if (isDiv){
            return new FractionNum(
                Math.ceil(Math.random() * max) * base.numerator,
                base.denominator
            )
        }
        return new FractionNum(
            Math.ceil(Math.random() * max),
            base.denominator
        )
    }

    public isFraction(): boolean {
        return true
    }

    public toString(): string {
        return  "\\frac{" + this.numerator + "}{" + this.denominator + "}"
    }
}