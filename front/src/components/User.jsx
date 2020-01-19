import React from 'react';
import { Link } from 'react-router-dom';

export default function User(props) {
    return (
        <div>
            <p>{props.name}</p>
            <div>
                Контакты
                <p>{props.email}</p>
                <p>{props.phone}</p>
            </div>
        </div>
    )
}
