import * as c from '../constants';

const initialState = {
    searchValue: "",
    search: [],
};

export default function generalReducer(state = initialState, action) {

    switch (action.type) {
        case c.SEARCH_INPUT_CHANGE:
            return {
                ...state,
                searchValue: action.value
            }

        case c.SEARCH_LOADER:
            return {
                ...state,

            }
        case c.MAKE_SEARCH_SUCCESS:
            return {
                ...state,
                search: action.search

            }
        case c.MAKE_SEARCH_FAILED:
            return {
                ...state,

            }
        default: return state;

    }

};