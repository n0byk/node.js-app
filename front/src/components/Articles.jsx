import React from 'react';

export default function Articles(props) {
    return (
        <article>
            <h3>{props.title}</h3>
            <p>{props.body}</p>
        </article>
    );
}
