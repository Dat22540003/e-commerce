import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: false,
    current: "",
    token: "",
  },
  reducers: {
    register: (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.current = action.payload.userData;
      state.token = action.payload.token;
    },
  },
  //   extraReducers: (builder) => {
  //     builder.addCase(getNewProducts.pending, (state) => {
  //       state.isLoading = true;
  //     });

  //     builder.addCase(getNewProducts.fulfilled, (state, action) => {
  //       state.isLoading = false;
  //       state.newProducts = action.payload;
  //     });

  //     builder.addCase(getNewProducts.rejected, (state, action) => {
  //       state.isLoading = false;
  //       state.errorMessage = action.payload.message;
  //     });
  //   },
});

export const {register} = userSlice.actions;
export default userSlice.reducer;
