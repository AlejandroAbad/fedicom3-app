import React from 'react';

const ContenedorDeTostadas = (props) => {

    return (
        <div aria-live="polite" aria-atomic="true" style={{
            position: 'fixed',
            top: '80px',
            right: '10px',
            minHeight: '200px',

        }}
        >
            <div style={{
                position: 'absolute', 
                top: 0, 
                right: 0,
            }}
            >
                {props.children}
            </div>
        </div>
    )

}


export default ContenedorDeTostadas;