import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as loginRequest } from "../authService";
import { useAuth } from "../context/authContext";



const LoginPage = () => { 

    const [form, setForm] = useState({ email: "", password: "" });
    const navigate = useNavigate();
    const { login } = useAuth();


        const handleChange = (e) => {
            setForm({ ...form, [e.target.name]: e.target.value });
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
            const res = await loginRequest(form);
            login(res);
            navigate("/");
            } catch (err) {
            alert(err.response?.data || "Login failed");
            }
        };

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-blue-600">Sign in to your account</h2>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                    <label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label>
                    <div class="mt-2">
                    <input id="email" type="email" name="email" required autocomplete="email" onChange={handleChange} class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                    </div>
                </div>
                  <div>
                    <div class="flex items-center justify-between">
                    <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
                    
                    </div>
                    <div class="mt-2">
                    <input id="password" type="password" name="password" required autocomplete="current-password"  onChange={handleChange} class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                    </div>
                </div>

                <div>
                    <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
                </div>
                

                <p class="mt-10 text-center text-sm/6 text-gray-500">
                Not a member? 
                <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">Sign up!</Link>
                </p>
             </form>
             </div>
        </div>
       
    )
}

export default LoginPage;