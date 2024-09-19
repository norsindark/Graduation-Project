import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Role {
  id: string;
  name: string;
}

interface Address {
  street: string;
  country: string;
  city: string;
  postalCode: number;
  addressType: string;
  state: string;
  phoneNumber: string;
  email: string;
  userId: string;
}
interface UserState {
  email: string;
  fullName: string;
  role: Role;
  avatar: string;
  id: string;
  status: string;
  addresses: Address[];
}

interface AccountState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserState | null;
}

const initialState: AccountState = {
  isAuthenticated: false,
  isLoading: true, // Initial load shows loading until user is fetched
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
    doLogoutAction: (state) => {
      localStorage.removeItem('accessToken');
      state.isAuthenticated = false;
      state.isLoading = false;
      state.user = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<UserState>>) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
    },
  },
});

export const { doLoginAction, doLogoutAction, setLoading, updateUser } =
  accountSlice.actions;

export default accountSlice.reducer;
