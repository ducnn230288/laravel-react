export enum EStatusGlobal {
  idle = 'idle',
  logoutFulfilled = 'logout.fulfilled',
  profilePending = 'profile.pending',
  profileFulfilled = 'profile.fulfilled',
  profileRejected = 'profile.rejected',
  putProfilePending = 'putProfile.pending',
  putProfileFulfilled = 'putProfile.fulfilled',
  putProfileRejected = 'putProfile.rejected',
  loginPending = 'login.pending',
  loginFulfilled = 'login.fulfilled',
  loginRejected = 'login.rejected',
  forgottenPasswordPending = 'forgottenPassword.pending',
  forgottenPasswordFulfilled = 'forgottenPassword.fulfilled',
  forgottenPasswordRejected = 'forgottenPassword.rejected',
  otpConfirmationPending = 'otpConfirmation.pending',
  otpConfirmationFulfilled = 'otpConfirmation.fulfilled',
  otpConfirmationRejected = 'otpConfirmation.rejected',
  resetPasswordPending = 'resetPassword.pending',
  resetPasswordFulfilled = 'resetPassword.fulfilled',
  resetPasswordRejected = 'resetPassword.rejected',
}
