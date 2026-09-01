import React, { useState } from 'react'

const DemoAlert = () => {

    const [showAlert, setShowAlert] = useState(true)


    // =====================================================
    // CLOSE ALERT
    // =====================================================

    const handleClose = () => {

        setShowAlert(false)

    }


    // =====================================================
    // HIDE ALERT
    // =====================================================

    if (!showAlert) {

        return null

    }


    // =====================================================
    // ALERT
    // =====================================================

    return (

        <div
            style={{
                position: 'fixed',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                backgroundColor: 'rgba(0, 0, 0, 0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                zIndex: '9999'
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-alert-title"
        >

            <div
                style={{
                    width: '100%',
                    maxWidth: '450px',
                    backgroundColor: '#ffffff',
                    borderRadius: '18px',
                    padding: '30px',
                    boxSizing: 'border-box',
                    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.18)',
                    textAlign: 'center'
                }}
            >

                {/* =========================================
                    ICON
                ========================================= */}

                <div
                    style={{
                        width: '52px',
                        height: '52px',
                        margin: '0 auto 18px',
                        borderRadius: '50%',
                        backgroundColor: '#fff0f6',
                        color: '#d4145a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '25px',
                        fontWeight: '800'
                    }}
                    aria-hidden="true"
                >
                    !
                </div>


                {/* =========================================
                    TITLE
                ========================================= */}

                <h2
                    id="demo-alert-title"
                    style={{
                        margin: '0 0 12px',
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#333333'
                    }}
                >
                    Demo Notice
                </h2>


                {/* =========================================
                    MESSAGE
                ========================================= */}

                <p
                    style={{
                        margin: '0 0 25px',
                        fontSize: '15px',
                        lineHeight: '1.6',
                        color: '#707070'
                    }}
                >
                    This application is hosted as a demo, so sometimes
                    the backend may take a little longer to respond
                    because it can go into sleep mode after being inactive.
                </p>


                {/* =========================================
                    BUTTON
                ========================================= */}

                <button
                    type="button"
                    onClick={handleClose}
                    style={{
                        width: '100%',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '13px 18px',
                        backgroundColor: '#d4145a',
                        color: '#ffffff',
                        fontSize: '15px',
                        fontWeight: '700',
                        cursor: 'pointer'
                    }}
                >
                    Okay, Got it
                </button>

            </div>

        </div>

    )

}

export default DemoAlert