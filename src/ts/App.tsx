import '../res/css/App.css';
import React from "react";
import {Button, Card, Checkbox, Col, InputNumber, Row} from "antd";
import ReactToPrint from "react-to-print";
import {Formulas} from "./module/Formulas";
import ContentCreator from "./component/ContentCreator";
import {CheckboxChangeEventTarget} from "antd/lib/checkbox/Checkbox";
import {RandomFactory} from "./module/RandomFactory";

class App extends React.Component {
    state = {
        formulas: new Formulas(),
        empty: "",

        QUESTIONS_COUNT: 100,

        MIN_NUM_ADD_SUB: 100,
        MAX_NUM_ADD_SUB: 999,
        MAX_NUM_MULTI: 100,
        MAX_NUM_DIV: 100,

        ADDITION: true,
        SUBTRACTION: false,
        MULTIPLICATION: false,
        DIVISION: false,
        DECIMAL: false,
        FRACTION: false,
        MULTI_STEP: false
    }

    private formulasElement: HTMLDivElement|null = null
    private checkedCount: number = 1

    private createFormulas(){
        const formulas = new Formulas()
        const factory = new RandomFactory.Builder()
            .setMaxAddSub(this.state.MAX_NUM_ADD_SUB)
            .setMinAddSub(this.state.MIN_NUM_ADD_SUB)
            .setMaxMulti(this.state.MAX_NUM_MULTI)
            .setMaxDiv(this.state.MAX_NUM_DIV)
            .isAllowAdd(this.state.ADDITION)
            .isAllowSub(this.state.SUBTRACTION)
            .isAllowMulti(this.state.MULTIPLICATION)
            .isAllowDiv(this.state.DIVISION)
            .isAllowDecimal(this.state.DECIMAL)
            .isAllowFraction(this.state.FRACTION)
            .isMultiStep(this.state.MULTI_STEP)
            .build()
        while (formulas.length < this.state.QUESTIONS_COUNT){
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

    private onCheck(target: CheckboxChangeEventTarget): Boolean {
        if (target.checked){
            this.checkedCount += 1
            return true
        } else if (this.checkedCount === 1){
            return false
        } else {
            this.checkedCount -= 1
            return true
        }
    }

    private static checkValue(value: number|null|undefined): number {
        if (value === null || value === undefined){
            return 0
        } else {
            return  value
        }
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
                                <InputNumber defaultValue={this.state.QUESTIONS_COUNT as number} bordered={false} onChange={function (value) {
                                    thisApp.setState({
                                        QUESTIONS_COUNT: App.checkValue(value)
                                    })
                                }} className={"input-number"}/>
                            </Col>
                        </Row>
                        <Row className={"row-padding"}>
                            <Col span={4} className={"center-left"}>最小数字<br/>(加、减法)</Col>
                            <Col span={8} className={"center-left"}>
                                <InputNumber defaultValue={this.state.MAX_NUM_ADD_SUB as number} bordered={false} onChange={function (value) {
                                    thisApp.setState({
                                        MAX_NUM_ADD_SUB: App.checkValue(value)
                                    })
                                }} className={"input-number"}/>
                            </Col>
                            <Col span={4} className={"center-left"}>最大数字<br/>(加、减法)</Col>
                            <Col span={8} className={"center-left"}>
                                <InputNumber defaultValue={this.state.MIN_NUM_ADD_SUB as number} bordered={false} onChange={function (value) {
                                    thisApp.setState({
                                        MIN_NUM_ADD_SUB: App.checkValue(value)
                                    })
                                }} className={"input-number"}/>
                            </Col>
                        </Row>
                        <Row className={"row-padding"}>
                            <Col span={4} className={"center-left"}>乘法范围<br/>(乘数/被乘数)</Col>
                            <Col span={8} className={"center-left"}>
                                <InputNumber defaultValue={this.state.MAX_NUM_MULTI as number} bordered={false} onChange={function (value) {
                                    thisApp.setState({
                                        MAX_NUM_MULTI: App.checkValue(value)
                                    })
                                }} className={"input-number"}/>
                            </Col>
                            <Col span={4} className={"center-left"}>除法范围<br/>(除数/结果)</Col>
                            <Col span={8} className={"center-left"}>
                                <InputNumber defaultValue={this.state.MAX_NUM_DIV as number} bordered={false} onChange={function (value) {
                                    thisApp.setState({
                                        MAX_NUM_DIV: App.checkValue(value)
                                    })
                                }} className={"input-number"}/>
                            </Col>
                        </Row>
                        <Row className={"row-padding"}>
                            <Col span={8} className={"center-left"}>算法</Col>
                            <Col span={16} className={"center-left"}>
                                <Checkbox onChange={function (event) {
                                    if (!thisApp.onCheck(event.target)){
                                        return
                                    }
                                    thisApp.setState({
                                        ADDITION: event.target.checked
                                    })
                                }} defaultChecked={true} checked={this.state.ADDITION}>加法</Checkbox>
                                <Checkbox onChange={function (event) {
                                    if (!thisApp.onCheck(event.target)){
                                        return
                                    }
                                    thisApp.setState({
                                        SUBTRACTION: event.target.checked
                                    })
                                }} checked={this.state.SUBTRACTION}>减法</Checkbox>
                                <Checkbox onChange={function (event) {
                                    if (!thisApp.onCheck(event.target)){
                                        return
                                    }
                                    thisApp.setState({
                                        MULTIPLICATION: event.target.checked
                                    })
                                }} checked={this.state.MULTIPLICATION}>乘法</Checkbox>
                                <Checkbox onChange={function (event) {
                                    if (!thisApp.onCheck(event.target)){
                                        return
                                    }
                                    thisApp.setState({
                                        DIVISION: event.target.checked
                                    })
                                }} checked={this.state.DIVISION}>除法</Checkbox>
                            </Col>
                        </Row>
                        <Row className={"row-padding"}>
                            <Col span={8} className={"center-left"}>其他</Col>
                            <Col span={16} className={"center-left"}>
                                <Checkbox onChange={function (event) {
                                    thisApp.setState({
                                        DECIMAL: event.target.checked
                                    })
                                }} checked={this.state.DECIMAL}>允许小数</Checkbox>
                                <Checkbox onChange={function (event) {
                                    thisApp.setState({
                                        FRACTION: event.target.checked
                                    })
                                }} checked={this.state.FRACTION}>允许分数</Checkbox>
                                <Checkbox onChange={function (event) {
                                    thisApp.setState({
                                        MULTI_STEP: event.target.checked
                                    })
                                }} checked={this.state.MULTI_STEP} disabled={true}>多步骤</Checkbox>
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
                        <ContentCreator formulas={this.state.formulas} isMultiStep={this.state.MULTI_STEP}/>
                    </Card>
                </div>
            </div>
        )
    }
}

export default App
