import React, { useEffect } from 'react';
import { Alert } from 'react-bootstrap';

const AlertaDescartable = (props) => {

    const [show, setShow] = React.useState(true);

    
    useEffect( () => {
        if (props.timeout)
            setTimeout(() => setShow(false), props.timeout );
    });

    if (show) {
        return (
            <Alert variant={props.variant || null} onClose={() => setShow(false)} dismissible >
                {props.children}
            </Alert>
        );
    }

    return null;

}


export default AlertaDescartable;
