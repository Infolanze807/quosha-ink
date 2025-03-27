import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import authService from "./authService";
import { Forgot, Login, ResetPassword } from "../../types/auth";
import { Register } from "../../types/register";
import { STATUS } from "../../constants/Status";
import toast from 'react-hot-toast';

interface AuthState {
  user: Register | null;
  token: string;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  status: string;
}

const initialState: AuthState = {
  user: null,
  token: "",
  isError: false,
  isSuccess: false,
  isLoading: false,
  status: "",
};

export const register = createAsyncThunk(
  "auth/register",
  async (userData: Register, thunkAPI) => {
    try {
      const response = await authService.register(userData);
      // toast.success(response.message);
      return response;
    } catch (error: any) {
      toast.error( (error.response?.data?.message || error.message));
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getUser = createAsyncThunk(
  "auth/user",
  async (userData: string, thunkAPI) => {
    try {
      const response = await authService.getUser(userData);
      // toast.success(response.message);
      return response.user;
    } catch (error: any) {
      toast.error( (error.response?.data?.message || error.message));
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
interface UpdateUserPayload {
  userDetails: any; // Replace with actual type
  userId: any; // Replace with actual type
}
export const updateUser = createAsyncThunk(
  "auth/updateUser",
    async ({ userId, userDetails }: UpdateUserPayload, thunkAPI) => {
    try {
      const response = await authService.updateUser(userId, userDetails);
      toast.success(response.message);
      return response;

    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (user: Login, thunkAPI) => {
    try {
      const response = await authService.login(user);
      toast.success(response.message);
      // console.log("response",response);
      return response;
    } catch (error: any) {
      toast.error((error.response?.data?.message || error.message));
      // console.log("error", error)
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const forgot = createAsyncThunk(
  "auth/passwordReset",
  async (forgot: Forgot, thunkAPI) => {
    try {
      const response = await authService.forgot(forgot);
      toast.success(response.message);
      // console.log("response",response);
      return response;
    } catch (error: any) {
      toast.error((error.response?.data?.message || error.message));
      // console.log("error", error)
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const resetpassword = createAsyncThunk(
  "auth/resetpassword/",
  async ({ userId, token, resetpassword }: { userId: string; token: string; resetpassword: ResetPassword }, thunkAPI) => {
    try {
      const response = await authService.resetpassword(userId, token, resetpassword);
      toast.success(response.message);
      return response;
    } catch (error: any) {
      toast.error((error.response?.data?.message || error.message));
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const verifyemail = createAsyncThunk(
  "auth/verify/",
  async ({ userId, token }: { userId: string; token: string }, thunkAPI) => {
    try {
      const response = await authService.verifyemail(userId, token);
      toast.success(response.message);
      return response;
    } catch (error: any) {
      toast.error((error.response?.data?.message || error.message));
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export const logout = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      const response = await authService.logout();
      toast.success('Logout successful!');
      return response;
    } catch (error: any) {
      toast.error('Logout failed. ' + (error.response?.data?.message || error.message));
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authReset: (state) => {
      state.user = null;
      state.token = "";
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.status = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.status = STATUS.LOADING;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<Register>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.status = STATUS.IDLE;
      })
      .addCase(register.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.status = STATUS.ERROR;
        state.user = null;
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.status = STATUS.LOADING;
      })
      .addCase(getUser.fulfilled, (state, action: PayloadAction<Register | null>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.status = STATUS.IDLE;
      })
      .addCase(getUser.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.status = STATUS.ERROR;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.status = STATUS.LOADING;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<Register>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload; // Assuming `action.payload` is of type `Register`
        state.status = STATUS.IDLE;
      })
      .addCase(updateUser.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.status = STATUS.ERROR;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.status = STATUS.LOADING;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.token = action.payload;
        state.status = STATUS.IDLE;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.status = STATUS.ERROR;
      })
      .addCase(forgot.pending, (state) => {
        state.isLoading = true;
        state.status = STATUS.LOADING;
      })
      .addCase(forgot.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.token = action.payload;
        state.status = STATUS.IDLE;
      })
      .addCase(forgot.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.status = STATUS.ERROR;
      })
      .addCase(resetpassword.pending, (state) => {
        state.isLoading = true;
        state.status = STATUS.LOADING;
      })
      .addCase(resetpassword.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.token = action.payload;
        state.status = STATUS.IDLE;
      })
      .addCase(resetpassword.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.status = STATUS.ERROR;
      })
      .addCase(verifyemail.pending, (state) => {
        state.isLoading = true;
        state.status = STATUS.LOADING;
      })
      .addCase(verifyemail.fulfilled, (state, action: PayloadAction<{ userId: string, token: string, name:string }>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.token = action.payload.token;
        localStorage.setItem('userId', action.payload.userId);
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem("Name", action.payload.name);
        state.status = STATUS.IDLE;

      })
      .addCase(verifyemail.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.status = STATUS.ERROR;
      })
      // .addCase(getUser.pending, (state) => {
      //   state.isLoading = true;
      //   state.status = STATUS.LOADING;
      // })
      // .addCase(getUser.fulfilled, (state, action: PayloadAction<Register>) => {
      //   state.isLoading = false;
      //   state.isSuccess = true;
      //   state.user = action.payload;
      //   state.status = STATUS.IDLE;
      // })
      // .addCase(getUser.rejected, (state, action: PayloadAction<string>) => {
      //   state.isLoading = false;
      //   state.isError = true;
      //   state.status = STATUS.ERROR;
      //   state.user = null;
      // })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.status = STATUS.LOADING;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = null;
        state.token = "";
        state.status = STATUS.IDLE;
      })
      .addCase(logout.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.status = STATUS.ERROR;
      });
  },
});

export const { authReset } = authSlice.actions;
export default authSlice.reducer;
