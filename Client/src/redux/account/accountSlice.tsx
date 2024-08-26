import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    email: string;
    fullName: string;
    role: string;
    avatar: string;
    id: string;
    status: string;
    addresses: [];
}

interface AccountState {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: UserState;
}

const initialState: AccountState = {
    isAuthenticated: false,
    isLoading: true,
    user: {
        email: "",
        fullName: "",
        role: "",
        avatar: "",
        id: "",
        status: "",
        addresses: [],
    }
};

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        doLoginAction: (state, action: PayloadAction<UserState>) => {
            state.isAuthenticated = true;
            state.isLoading = false;
            state.user = action.payload;
        },
        doGetAccountAction: (state, action: PayloadAction<{ user: UserState }>) => {
            state.isAuthenticated = true;
            state.isLoading = false;
            state.user = action.payload.user;
        },
        doLogoutAction: (state) => {
            localStorage.removeItem('access_token');
            state.isAuthenticated = false;
            state.isLoading = false;
            state.user = {
                email: "",
                fullName: "",
                role: "",
                avatar: "",
                id: "",
                status: "",
                addresses: [],
            };
        },
    },
});

export const { doLoginAction, doGetAccountAction, doLogoutAction } = accountSlice.actions;

export default accountSlice.reducer;
