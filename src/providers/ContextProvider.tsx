import AuthProvider from "./AuthProvider";
import { ToastProvider } from "./ToastProvider";

export default function ContextProvider({ children } : { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <ToastProvider>
                {children}
            </ToastProvider>
        </AuthProvider>
    );
}