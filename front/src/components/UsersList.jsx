import React from 'react';
import { Link } from 'react-router-dom';

export default function UsersList(props) {
    return (
        <div>
            <div>Список пользователей сайта</div>
            {props.isLoading && <span>Загрузка...</span>}
            {props.users.map((user, i) => {
                return (
                    <li key={i}>
                        <p>{user.title}</p>
                        <Link to={'/users/' + user.postId}>Перейти в профиль</Link>
                        <div>
                            <span>{user.body}</span>
                            <span>{user.tags}</span>
                        </div>
                    </li>
                );
            })}
        </div>
    )
}
