import React from 'react';

const ContenedorDeTostadas = (props) => {

    return (
        <div aria-live="polite" aria-atomic="true" style={{
            position: 'fixed',
            bottom: 0,
            right: '20px',
            minHeight: '160px',
            zIndex: 99999
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