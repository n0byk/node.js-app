import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class Header extends React.Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return true;
    }

    render() {
        return (
            <header>
                <h4>Заголовок сайта</h4>
                {
                    this.props.isLoggedIn
                        ?
                        <div>Добро пожаловать, {this.props.userLogin}</div>
                        :
                        <span>Войдите на сайт</span>
                }
                <ul>
                    {
                        this.props.pages.map((obj) => {
                            return (
                                <li key={obj.pageId}>
                                    <Link to={obj.path}>{obj.name}</Link>
                                </li>
                            )
                        })
                    }
                </ul>
            </header>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        pages: state.user.pages,
        userLogin: state.user.userLogin
    };
};

export default connect(mapStateToProps, null)(Header);
