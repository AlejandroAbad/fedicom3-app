import React from 'react'
import { ListGroup, Row, Col } from 'react-bootstrap'


const ListGroupItem = ({ k, v, sm, ...props }) => {
    k = k ?? <span>&nbsp;</span>
    if (v || v === 0) {
        return (
            <ListGroup.Item {...props}>
                <Row className="no-gutters">
                    <Col sm={sm ?? 6}><strong>{k}</strong></Col>
                    <Col sm={sm ? 12 - sm : 6} className="text-sm-right ml-3 ml-sm-0">{v}</Col>
                </Row>
            </ListGroup.Item>
        )
    } else {
        return (
            <ListGroup.Item {...props}>
                <Row className="no-gutters">
                    <Col xs={12}>{k}</Col>
                </Row>
            </ListGroup.Item>
        )
    }
}

export default ListGroupItem