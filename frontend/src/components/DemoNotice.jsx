import React, { useState } from 'react'

const DemoNotice = () => {

    const [showNotice, setShowNotice] = useState(true)


    // =========================================
    // CLOSE NOTICE
    // =========================================

    const handleClose = () => {

        setShowNotice(false)

    }


    // =========================================
    // HIDE NOTICE
    // =========================================

    if (!showNotice) {

        return null

    }


    // =========================================
    // RENDER
    // =========================================

    return (

        <div
            className="demo-notice"
            role="status"
        >

            <div className="demo-notice__content">

                <span
                    className="demo-notice__icon"
                    aria-hidden="true"
                >
                    !
                </span>


                <div className="demo-notice__text">

                    <strong>
                        Demo Environment
                    </strong>

                    <span>
                        The first request may take a little longer
                        if the server has been inactive.
                    </span>

                </div>

            </div>


            <button
                type="button"
                className="demo-notice__close"
                onClick={handleClose}
                aria-label="Dismiss demo notice"
            >
                ×
            </button>

        </div>

    )

}

export default DemoNotice