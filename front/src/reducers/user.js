import {
    USER_INPUT_LOGIN_CHANGED,
    USER_TRY_TO_LOG_IN,
    GET_USERS_SUCCESS,
    GET_USERS_LOADING,
    GET_USERS_FAILED
} from '../constants';

const initialState = {
    userLogin: null,
    activePageId: 0,
    isLoggedIn: false,
    someUsefulData: 'My super-puper useful data',
    pages: [
        { pageId: 0, name: 'Главная', path: '/' },
        { pageId: 1, name: 'Статьи', path: '/articles' },
        { pageId: 2, name: 'Пользователи', path: '/users' },
        { pageId: 3, name: 'Контакты', path: '/about' },
        { pageId: 4, name: 'Search', path: '/search' },
    ],
    users: [],
    isUsersLoading: false,
    errMsg: '',
};

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case USER_INPUT_LOGIN_CHANGED:
            return {
                ...state,
                userLogin: action.value,
            };

        case USER_TRY_TO_LOG_IN:
            const login = state.userLogin;
            return {
                ...state,
                isLoggedIn: login === 'admin',
            };

        case GET_USERS_LOADING:
            return {
                ...state,
                isUsersLoading: true,
            };

        case GET_USERS_SUCCESS:
            return {
                ...state,
                users: action.users,
                isUsersLoading: false,
            };

        case GET_USERS_FAILED:
            return {
                ...state,
                errMsg: action.errMsg,
                isUsersLoading: false,
            };

        default:
            return state;
    }
}
