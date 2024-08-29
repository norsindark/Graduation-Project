import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Role {
    id: string;
    name: string;
}

interface UserState {
    email: string;
    fullName: string;
    role: Role;
    avatar: string;
    id: string;
    status: string;
    addresses: any[];
}

interface AccountState {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: UserState | null;
}

const initialState: AccountState = {
    isAuthenticated: false,
    isLoading: false,
    user: null,
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
        doGetAccountAction: (state, action: PayloadAction<UserState>) => {
            state.isAuthenticated = true;
            state.isLoading = false;
            state.user = action.payload;
        },
        doLogoutAction: (state) => {
            localStorage.removeItem('accessToken');
            state.isAuthenticated = false;
            state.isLoading = false;
            state.user = null; // Reset user state to `null`
        },
    },
});

export const {
    doLoginAction,
    doGetAccountAction,
    doLogoutAction,
} = accountSlice.actions;

export default accountSlice.reducer;
