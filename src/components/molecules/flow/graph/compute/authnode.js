import { computeVariables } from './utils';

export const computeAuthNode = (auth, env) => {
  if (auth.type === 'basic-auth') {
    auth.username = computeVariables(auth.username, env?.variables);
    auth.password = computeVariables(auth.password, env?.variables);

    return auth;
  } else if (auth.type === 'no-auth') {
    return auth;
  } else {
    throw Error(`auth type: ${auth.type} is not valid`);
  }
};
