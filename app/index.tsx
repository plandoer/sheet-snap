import Login from "@/components/Login";
import { initGoogleSignIn } from "@/config/google-signin";
import { useEffect } from "react";

export default function Index() {
  useEffect(() => {
    initGoogleSignIn();
  }, []);

  return <Login />;
}
