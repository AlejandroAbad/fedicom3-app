import React, { useEffect } from 'react';
import { Alert } from 'react-bootstrap';

const AlertaDescartable = ({ timeout, ...props }) => {

    const [show, setShow] = React.useState(true);

    useEffect(() => {
        if (timeout)
            setTimeout(() => setShow(false), timeout);
    });

    if (show) {
        return (
            <Alert {...props} onClose={() => setShow(false)} dismissible >
                {props.children}
            </Alert>
        );
    }

    return null;

}


export default AlertaDescartable;
