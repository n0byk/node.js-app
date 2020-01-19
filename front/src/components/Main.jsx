import React from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import Content from "./Content";
import UsersList from "./UsersContainer";
import About from "./About";
import Articles from "./Articles";
import SiteSearch from "./SiteSearch";

class Main extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router>
                <Header />

                <Switch>
                    <Route path={this.props.pages[0].path} exact component={Content} />
                    <Route
                        path={this.props.pages[1].path}
                        render={props => {
                            return <Articles title={"some title"} body={"some body"} />;
                        }}
                    />
                    <Route path={this.props.pages[2].path} exact component={UsersList} />
                    <Route path={this.props.pages[3].path} component={About} />
                    <Route path={this.props.pages[4].path} component={SiteSearch} />
                    <Route component={NotFound} />
                </Switch>
                <Footer userLogin={this.props.userLogin} />
            </Router>
        );
    }
}

function NotFound() {
    return <h1>404 Not Found</h1>;
}

const mapStateToProps = state => {
    return {
        pages: state.user.pages,
        userLogin: state.user.userLogin
    };
};

export default connect(mapStateToProps, null)(Main);
            /*
Main
- Header
- Content
- Sidebar
- Article
- ArticleBody
- ArticleComments
- Footer
*/
