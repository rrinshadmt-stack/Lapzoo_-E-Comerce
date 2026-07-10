import { useNavigate, Link } from "react-router-dom";
import { Formik } from "formik";
import api from "../services/api";
import toast from "react-hot-toast";

function Register() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          confirm: "",
        }}
        validateOnChange={false}
        validateOnBlur={false}
          onSubmit={async (values, { setFieldError }) => {
          // Required validation
          if (!values.name.trim()) {
            setFieldError("name", "Name is required");
            return;
          }

          if (!values.email.trim()) {
            setFieldError("email", "Email is required");
            return;
          }

          if (!values.password) {
            setFieldError("password", "Password is required");
            return;
          }

          if (!values.confirm) {
            setFieldError("confirm", "Confirm your password");
            return;
          }
          
          if (values.password.length < 6) {
            setFieldError("password", "Password must be at least 6 characters long");
            return;
          }

          if (values.password !== values.confirm) {
            setFieldError("confirm", "Passwords do not match");
            return;
          }

          try {
            await api.post("/auth/register", {
              name: values.name,
              email: values.email,
              password: values.password,
            });

            toast.success("Registration successful!", { duration: 3000 });
            navigate("/login");

          } catch (error) {
            const message = error.response?.data?.message;
            if (message === "Email already registered") {
              setFieldError("email", message);
            } else {
              toast.error("Registration failed, try again");
            }
          }
        }}
      >
        {({ values, errors, handleChange, handleSubmit }) => (
          <form
            onSubmit={handleSubmit}
            className="bg-zinc-900 p-8 rounded-xl w-full max-w-md space-y-4 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-center">
              Create Account
            </h2>

            <input
              className="input"
              placeholder="Name"
              name="name"
              value={values.name}
              onChange={handleChange}
            />
            {errors.name && (
              <div className="text-red-500 text-sm">{errors.name}</div>
            )}

            <input
              type="email"
              className="input"
              placeholder="Email"
              name="email"
              value={values.email}
              onChange={handleChange}
            />
            {errors.email && (
              <div className="text-red-500 text-sm">{errors.email}</div>
            )}

            <input
              type="password"
              className="input"
              placeholder="Password"
              name="password"
              value={values.password}
              onChange={handleChange}
            />
            {errors.password && (
              <div className="text-red-500 text-sm">{errors.password}</div>
            )}

            <input
              type="password"
              className="input"
              placeholder="Confirm Password"
              name="confirm"
              value={values.confirm}
              onChange={handleChange}
            />
            {errors.confirm && (
              <div className="text-red-500 text-sm">{errors.confirm}</div>
            )}

            <button
              type="submit"
              className="btn bg-blue-600 text-white py-2 rounded w-full"
            >
              Sign up
            </button>

            <p className="text-center text-sm mt-2">
              Already have an account?{" "}
              <Link className="text-indigo-400" to="/login">
                Login
              </Link>
            </p>
          </form>
        )}
      </Formik>
    </div>
  );
}

export default Register;
