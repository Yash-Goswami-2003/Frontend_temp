  import { useCallback, useEffect, useState } from "react";
  import InputFieldsRenderer from "../../components/InputFieldsRenderer";
  import { useForm } from "react-hook-form";

  // API endpoint for form configuration
  const FORM_CONFIG_API = "http://localhost:3000/config_master?config_type=SCREENS"; // Update this with actual endpoint

  function SignUp() {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const formObject = useForm() ;


    // Fetch form configuration from API
    useEffect(() => {
      const fetchConfig = async () => {
        try {
          const response = await fetch(FORM_CONFIG_API);
          if (!response.ok) {
            throw new Error("Failed to load form configuration");
          }
          const data = await response.json();
          setConfig(data.documents[0].data); // Handle { fields: [...] } or direct array
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchConfig();
    }, []);

    // Handle form submission
    const onSubmit = useCallback(async (data) => {
      try {
        const payload = {
          config_type : 'SCREENS',
          data : data
        }
        const response = await fetch("http://localhost:3000/config_master/9", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
          throw new Error("Sign up failed");
        }
        
        const result = await response.json();
        console.log("Sign up success:", result);
        // Handle success (redirect, toast, etc.)
      } catch (err) {
        console.error("Sign up error:", err);
        // Handle error
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
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Create Account
            </h1>
            <p className="text-sm text-gray-500">
              Sign up to get started
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {config && (
              <InputFieldsRenderer 
                configs={config} 
                formObject={formObject}
              />
            )}
          <button
            onClick={formObject.handleSubmit(onSubmit)}
            className="mt-4 block w-full max-w-xs mx-auto rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Submit
          </button>
          </div>

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
