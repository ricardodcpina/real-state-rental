'use client'

import { useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';


export default function LoginForm({ loginUser, createUser, error }) {
    const [hasAccount, setHasAccount] = useState(true)

    const notify = () => toast("Wow, so easy!")

    return (
        <div className="my-8 mx-16 w-[400px] p-4 h-1/3 bg-gradient-to-r from-zinc-300 to-zinc-200 rounded-lg font-bold text-slate-950">
            <form className="flex flex-col" action={hasAccount ? loginUser : createUser}>
                <div className="flex flex-grow justify-between items-baseline">
                    <h1 className="text-2xl mb-4">{hasAccount ? 'Login' : 'Register Account'}</h1>
                    <input type="button" onClick={() => setHasAccount(!hasAccount)} className="p-2 mr-2 bg-slate-500 hover:bg-slate-400 cursor-pointer rounded" value={hasAccount ? "Sign Up" : "Login"} />
                </div>
                <label htmlFor="username">Username</label>
                <input id="username" name="username" type="text" className="mb-4" />
                {!hasAccount &&
                    <>
                        <label htmlFor="email">E-mail</label>
                        <input id="email" name="email" type="email" className="mb-4" />
                    </>
                }
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" className="mb-4" />
                {!hasAccount &&
                    <>
                        <label htmlFor="confirm-password">Confirm Password</label>
                        <input id="confirm-password" name="confirm-password" type="password" className="mb-4" />
                    </>
                }
                <div className="flex justify-end">
                    <input type="button" className="p-2 mr-2 bg-slate-500 hover:bg-slate-400 cursor-pointer rounded" value="Cancel" />
                    <input type="submit" onClick={notify} className="p-2 bg-slate-500 hover:bg-slate-400 cursor-pointer rounded" value="Submit" />
                     <ToastContainer />
                </div>
            </form>
        </div>
    )
}