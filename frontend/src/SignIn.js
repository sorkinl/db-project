import React from "react";

const SignIn = ({ handleOnChange, inputValues, signIn, signUp }) => {
  return (
    <div>
      <input
        autocomplete="off"
        name="username"
        placeholder="Username"
        onChange={handleOnChange}
        value={inputValues.username}
      ></input>
      <input
        name="password"
        type="password"
        placeholder="password"
        onChange={handleOnChange}
        value={inputValues.password}
      ></input>
      <button onClick={() => signIn()}>Sign In</button>
      <button onClick={() => signUp()}>Sign Up</button>
    </div>
  );
};

export default SignIn;
