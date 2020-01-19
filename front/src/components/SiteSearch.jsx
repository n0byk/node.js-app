import React from 'react';
import generalActions from '../actions/general';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';




class SiteSearch extends React.Component {
    constructor(props) {
        super(props)
    };
    render() {
        return (
            <div>
                <nav>
                    <input
                        type="text"
                        placeholder="Поиск по сайту"
                        onChange={(e) => { this.props.actions.changeInputSearch(e.target.value) }}
                    />
                    <button
                        onClick={this.props.actions.makeSearch}>
                        Найти
                    </button>
                </nav>

                <div>
                    <div>Поиск</div>
                    {console.log(this.props.search._source)}
                    {this.props.search.map((search, i) => {

                        return (
                            <li key={i}>
                                <p>{search._source.Post_title}</p>
                                <div>
                                    <span>{search._source.Post_body}</span>
                                    <span>{search._source.Post_tags}</span>
                                </div>
                            </li>
                        );
                    })}
                </div>
            </div >


        );
    }
}

//Принимаем редьюсер 
const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(generalActions, dispatch)
    };
};

//принимает стеты которые мы поменяли
const mapStateToProps = state => {
    return {
        ...state.general
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SiteSearch);
