import React, { useState } from 'react';
import { RingLoader } from "react-spinners";
import { css } from "styled-components"; // Import css từ styled-components

function Loader() {
    const [loading, setLoading] = useState(true);
    const [color, setColor] = useState("#ffffff");

    const override = css` // Sử dụng css để tạo kiểu CSS
        display: block;
        margin: 0 auto;
        border-color: red;
    `;

    return (
        <div>
            <div className="sweet-loading text-center">
                <RingLoader
                    color={color} // Sử dụng biến color đã được định nghĩa
                    loading={loading}
                    css={override} // Sử dụng prop css thay vì cssOverride
                    size={80}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
            </div>
        </div>
    )
}

export default Loader;
