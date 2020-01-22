import * as c from '../constants';
import axios from 'axios';

const generalActions = {
    changeInputSearch(value) {

        return {
            value,
            type: c.SEARCH_INPUT_CHANGE
        }
    },
    makeSearch() {
        return async (dispatch, getStore) => {
            const store = getStore();
            dispatch({
                type: c.SEARCH_LOADER
            });

            try {
                const response = await axios.post(`http://127.0.0.1:7000/search?query=${store.general.searchValue}&where=p_body`);

                console.log(response);
                dispatch({
                    type: c.MAKE_SEARCH_SUCCESS,
                    search: response.data
                });
            } catch (e) {
                dispatch({
                    type: c.MAKE_SEARCH_FAILED,
                    errMsg: e.message
                });
            }
        };
    },

};



export default generalActions;
