import Link from "next/link";

import SigninWithPassword from "./SigninWithPassword";


type Props = {
    type: "login" | "signUp"
};


export default function AuthForm({ type }: Props) {

  const isLoginForm = type === "login";



  return (
    <>


      <h1 className="mb-4 text-2xl font-bold text-dark dark:text-white sm:text-heading-3">
       Krydha Clothing
              </h1>

      <div>
        <SigninWithPassword type={type} />
      </div>

      <div className="mt-6 text-center">
        <p>
         {isLoginForm ? "Don’t have any account?" : "Already have an account?" } {" "}
          <Link href={isLoginForm ? "/sign-up" : "login"} className="text-primary">
          {isLoginForm ?  "Sign Up" : "Login"} 
          </Link>
        </p>
      </div>
    </>
  );
}
