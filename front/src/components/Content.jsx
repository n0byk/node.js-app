import React from 'react';
import userActions from '../actions/user';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class Content extends React.Component {
    constructor(props) {
        super(props);
        this.loginInput = React.createRef();
    }
    makeTextInputFocused() {
        this.loginInput.current.focus();
    }

    componentDidMount() {
        this.makeTextInputFocused();
    }

    render() {
        return (
            <main>
                {/*<Sidebar components={this.props.children}/>*/}
                <p>Контент сайта</p>
                <p className={this.props.isLoggedIn ? 'yes' : 'no'}>Пользователь залогинен: {this.props.isLoggedIn ? 'да' : 'нет'}</p>
                <input
                    ref={this.loginInput}
                    type="text"
                    placeholder="Ваш логин"
                    onChange={e => {
                        console.log('REDUX', 'в обработчике onChange');
                        this.props.actions.saveUserInputValue(e.target.value);
                    }}
                />
                <button onClick={() => this.props.actions.onLogin()}>{this.props.isLoggedIn ? 'Выйти' : 'Войти'}</button>
                {
                    this.props.isLoggedIn && <div>Эта страница только для зарегистрированных пользователей</div>
                }
            </main>
        );
    }
}

const mapStateToProps = state => {
    return {
        ...state.user,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(userActions, dispatch)
    };
};

const Wrapped =
    connect(mapStateToProps, mapDispatchToProps)(Content);

export default Wrapped;
