import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import InputFieldsRenderer from "../../components/InputFieldsRenderer";

const FORM_CONFIG_API = "http://localhost:3000/config_master?config_type=SCREENS";
const SUBMIT_API = "http://localhost:3000/config_master/9";

function SignUp() {
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
        const response = await fetch(FORM_CONFIG_API);
        if (!response.ok) throw new Error("Failed to load form configuration");
        const data = await response.json();
        setConfig(data.documents?.[2]?.data);
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
      const response = await fetch(SUBMIT_API, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config_type: "SCREENS", data }),
      });
      if (!response.ok) throw new Error("Sign up failed");
      const result = await response.json();
      console.log("Sign up success:", result);
    } catch (err) {
      console.error("Sign up error:", err);
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
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-sm text-gray-500">Sign up to get started</p>
        </div>

        {/* Form */}
        <FormProvider {...formObject}>
          <form onSubmit={formObject.handleSubmit(onSubmit)}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {config && <InputFieldsRenderer configs={config} />}
            </div>

            <button
              type="submit"
              className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
            >
              Sign Up
            </button>
          </form>
        </FormProvider>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
