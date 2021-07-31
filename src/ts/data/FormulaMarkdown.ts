import {FormulaNum} from "./FormulaNum";
import {FormulasOperator} from "./Formula";

export class FormulaMarkdown {
    private markdown: string

    private length: number = 1

    constructor(num1: FormulaNum) {
        this.markdown = num1.toString()
    }

    public size(): number {
        return this.length
    }

    public append(operator: FormulasOperator, num2: FormulaNum): FormulaMarkdown {
        this.markdown = this.markdown.concat(" ")
            .concat(operator.toString(), " ")
            .concat(num2.toString())
        this.length += 1
        return this
    }

    public toString(): string {
        return this.markdown
    }
}