export const formatAuthError = (err: { message: string }) =>
  err?.message.replaceAll(/[-,(,),.]/g, ' ').split('auth/')[1]
