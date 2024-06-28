import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const [login, setLogin] = useState({
    email: '',
    password: ''
  })
  const navigate = useNavigate();
  const handleChange = (e) => {
    e.preventDefault();
    setLogin({ ...login, [e.target.name]: e.target.value })
  }
  // const handleLogin = async () => {
  //   try {
  //     const response = await axios.post('${process.env.REACT_APP_API_BASE_URL}/api/login', {
  //       email: login.email,
  //       password: login.password,
  //     });

  //     const token = response.data.token;

  //     localStorage.setItem('token', token);
  //     navigate('/')
  //   } catch (error) {
  //     console.error('Error during login:', error);
  //   }
  // };
  const email = "artibase2brand@gmail.com";
  const password = "Arti@2024#"
  const token = "123456"

  const handleLogin = () => {
    if (email === login.email && password === login.password) {
      localStorage.setItem('email', email);
      localStorage.setItem('password', password);
      localStorage.setItem('token', token);
      navigate("/")
    } else {
      alert("please check amail and password!")
    }
  }
  return (
    <>
      <section class="bg-gray-50 dark:bg-gray-900">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <img class="h-8 my-4" src="https://www.base2brand.com/wp-content/uploads/2021/01/logo-svg-01.png" alt="logo" />
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            INVOICE
          </h1>
          <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <form class="space-y-4 md:space-y-6" onSubmit={handleLogin}>
                <div>
                  <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                  <input type="email" name="email" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-6 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@gmail.com" required="" onChange={handleChange} />
                </div>
                <div>
                  <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                  <input type="password" name="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-6 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" onChange={handleChange} />
                </div>
                {/* <div class="flex items-center justify-between">
                  <div class="flex items-start">
                    <div class="flex items-center h-5">
                      <input id="remember" aria-describedby="remember" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="" />
                    </div>
                    <div class="ml-3 text-sm">
                      <label for="remember" class="text-gray-500 dark:text-gray-300">Remember me</label>
                    </div>
                  </div>
                </div> */}
                <button type="submit" class="primary-background-color w-full text-white   hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                {/* <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet? <Link to="/sign-up" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
                </p> */}
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Login