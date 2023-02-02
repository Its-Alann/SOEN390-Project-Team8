import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../Firebase/firebase";
import useAuthContext from "../../context/useAuthContext";

const useSignUp = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(null);
  const { dispatch } = useAuthContext();

  const signup = async (email, password, name) => {
    setError(null);
    setIsPending(true);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      console.log(res.user);

      if (!res) {
        throw new Error("Sign up error occured");
      }

      await updateProfile(auth.currentUser, {
        displayName: name,
      });
      dispatch({ type: "LOGIN", payload: res.user });

      setIsPending(false);
      setError(false);
    } catch (err) {
      console.log(err.message);
      setError(err.message);
      setIsPending(false);
    }
  };

  return { error, isPending, signup };
};

export default useSignUp;
