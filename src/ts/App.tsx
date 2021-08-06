import '../res/css/App.css';
import React from "react";
import {Button, Card, Checkbox, Col, InputNumber, Row} from "antd";
import ReactToPrint from "react-to-print";
import {Formulas} from "./data/Formulas";
import ContentCreator from "./component/ContentCreator";
import {CheckboxChangeEventTarget} from "antd/lib/checkbox/Checkbox";
import {RandomFactory} from "./module/RandomFactory";
import {NumberType} from "./data/FormulaNum";
import {Formula, FormulasOperator} from "./module/Formula";

class App extends React.Component {
    state = {
        formulas: new Formulas(),

        count: 100,

        minAddSub: 100,
        maxAddSub: 999,
        maxMulti: 100,
        maxDiv: 100,

        allowOpers: new Set<FormulasOperator>(),
        allowNums: new Set<NumberType>(),

        multiStep: false
    }

    private formulasElement: HTMLDivElement|null = null

    componentDidMount() {
        this.state.allowNums.add(Formula.NUM_NORMAL)
        this.state.allowOpers.add(Formula.OPER_ADD)
        this.forceUpdate()
    }

    private createFormulas(){
        const formulas = new Formulas()
        const factory = new RandomFactory.Builder()
            .setMaxAddSub(this.state.maxAddSub)
            .setMinAddSub(this.state.minAddSub)
            .setMaxMulti(this.state.maxMulti)
            .setMaxDiv(this.state.maxDiv)
            .setAllowOpers(Array.from(this.state.allowOpers))
            .setAllowNums(Array.from(this.state.allowNums))
            .isMultiStep(this.state.multiStep)
            .build()
        while (formulas.length < this.state.count){
            formulas.push(factory.random())
        }
        this.setState({
            formulas: formulas
        })
    }

    private extractToWord(){

    }

    private isFormulasEmpty(): boolean {
        return this.state.formulas.length === 0
    }

