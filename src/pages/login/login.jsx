import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import InputFieldsRenderer from "../../components/InputFieldsRenderer";
import { getDashboard, loginUser } from "../../utils/api";

function Login() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formObject = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getDashboard(2);
        setConfig(data.document?.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const onSubmit = useCallback(async (data) => {
    try {
      const result = await loginUser({
        username: data.username,
        password: data.password,
      });
      if (result?.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("userId", result.userId);
        window.location.href = "/dashboard";
      }
      console.log("Login success:", result);
    } catch (err) {
      console.error("Login error:", err);
      alert(err.message || "Login failed");
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 text-sm">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-500 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-sm text-gray-500">Sign in to your account</p>
        </div>

        <FormProvider {...formObject}>
          <form onSubmit={formObject.handleSubmit(onSubmit)}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {config && <InputFieldsRenderer configs={config} />}
            </div>

            <button
              type="submit"
              className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
            >
              Sign In
            </button>
          </form>
        </FormProvider>

        <p className="text-center text-sm text-gray-500 mt-6">
          Dont have an account?{" "}
          <a href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
