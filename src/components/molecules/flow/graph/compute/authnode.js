import { computeVariables } from './utils';

export const computeAuthNode = (auth, envVariables) => {
  if (auth.type === 'basic-auth') {
    auth.username = computeVariables(auth.username, envVariables);
    auth.password = computeVariables(auth.password, envVariables);

    return auth;
  } else if (auth.type === 'no-auth') {
    return auth;
  } else {
    throw Error(`auth type: ${auth.type} is not valid`);
  }
};