    render() {
        const thisApp = this
        return (
            <div id={"content"}>
                <h2 className={"center"}>小学数学口算模拟题</h2>
                <Card style={{padding: "0 4ex"}}>
                    <>
                        <Row className={"row-padding"}>
                            <Col span={8} className={"center-left"}>题目数量</Col>
                            <Col span={16} className={"center-left"}>
                                <InputNumber defaultValue={this.state.count as number} bordered={false} onChange={function (value: number) {
                                    if (value === null){
                                        return
                                    }
                                    thisApp.setState({
                                        count: App.checkValue(value)
                                    })
                                }} className={"input-number"} type={"number"}/>
                            </Col>
                        </Row>
                        <Row className={"row-padding"}>
                            <Col span={4} className={"center-left"}>最小数字<br/>(加、减法)</Col>
                            <Col span={8} className={"center-left"}>
                                <InputNumber value={this.state.maxAddSub as number} bordered={false} onChange={function (value: number) {
                                    if (value === null){
                                        return
                                    }
                                    thisApp.setState({
                                        maxAddSub: App.checkValue(value)
                                    })
                                }} className={"input-number"} type={"number"}/>
                            </Col>
                            <Col span={4} className={"center-left"}>最大数字<br/>(加、减法)</Col>
                            <Col span={8} className={"center-left"}>
                                <InputNumber value={this.state.minAddSub as number} bordered={false} onChange={function (value: number) {
                                    if (value === null){
                                        return
                                    }
                                    thisApp.setState({
                                        minAddSub: App.checkValue(value)
                                    })
                                }} className={"input-number"} type={"number"}/>
                            </Col>
                        </Row>
                        <Row className={"row-padding"}>
                            <Col span={4} className={"center-left"}>乘法范围<br/>(乘数/被乘数)</Col>
                            <Col span={8} className={"center-left"}>
                                <InputNumber value={this.state.maxMulti as number} bordered={false} onChange={function (value: number) {
                                    if (value === null){
                                        return
                                    }
                                    thisApp.setState({
                                        maxMulti: App.checkValue(value)
                                    })
                                }} className={"input-number"} type={"number"}/>
                            </Col>
                            <Col span={4} className={"center-left"}>除法范围<br/>(除数/结果)</Col>
                            <Col span={8} className={"center-left"}>
                                <InputNumber value={this.state.maxDiv as number} bordered={false} onChange={function (value: number) {
                                    if (value === null){
                                        return
                                    }
                                    thisApp.setState({
                                        maxDiv: App.checkValue(value)
                                    })
                                }} className={"input-number"} type={"number"}/>
                            </Col>
                        </Row>
                        <Row className={"row-padding"}>
                            <Col span={8} className={"center-left"}>算法</Col>
                            <Col span={16} className={"center-left"}>
                                <Checkbox onChange={function (event) {
                                    thisApp.onChangeOper(event.target, Formula.OPER_ADD)
                                }} checked={this.hasOper(Formula.OPER_ADD)}>加法</Checkbox>
                                <Checkbox onChange={function (event) {
                                    thisApp.onChangeOper(event.target, Formula.OPER_SUB)
                                }} checked={this.hasOper(Formula.OPER_SUB)}>减法</Checkbox>
                                <Checkbox onChange={function (event) {
                                    thisApp.onChangeOper(event.target, Formula.OPER_MULTI)
                                }} checked={this.hasOper(Formula.OPER_MULTI)}>乘法</Checkbox>
                                <Checkbox onChange={function (event) {
                                    thisApp.onChangeOper(event.target, Formula.OPER_DIV)
                                }} checked={this.hasOper(Formula.OPER_DIV)}>除法</Checkbox>
                            </Col>
                        </Row>
                        <Row className={"row-padding"}>
                            <Col span={8} className={"center-left"}>其他</Col>
                            <Col span={16} className={"center-left"}>
                                <Checkbox onChange={function (event) {
                                    thisApp.onChangeNum(event.target, Formula.NUM_DECIMAL)
                                }} checked={this.hasNum(Formula.NUM_DECIMAL)}>允许小数</Checkbox>
                                <Checkbox onChange={function (event) {
                                    thisApp.onChangeNum(event.target, Formula.NUM_FRACTION)
                                }} checked={this.hasNum(Formula.NUM_FRACTION)}>允许分数</Checkbox>
                                <Checkbox onChange={function (event) {
                                    thisApp.setState({
                                        multiStep: event.target.checked
                                    })
                                }} checked={this.state.multiStep} disabled={true}>多步骤</Checkbox>
                            </Col>
                        </Row>
                        <Row style={{padding: "2ex 5ex"}} gutter={48}>
                            <Col span={8} className={"center"}>
                                <Button type={"primary"} block={true} onClick={this.createFormulas.bind(this)}>
                                    生成题目
                                </Button>
                            </Col>
                            <Col span={8} className={"center"}>
                                <Button block={true} disabled={true}
                                        onClick={this.extractToWord.bind(this)}>
                                    导出 Word
                                </Button>
                            </Col>
                            <Col span={8} className={"center"}>
                                <ReactToPrint content={() => this.formulasElement}
                                    trigger={() => <Button block={true} disabled={this.isFormulasEmpty()}>打印文档</Button>}
                                />
                            </Col>
                        </Row>
                    </>
                </Card>
                <div ref={function (el) {thisApp.formulasElement = el}}>
                    <Card id={"table-content"} style={{margin: "3ex 0"}}>
                        <ContentCreator formulas={this.state.formulas} isMultiStep={this.state.multiStep}/>
                    </Card>
                </div>
            </div>
        )
    }

    private onChangeOper(target: CheckboxChangeEventTarget, oper: FormulasOperator){
        if (target.checked){
            this.state.allowOpers.add(oper)
        } else if (this.state.allowOpers.size > 1) {
            this.state.allowOpers.delete(oper)
        }
        this.forceUpdate()
    }

    private onChangeNum(target: CheckboxChangeEventTarget, num: NumberType){
        if (target.checked){
            this.state.allowNums.add(num)
        } else {
            this.state.allowNums.delete(num)
        }
        this.forceUpdate()
    }

    private static checkValue(value: number|null|undefined): number {
        if (value === null || value === undefined){
            return 0
        } else {
            return  value
        }
    }

    private hasOper(oper: FormulasOperator): boolean {
        return this.state.allowOpers.has(oper)
    }

    private hasNum(num: NumberType): boolean {
        return this.state.allowNums.has(num)
    }
}

export default App
