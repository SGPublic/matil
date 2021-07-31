import {Formula, FormulasOperator} from "../data/Formula";
import {FormulaNum, NumberTypes} from "../data/FormulaNum";
import {DecimalNum} from "../data/numbers/DecimalNum";
import {FractionNum} from "../data/numbers/FractionNum";
import {NormalNum} from "../data/numbers/NormalNum";

export class RandomFactory {
    private readonly maxAddSub: number = 999
    private readonly minAddSub: number = 100
    private readonly maxMulti: number = 99
    private readonly maxDiv: number = 99

    private readonly allowOperators: Array<FormulasOperator> = []
    private readonly allowNums: Array<NumberTypes> = ["normal"]

    private readonly multiStep: boolean = false

    private constructor(maxAddSub: number, minAddSub: number, maxMulti: number, maxDiv: number,
                        allowDecimal: boolean, allowFraction: boolean, allowAdd: boolean,
                        allowSub: boolean, allowMulti: boolean, allowDiv: boolean, multiStep: boolean) {
        this.maxAddSub = maxAddSub
        this.minAddSub = minAddSub
        this.maxMulti = maxMulti
        this.maxDiv = maxDiv
        if (allowDecimal){
            this.allowNums.push("decimal")
        }
        if (allowFraction){
            this.allowNums.push("fraction")
        }
        if (allowAdd){
            this.allowOperators.push("+")
        }
        if (allowSub){
            this.allowOperators.push("-")
        }
        if (allowMulti){
            this.allowOperators.push("\\times")
        }
        if (allowDiv){
            this.allowOperators.push("\\div")
        }
        this.multiStep = multiStep
    }

    public random(): Formula {
        const formula: Formula = this.singleRandom()
        if (this.multiStep){

        }
        return formula
    }

    public singleRandom(baseFormula: Formula|undefined = undefined): Formula {
        let result: Formula
        let operator: FormulasOperator
        if (baseFormula === undefined){
            operator = this.randomOperator()
            result = new Formula(this.randomSingleNum(operator))
        } else {
            operator = baseFormula.getOperator()!
            result = baseFormula
        }
        const allowNums: Array<NumberTypes> = ["normal"]
        if (result.hasFraction() && operator !== "\\div") {
            allowNums.push("fraction")
        }
        const num2 = this.randomSingleNum(operator, allowNums, result.getBaseNum()!)
        if (operator === "\\div"){
            result.unshift(num2, operator)
        } else {
            result.push(operator, num2)
        }
        return result
    }

    private randomOperator(): FormulasOperator {
        return this.allowOperators[Math.floor(
            Math.random() * this.allowOperators.length
        )]
    }

    private randomSingleNum(operator: FormulasOperator, allowNums: Array<NumberTypes> = this.allowNums,
                            base: FormulaNum|undefined = undefined): FormulaNum {
        const numType = allowNums[Math.floor(
            Math.random() * this.allowNums.length
        )]
        let max: number
        let min: number = 1
        if (operator === "+" || operator === "-"){
            max = this.maxAddSub
            min = this.minAddSub
        } else if (operator === "\\times") {
            max = this.maxMulti
        } else if (base !== undefined){
            if (base.isFraction()){
                return FractionNum.rand(this.maxDiv, base as FractionNum, true)
            } else if (base.isDecimal()) {
                console.debug(base.toString())
                console.debug(DecimalNum.rand(this.maxDiv, 1, base as DecimalNum).toString())
                return DecimalNum.rand(this.maxDiv, 1, base as DecimalNum)
            } else {
                return NormalNum.rand(this.maxDiv, 1, base as NormalNum)
            }
        } else {
            max = this.maxDiv
        }

        switch (numType){
            case "decimal":
                return DecimalNum.rand(max, min)
            case "fraction":
                return FractionNum.rand(max, base === undefined ? undefined : (base as FractionNum))
            default:
                return NormalNum.rand(max, min)
        }
    }

    public static Builder = class RandomFactoryBuilder {
        private maxAddSub = 999
        private minAddSub = 100
        private maxMulti = 99
        private maxDiv = 99
        private allowDecimal = false
        private allowFraction = false

        private allowAdd = true
        private allowSub = false
        private allowMulti = false
        private allowDiv = false

        private multiStep = false

        public setMaxAddSub(value: number): RandomFactoryBuilder {
            this.maxAddSub = value
            return this
        }

        public setMinAddSub(value: number): RandomFactoryBuilder {
            this.minAddSub = value
            return this
        }

        public setMaxMulti(value: number): RandomFactoryBuilder {
            this.maxMulti = value
            return this
        }

        public setMaxDiv(value: number): RandomFactoryBuilder {
            this.maxDiv = value
            return this
        }

        public isAllowDecimal(value: boolean): RandomFactoryBuilder {
            this.allowDecimal = value
            return this
        }

        public isAllowFraction(value: boolean): RandomFactoryBuilder {
            this.allowFraction = value
            return this
        }

        public isAllowAdd(value: boolean): RandomFactoryBuilder {
            this.allowAdd = value
            return this
        }

        public isAllowSub(value: boolean): RandomFactoryBuilder {
            this.allowSub = value
            return this
        }

        public isAllowMulti(value: boolean): RandomFactoryBuilder {
            this.allowMulti = value
            return this
        }

        public isAllowDiv(value: boolean): RandomFactoryBuilder {
            this.allowDiv = value
            return this
        }

        public isMultiStep(value: boolean): RandomFactoryBuilder {
            this.multiStep = value
            return this
        }

        public build(): RandomFactory {
            return new RandomFactory(this.maxAddSub, this.minAddSub, this.maxMulti, this.maxDiv, this.allowDecimal,
                this.allowFraction, this.allowAdd, this.allowSub, this.allowMulti, this.allowDiv, this.multiStep)
        }
    }
}