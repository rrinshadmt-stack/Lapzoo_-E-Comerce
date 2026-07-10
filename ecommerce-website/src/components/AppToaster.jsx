import { Toaster } from "react-hot-toast";

export default function AppToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#0f0f0f",
          color: "#ffffff",
          border: "1px solid #262626",
          padding: "12px 16px",
          borderRadius: "10px",
          fontSize: "14px",
        },
        success: {
          iconTheme: {
            primary: "#22c55e",
            secondary: "#0f0f0f",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#0f0f0f",
          },
        },
      }}
    />
  );
}
