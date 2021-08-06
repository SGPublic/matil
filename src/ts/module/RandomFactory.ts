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
        let num1: FormulaNum = this.randomSingleNum(oper)
        const allowNums: Array<NumberType> = [Formula.NUM_NORMAL]
        if (num1.isDecimal()){
            allowNums.push(Formula.NUM_DECIMAL)
        } else if (num1.isFraction()) {
            allowNums.push(Formula.NUM_FRACTION)
        }
        let num2: FormulaNum
        if (oper === Formula.OPER_DIV){
            if (num1.isFraction() && Math.random() < 0.5){
                num1 = NormalNum.rand(this.maxDiv, 1)
                num2 = FractionNum.create(
                    NormalNum.rand(this.maxDiv, 1).getNumerator() * num1.getNumerator(),
                    NormalNum.rand(this.maxDiv, 1).getNumerator()
                )
            } else {
                num2 = num1.times(NormalNum.rand(this.maxDiv, 1))
            }
        } else if (num1.isFraction()) {
            num2 = FractionNum.create(this.randomSingleNum(
                oper, [Formula.NUM_NORMAL]
            ).getNumerator(), num1.getDenominator())
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

    private randomMulti(): Formula {
        let allowOper: Set<FormulasOperator> = new Set<FormulasOperator>(this.allowOperators)
        let result: Formula = this.randomSimple()
        switch (result.getOperator()) {
            case Formula.OPER_ADD:
            case Formula.OPER_SUB:
                allowOper.delete(Formula.OPER_MULTI)
                allowOper.delete(Formula.OPER_DIV)
        }
        let allowNum: Set<NumberType> = new Set<NumberType>(this.allowNums)
        if (result.hasFraction()){
            allowNum.delete(Formula.NUM_DECIMAL)
        } else if (result.hasDecimal()) {
            allowNum.delete(Formula.NUM_FRACTION)
        }
        const oper2: FormulasOperator = this.randomOperator(Array.from(allowOper))
        let num3: FormulaNum
        if (result.hasFraction()){
            num3 = FractionNum.create(this.randomSingleNum(
                oper2, [Formula.NUM_NORMAL]
            ).getDenominator(), result.getDenominator()!)
        } else {
            num3 = this.randomSingleNum(oper2, Array.from(allowNum))
        }
        switch (true){
            case oper2 === Formula.OPER_DIV:
            case result.getOperator() === Formula.OPER_DIV:
                result = this.randomTripleDiv()
                break
            case Math.random() < 0.5:
                result.unshift(num3, oper2)
                break
            default:
                result.push(oper2, num3)
        }
        return result
    }

    private randomTripleDiv(): Formula {
        let nums: Array<FormulaNum> = [
            NormalNum.rand(this.maxDiv, 1)
        ]
        nums.unshift(nums[0].times(NormalNum.rand(this.maxDiv, 1)))
        nums.unshift(nums[0].times(NormalNum.rand(this.maxDiv, 1)))
        const random: Array<string> = Math.round(Math.random() * 6)
            .toString(2).split("")
        const den: NormalNum = NormalNum.rand(this.maxDiv, 1)
        for (let i = 0; i < random.length; i++) {
            if (random[i] !== "1"){
                continue
            }
            nums[i] = FractionNum.create(nums[i].getNumerator(), den.getNumerator())
        }
        return new Formula(nums[0])
            .push(Formula.OPER_DIV, nums[1])
            .push(Formula.OPER_DIV, nums[2])
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