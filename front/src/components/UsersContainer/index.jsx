import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import UsersList from '../UsersList';
import actions from '../../actions/user';

import User from '../User';

import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import './usersList.css';

class UsersContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.actions.fetchUsers();
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route
                        path={'/users'}
                        exact
                        render={() => {
                            return <UsersList {...this.props} />
                        }}
                    />
                    <Route
                        path={'/users/:userId'}
                        exact
                        render={(props) => {
                            console.log('!!!!!', props);
                            const userId = +props.match.params.userId;
                            const selectedUser = this.props.users.find(user => user.id === userId);
                            if (selectedUser) {
                                return <User
                                    {...selectedUser}
                                />;
                            } else {
                                return <Redirect to={'/'} />
                            }
                        }}
                    />
                </Switch>
            </Router>
        )
    }
}

const mapStateToProps = state => {
    return {
        ...state.user
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersContainer);
