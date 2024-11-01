import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface SelectedOption {
  name: string;
  price: number;
}

export interface CartItem {
  quantity: number;
  dishId: string;
  detail: {
    dishName: string;
    price: number;
    thumbImage: string;
  };
  selectedOptions: {
    [key: string]: SelectedOption | string;
  };
  isRadio?: boolean;
  isSize?: boolean;
  availableQuantity: number;
}

export interface OrderState {
  carts: CartItem[];
  status: 'success' | 'error' | null;
  error: string | null;
}

export interface AddToCartResponse {
  status: 'success' | 'error';
  error?: string;
}

const initialState: OrderState = {
  carts: [],
  status: null,
  error: null,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    doAddProductAction: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;

      const totalQuantity = state.carts.reduce((total, cartItem) => {
        if (cartItem.dishId === item.dishId) {
          return total + cartItem.quantity;
        }
        return total;
      }, 0);

      if (totalQuantity + item.quantity > item.availableQuantity) {
        state.status = 'error';
        state.error = `Total number of products in cart (${totalQuantity}) and the quantity you want to add (${item.quantity}) vượt quá số lượng có sẵn (${item.availableQuantity}).`;
        return;
      }

      const existingItemIndex = state.carts.findIndex(
        (c) =>
          c.dishId === item.dishId &&
          JSON.stringify(c.selectedOptions) ===
            JSON.stringify(item.selectedOptions)
      );

      if (existingItemIndex > -1) {
        state.carts[existingItemIndex].quantity += item.quantity;
      } else {
        state.carts.push(item);
      }

      state.status = 'success';
      state.error = null;
    },

    doRemoveProductAction: (
      state,
      action: PayloadAction<{
        dishId: string;
        selectedOptions: CartItem['selectedOptions'];
      }>
    ) => {
      const { dishId, selectedOptions } = action.payload;
      state.carts = state.carts.filter(
        (item) =>
          !(
            item.dishId === dishId &&
            JSON.stringify(item.selectedOptions) ===
              JSON.stringify(selectedOptions)
          )
      );
    },

    doUpdateQuantityAction: (
      state,
      action: PayloadAction<{
        dishId: string;
        selectedOptions: CartItem['selectedOptions'];
        quantity: number;
      }>
    ) => {
      const { dishId, selectedOptions, quantity } = action.payload;
      const itemIndex = state.carts.findIndex(
        (item) =>
          item.dishId === dishId &&
          JSON.stringify(item.selectedOptions) ===
            JSON.stringify(selectedOptions)
      );

      if (itemIndex !== -1) {
        const item = state.carts[itemIndex];
        if (quantity <= item.availableQuantity) {
          if (quantity > 0) {
            state.carts[itemIndex].quantity = quantity;
            state.status = 'success';
            state.error = null;
          } else {
            state.carts.splice(itemIndex, 1);
            state.status = 'success';
            state.error = null;
          }
        } else {
          state.status = 'error';
          state.error = `Cannot update quantity. The maximum available quantity is ${item.availableQuantity}`;
        }
      }
    },

    doClearCartAction: (state) => {
      state.carts = [];
      state.status = null;
      state.error = null;
    },

    resetStatus: (state) => {
      state.status = null;
      state.error = null;
    },
  },
});

export const {
  doAddProductAction,
  doRemoveProductAction,
  doUpdateQuantityAction,
  doClearCartAction,
  resetStatus,
} = orderSlice.actions;

export default orderSlice.reducer;
