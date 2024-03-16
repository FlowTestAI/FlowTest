import { computeEnvVariable } from './utils';

const checkIfVariable = (str) => {
  const regex = /\{\{(.+)\}\}/;
  const match = regex.exec(str);
  console.log(str.match(/{{([^}]+)}}/));

  if (match) {
    return str.match(/{{([^}]+)}}/)[1];
  } else {
    return undefined;
  }
};

export const computeAuthNode = (auth, env) => {
  console.log(auth);
  console.log(env);
  if (auth.type === 'basic-auth') {
    const userNameVar = checkIfVariable(auth.username);
    if (userNameVar) {
      auth.username = computeEnvVariable(userNameVar, env);
    }

    const passwordVar = checkIfVariable(auth.password);
    if (passwordVar) {
      auth.password = computeEnvVariable(passwordVar, env);
    }
    return auth;
  } else if (auth.type === 'no-auth') {
    return auth;
  } else {
    throw `auth type: ${auth.type} is not valid`;
  }
};
