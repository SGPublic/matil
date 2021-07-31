import {FormulaNum} from "./FormulaNum";
import {FractionNum} from "./numbers/FractionNum";

export class Formula {
    private markdown: string
    private length: number = 1

    private fraction: boolean = false
    private decimal: boolean = false

    private denominator: number|undefined = undefined
    private baseOperator: FormulasOperator|undefined = undefined
    private readonly baseNum: FormulaNum|undefined = undefined

    constructor(base: FormulaNum) {
        this.baseNum = base
        this.markdown = base.toString()
    }

    public push(operator: FormulasOperator, num2: FormulaNum): Formula {
        this.baseOperator = operator
        this.judgeNum(num2)
        this.markdown = this.markdown.concat(" ")
            .concat(operator.toString(), " ")
            .concat(num2.toString())
        this.length += 1
        return this
    }

    public unshift(num1: FormulaNum, operator: FormulasOperator): Formula {
        this.baseOperator = operator
        this.judgeNum(num1)
        this.markdown = num1.toString().concat(" ")
            .concat(operator.toString(), " ")
            .concat(this.markdown)
        this.length += 1
        return this
    }

    private judgeNum(num: FormulaNum){
        if (num.isDecimal()){
            this.decimal = true
        }
        if (num.isFraction()){
            this.fraction = true
            this.denominator = (num as FractionNum).denominator
        }
    }

    public hasDecimal(): boolean {
        return this.decimal
    }

    public hasFraction(): boolean {
        return this.fraction
    }

    public getDenominator(): number|undefined {
        return this.denominator
    }

    public getOperator(): FormulasOperator|undefined {
        return this.baseOperator
    }

    public getBaseNum(): FormulaNum|undefined {
        return this.baseNum
    }

    public doFinal(): string {
        return this.markdown
    }
}

declare const operators: ["+", "-", "\\times", "\\div"]
export declare type FormulasOperator = typeof operators[number]