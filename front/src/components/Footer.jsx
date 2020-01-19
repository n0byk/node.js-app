import React from 'react';

export default function Footer(props) {
    return (
        <footer>
            <p>Все права защищены 2019 {props.userLogin}</p>
        </footer>
    );
}
