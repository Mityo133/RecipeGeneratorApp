'use client'
import {redirect, RedirectType} from "next/navigation";
import { useState } from "react";
import { LoginUser } from "@/app/interfaces/utilities/fetching";
import Link from "next/link";

export default function Login() {
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");

        return (
                <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900/30 to-purple-900/30 p-4">
                        <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-700">
                                <h2 className="mb-6 text-center text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                                        Welcome Back
                                </h2>

                                <div className="space-y-6">
                                        <div className="group relative">
                                                <label
                                                        htmlFor="email"
                                                        className="block text-sm font-medium text-gray-300 mb-2"
                                                >
                                                        Email
                                                </label>
                                                <input
                                                        id="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        type="email"
                                                        className="w-full rounded-lg border border-gray-600 bg-gray-900/50 px-4 py-3 text-white outline-none transition-all focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 placeholder:text-gray-500"
                                                        placeholder="Enter email address"
                                                />
                                        </div>

                                        <div className="group relative">
                                                <label
                                                        htmlFor="password"
                                                        className="block text-sm font-medium text-gray-300 mb-2"
                                                >
                                                        Password
                                                </label>
                                                <input
                                                        id="password"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        type="password"
                                                        className="w-full rounded-lg border border-gray-600 bg-gray-900/50 px-4 py-3 text-white outline-none transition-all focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 placeholder:text-gray-500"
                                                        placeholder="Enter password"
                                                />
                                        </div>

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
                                                        redirect("/",RedirectType.push);
                                                }}
                                                className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-purple-500 hover:to-indigo-600 hover:scale-[1.02] hover:shadow-cyan-500/25 focus:ring-2 focus:ring-cyan-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                                type="button"
                                        >
                                                Login
                                        </button>
                                </div>

                                <div className="mt-6 text-center">
                                        <p className="text-gray-400">
                                                Don't have an account?{" "}
                                                <Link
                                                        href="/components/register"
                                                        className="text-cyan-400 hover:text-cyan-300 underline transition-all"
                                                >
                                                        Register
                                                </Link>
                                        </p>
                                </div>
                        </div>
                </div>
        );
}
