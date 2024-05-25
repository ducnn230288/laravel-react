import {IUser, ResetPassword, useAppDispatch, useTypedSelector} from "@/services";
import State from "@/services/global/interface";
import action from "@/services/global/action";
import {globalSlice} from "@/services/global/slice";

export const SGlobal = () => {
  const dispatch = useAppDispatch();
  return {
    ...(useTypedSelector((state) => state[action.name]) as State),
    set: (values: State) => dispatch(action.set(values)),
    logout: () => dispatch(action.logout()),
    profile: () => dispatch(action.profile()),
    putProfile: (values: IUser) => dispatch(action.putProfile(values)),
    login: (values: { password: string; email: string }) => dispatch(action.login(values)),
    forgottenPassword: (values: { email: string }) => dispatch(action.forgottenPassword(values)),
    otpConfirmation: (values: { email: string; otp: string }) => dispatch(action.otpConfirmation(values)),
    resetPassword: (values: ResetPassword) => dispatch(action.resetPassword(values)),
    setLanguage: (value: string) => dispatch(globalSlice.actions.setLanguage(value)),
  };
};

export * from './interface';
export * from './slice';
export * from './enum';
