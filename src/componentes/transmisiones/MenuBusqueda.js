import React, {useRef} from 'react';
import { DropdownButton, Dropdown, ButtonToolbar, ButtonGroup, Button, Row, Col } from 'react-bootstrap';
import { MdViewHeadline, MdViewStream } from 'react-icons/md';
import { FiFilter } from 'react-icons/fi';
import { FaSortAmountDown } from 'react-icons/fa';

const MenuBusqueda = (props) => {


    return (
        <Row className="border-bottom pt-2 mb-3 no-gutters">
            <Col>
                <ButtonToolbar className="mb-1 border-bottom-1" >
                    <ButtonGroup size="sm" className="ml-auto" >
                        <Button variant="outline-secondary"><MdViewHeadline size={26} className="" /></Button>
                        <Button variant="outline-secondary"><MdViewStream size={26} className="" /></Button>
                    </ButtonGroup>
                    <div class="w-0 mx-1"></div>

                    <ButtonGroup>
                        <Button variant="outline-secondary border-right-0"><FiFilter size={22} /></Button>
                        
                        <DropdownButton variant="outline-secondary" as={ButtonGroup} title={<FaSortAmountDown size={20} style={{paddingBottom: '3px'}} />} id="bg-nested-dropdown">
                            <Dropdown.Item eventKey="1">Dropdown link</Dropdown.Item>
                            <Dropdown.Item eventKey="2">Dropdown link</Dropdown.Item>
                        </DropdownButton>
                    </ButtonGroup>

                </ButtonToolbar >
            </Col>
        </Row >
    );
}

export default MenuBusqueda;