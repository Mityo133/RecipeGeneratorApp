"use client"
import {useState} from 'react'
import { Registration } from '@/app/interfaces/utilities/fetching';
import {redirect, RedirectType} from "next/navigation"
export interface UserRegistration{
    "email":string,
    "password":string
};

export default function Register(){
    const[form,SetForm] = useState<UserRegistration | null>(null);
    const[email,setEmail] = useState("");
    const[password,SetPassword] = useState("");
    const[show,SetShow] = useState(true);
    return <>
    <form onSubmit={async (e) => {
    e.preventDefault();
    SetShow(false);
    const user: UserRegistration = {
        email,
        password
    };

    SetForm(user);
    await Registration(user.email,user.password);
    console.log(user);
    redirect("/components/login",RedirectType.push);
}}>
            <label>Email: </label><input  value={email} onChange={(e)=>setEmail(e.target.value)}></input><br></br>
            <label>Password: </label><input type="password" value={password} onChange={(e)=>SetPassword(e.target.value)}></input><br></br>
            <button type="submit" 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" >Submit</button>
        </form>
            {show ?(<h1>You have not registered</h1>):(form !== null?(<h3>Email {form?.email} Password {form?.password}</h3>):(<h3>There is no user.</h3>))}
    </>

} 
