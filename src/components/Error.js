import React from 'react'

function Error({message}) {
    return (
        <div>
            <div class="alert alert-danger" role="alert" style={{margin: '0px'}}>
                {message}
            </div>
        </div>
    )
}

export default Error
