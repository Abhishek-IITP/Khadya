"use client"

import { useRouter } from 'next/navigation';
import { useState } from 'react'
import { logOutAction } from '../action/user';
import { LogOutIcon } from './icons';
import { showErrorToast, showSuccessToast, showWarningToast } from '../lib/toast-utils';


function LogOutButton() {
const router = useRouter();
const [loading, setLoading] = useState(false);


const handleLogout = async () => {
setLoading(true);


const {errorMessage} = await logOutAction();

if(!errorMessage) {

// toast.success();
showSuccessToast('You have successfully logged out!')
console.log("Logged out successfully");
router.push("/login");
}else{

    showErrorToast('Logged out unscucessfully!' + " - " + errorMessage );
// toast.error("Logged out unscuccessfull. Try again later!", {description : errorMessage} );
console.log("Logged out unscuccessfull",errorMessage );
}

setLoading(false);
    console.log("Logging out");
};

  return  <button
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
            onClick={handleLogout}
          >
            <LogOutIcon />
            <span className="text-base font-medium">{loading ? "Signing out..." : "Log out"}</span>
          </button>
  
  
//   <Button variant="outline"
// disabled={loading}
// className='w-24'

//   onClick={handleLogout}
//   > {loading ? <Loader2 className='animate-spin'/> : "Log Out"}</Button>
}

export default LogOutButton