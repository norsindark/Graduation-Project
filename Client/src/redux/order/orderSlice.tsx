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
}

interface OrderState {
  carts: CartItem[];
}

const initialState: OrderState = {
  carts: [],
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    doAddProductAction: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;
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
        if (quantity > 0) {
          state.carts[itemIndex].quantity = quantity;
        } else {
          state.carts.splice(itemIndex, 1);
        }
      }
    },

    doClearCartAction: (state) => {
      state.carts = [];
    },
  },
});

export const {
  doAddProductAction,
  doRemoveProductAction,
  doUpdateQuantityAction,
  doClearCartAction,
} = orderSlice.actions;

export default orderSlice.reducer;
