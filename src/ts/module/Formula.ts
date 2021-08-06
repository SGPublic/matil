import {FormulaNum} from "../data/FormulaNum";
import {FractionNum} from "../data/numbers/FractionNum";

export class Formula {
    public static readonly NUM_NORMAL = "normal"
    public static readonly NUM_DECIMAL = "decimal"
    public static readonly NUM_FRACTION = "fraction"

    public static readonly OPER_ADD = "+"
    public static readonly OPER_SUB = "-"
    public static readonly OPER_MULTI = "\\times"
    public static readonly OPER_DIV = "\\div"

    private markdown: string
    private length: number = 1

    private fraction: boolean = false
    private decimal: boolean = false

    private denominator: number|undefined = undefined
    private baseOperator: FormulasOperator|undefined = undefined
    private readonly baseNum: FormulaNum|undefined = undefined

    private result: number

    constructor(base: FormulaNum) {
        this.baseNum = base
        this.result = base.getNumerator()
        this.markdown = base.toString()
        this.judgeNum(base)
    }

    public push(operator: FormulasOperator, num2: FormulaNum): Formula {
        this.judgeNum(num2, operator)
        this.markdown = this.markdown.concat(" ")
            .concat(operator.toString(), " ")
            .concat(num2.toString())
        return this
    }

    public unshift(num1: FormulaNum, operator: FormulasOperator): Formula {
        this.judgeNum(num1, operator)
        this.markdown = num1.toString().concat(" ")
            .concat(operator.toString(), " ")
            .concat(this.markdown)
        return this
    }

    private judgeNum(num: FormulaNum, operator: FormulasOperator|undefined = undefined){
        if (num.isDecimal()){
            this.decimal = true
        }
        if (num.isFraction()){
            this.fraction = true
            this.denominator = (num as FractionNum).denominator
        }
        if (operator === undefined){
            return
        }
        this.baseOperator = operator
        switch (operator) {
            case "+":
                this.result += num.getNumerator()
                break
            case "-":
                this.result = num.getNumerator() - this.result
                break
            case "\\div":
                this.result = num.getNumerator() / this.result
                break
            case "\\times":
                this.result *= num.getNumerator()
                break
        }
        this.length += 1
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

    public getResult(): number {
        return this.result
    }

    public doFinal(): string {
        return this.markdown
    }
}

declare const operators: ["+", "-", "\\times", "\\div"]
export declare type FormulasOperator = typeof operators[number]