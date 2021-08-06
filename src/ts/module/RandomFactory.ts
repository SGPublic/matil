import {Formula, FormulasOperator} from "./Formula";
import {FormulaNum, NumberType} from "../data/FormulaNum";
import {DecimalNum} from "../data/numbers/DecimalNum";
import {FractionNum} from "../data/numbers/FractionNum";
import {NormalNum} from "../data/numbers/NormalNum";

export class RandomFactory {
    private readonly maxAddSub: number = 999
    private readonly minAddSub: number = 100
    private readonly maxMulti: number = 99
    private readonly maxDiv: number = 99

    private readonly allowOperators: Array<FormulasOperator> = [Formula.OPER_ADD]
    private readonly allowNums: Array<NumberType> = [Formula.NUM_NORMAL]

    private constructor(maxAddSub: number, minAddSub: number, maxMulti: number,
                        maxDiv: number, allowNums: Array<NumberType>,
                        allowOperators: Array<FormulasOperator>, multiStep: boolean) {
        this.maxAddSub = maxAddSub
        this.minAddSub = minAddSub
        this.maxMulti = maxMulti
        this.maxDiv = maxDiv
        this.allowNums = allowNums
        this.allowOperators = allowOperators
        if (multiStep) {
            this.random = this.randomMulti
        } else {
            this.random = this.randomSimple
        }
    }

    public readonly random: () => Formula

    private randomSimple(): Formula {
        const oper: FormulasOperator = this.randomOperator()
        const num1: FormulaNum = this.randomSingleNum(oper)
        const allowNums: Array<NumberType> = [Formula.NUM_NORMAL]
        if (num1.isDecimal()){
            allowNums.push(Formula.NUM_DECIMAL)
        } else if (num1.isFraction()) {
            allowNums.push(Formula.NUM_FRACTION)
        }
        let num2: FormulaNum
        if (oper === Formula.OPER_DIV){
            num2 = num1.times(NormalNum.rand(this.maxDiv, 1))
        } else {
            num2 = this.randomSingleNum(oper, allowNums)
        }
        let result: Formula = new Formula(num1)
        if (oper === Formula.OPER_DIV || Math.random() < 0.5){
            result.unshift(num2, oper)
        } else {
            result.push(oper, num2)
        }
        return result
    }

    // @ts-ignore
    private randomMulti(): Formula {

    }

    private randomOperator(allows: Array<FormulasOperator> = this.allowOperators): FormulasOperator {
        return allows[Math.floor(
            Math.random() * allows.length
        )]
    }

    private randomSingleNum(oper: FormulasOperator, allows: Array<NumberType> = this.allowNums): FormulaNum {
        let max: number
        let min: number = 1
        switch (oper) {
            case Formula.OPER_ADD:
            case Formula.OPER_SUB:
                max = this.maxAddSub
                min = this.minAddSub
                break
            case Formula.OPER_MULTI:
                max = this.maxMulti
                break
            case Formula.OPER_DIV:
                max = this.maxDiv
                break
        }
        switch (RandomFactory.randomNumType(allows)) {
            case Formula.NUM_NORMAL:
                return NormalNum.rand(max, min)
            case Formula.NUM_DECIMAL:
                return DecimalNum.rand(max, min)
            case Formula.NUM_FRACTION:
                return FractionNum.rand(max)
        }
    }

    private static randomNumType(allows: Array<NumberType>): NumberType {
        return allows[Math.floor(
            Math.random() * allows.length
        )]
    }

    public static Builder = class RandomFactoryBuilder {
        private maxAddSub = 999
        private minAddSub = 100
        private maxMulti = 99
        private maxDiv = 99
        private allowOpers = new Array<FormulasOperator>()
        private allowNums = new Array<NumberType>()

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

        public setAllowOpers(allowOpers: Array<FormulasOperator>): RandomFactoryBuilder {
            this.allowOpers = allowOpers
            return this
        }

        public setAllowNums(allowNums: Array<NumberType>): RandomFactoryBuilder {
            this.allowNums = allowNums
            return this
        }

        public isMultiStep(value: boolean): RandomFactoryBuilder {
            this.multiStep = value
            return this
        }

        public build(): RandomFactory {
            return new RandomFactory(this.maxAddSub, this.minAddSub, this.maxMulti,
                this.maxDiv, this.allowNums, this.allowOpers, this.multiStep)
        }
    }
}