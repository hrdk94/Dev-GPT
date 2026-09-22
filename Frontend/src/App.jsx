import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ChatWindow from "./components/ChatWindow";

function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function App() {
    return (
        <Routes>
            <Route
                path="/"
                element={<Navigate to="/chat" replace />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/chat"
                element={
                    <ProtectedRoute>
                        <ChatWindow />
                    </ProtectedRoute>
                }
            />

            <Route
                path="*"
                element={<Navigate to="/chat" replace />}
            />
        </Routes>
    );
}

export default App;