import {Formulas} from "../data/Formulas";
import {Col, Row} from "antd";
import React from "react";
import {MathComponent} from "mathjax-react";

export interface ContentCreatorProps {
    formulas: Formulas,
    isMultiStep: boolean
}

class ContentCreator extends React.Component<ContentCreatorProps, any>{
    render() {
        if (this.props.formulas.length === 0){
            return (<p className={"center"} style={{color: "lightgray"}}>暂无数据</p>)
        }
        let span: number
        if (this.props.isMultiStep){
            span = 3
        } else {
            span = 4
        }
        return (
            <>{
                this.props.formulas.multiMap((rows) => {
                    return (
                        <Row className={"formula-row-padding"}>{
                            rows.map((formula) => {
                                return (
                                    <Col span={24 / span}>
                                        <MathComponent tex={formula.doFinal()}/>
                                    </Col>
                                )
                            })
                        }</Row>
                    )
                }, span)
            }</>
        )
    }
}

export default ContentCreator