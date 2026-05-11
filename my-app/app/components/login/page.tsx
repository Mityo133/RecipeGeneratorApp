'use client'

import { useState } from "react";
import { LoginUser } from "@/app/interfaces/utilities/fetching";

export default function Login() {
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");

        return (
                <div>
                        <label>Email</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} />

                        <label>Password</label>
                        <input
                                value={password}
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                        />

                        <button
                                onClick={async () => {
                                        const res = await LoginUser(email, password);

                                        console.log(res.message);

                                        if (res.err) {
                                                console.log("Login failed");
                                                return;
                                        }

                                        console.log("User:", res.data.user);
                                        console.log("Session:", res.data.session);
                                }}
                        >
                                Login
                        </button>
                </div>
        );
}