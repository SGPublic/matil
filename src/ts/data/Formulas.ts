import {Formula} from "../module/Formula";

export class Formulas extends Array<Formula> {
    multiMap<U>(fn: (value: Formula[]) => U, size: number): U[] {
        let result: U[] = Array<U>()
        const currentData: Formula[] = Array<Formula>()
        this.forEach(function (row) {
            currentData.push(row)
            if (currentData.length < size){
                return
            }
            result.push(fn(currentData))
            currentData.length = 0
        })
        if (currentData.length < size){
            result.push(fn(currentData))
        }
        return result
    }
}