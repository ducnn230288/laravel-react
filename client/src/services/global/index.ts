import { type IResetPassword, type IUser, useAppDispatch, useTypedSelector } from '@/services';
import Action from '@/services/global/action';
import type State from '@/services/global/interface';
import { globalSlice } from '@/services/global/slice';

export const SGlobal = () => {
  const dispatch = useAppDispatch();
  return {
    ...(useTypedSelector(state => state[Action.name]) as State),
    set: (values: State) => dispatch(Action.set(values)),
    logout: () => dispatch(Action.logout()),
    profile: () => dispatch(Action.profile()),
    putProfile: (values: IUser) => dispatch(Action.putProfile(values)),
    login: (values: { password: string; email: string }) => dispatch(Action.login(values)),
    forgottenPassword: (values: { email: string }) => dispatch(Action.forgottenPassword(values)),
    otpConfirmation: (values: { email: string; otp: string }) => dispatch(Action.otpConfirmation(values)),
    resetPassword: (values: IResetPassword) => dispatch(Action.resetPassword(values)),
    setLanguage: (value: string) => dispatch(globalSlice.actions.setLanguage(value)),
  };
};

export * from './enum';
export * from './interface';
export * from './slice';
