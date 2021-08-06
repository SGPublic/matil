import {FormulaNum} from "../FormulaNum";
import {NormalNum} from "./NormalNum";

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

    public getNumerator(): number {
        return this.numerator;
    }

    public getDenominator(): number {
        return this.denominator;
    }

    public times(times: NormalNum): FractionNum {
        return FractionNum.create(this.numerator * times.getNumerator(), this.denominator);
    }

    public static rand(max: number){
        return new FractionNum(
            Math.ceil(Math.random() * max),
            Math.ceil(Math.random() * max)
        )
    }

    public static create(numerator: number, denominator: number): FractionNum {
        return new FractionNum(numerator, denominator)
    }

    public isFraction(): boolean {
        return true
    }

    public toString(): string {
        return  "\\frac{" + this.numerator + "}{" + this.denominator + "}"
    }
}