import React from 'react';
import classes from './Modal.module.sass';
import Backdrop from '../Backdrop/Backdrop'

const modal = ({children, show, modalClosed}) => (
    <>
        <Backdrop show={show} clicked={modalClosed}/>
        <div
            className={classes.Modal}
            style={{
                transform: show ? 'translateY(0)' : 'translateY(-100vh)',
                opacity: show ? '1' : '0'
            }}
        >
            {children}
        </div>
    </>
);

export default modal;