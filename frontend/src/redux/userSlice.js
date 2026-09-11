import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",

    initialState: {
        userData: null,
        city:null,
        state:null,
        currentAddress:null,
        shopsInMyCity:null
    },

    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
        },
      setCity: (state, action) => {
            state.city = action.payload;
        },

         setState: (state, action) => {
            state.state = action.payload;
        },

         setCurrentAddress: (state, action) => {
            state.currentAddress = action.payload;
        },
    
          setShopsInMyCity: (state, action) => {
            state.shopsInMyCity = action.payload;
        },


        
    }
});

export const { setUserData,setCity,setState,setCurrentAddress,setShopsInMyCity} = userSlice.actions;

export default userSlice.reducer;