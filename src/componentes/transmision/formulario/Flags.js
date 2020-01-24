import React from 'react'
import { Form, Row, Col, Button } from 'react-bootstrap'
import { MdAirplanemodeActive } from 'react-icons/md'
import { GiMedicines } from 'react-icons/gi'
import Icono from 'componentes/icono/Icono'



const Flags = (props) => {


    return (
        <Form.Group as={Row} className="align-items-center">
            <Form.Label column md="4">
                Flags
                {/*(estado && estado.length > 0) && <Icono icono={FaLongArrowAltRight} class="float-left float-md-right mr-3 mr-md-0 text-success" />*/}
            </Form.Label>
            <Col md="8" >
                <Button size="sm" variant="outline-primary" className="py-0 pl-1 pr-2 mr-1"><Icono icono={MdAirplanemodeActive} posicion={[20, 2]} className="mr-1" />Transfer</Button>
                <Button size="sm" variant="outline-success" className="py-0 pl-1 pr-2 mr-1"><Icono icono={GiMedicines} posicion={[20, 2]} className="mr-1" />Estupe</Button>
            </Col>
            {/*<Form.Label column className="text-danger px-3 pt-0 mt-0">
                
            </Form.Label>*/}
        </Form.Group>
    )
}

export default Flags