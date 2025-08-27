// client/src/App.js
import './App.css';
import 'highlight.js/styles/atom-one-dark.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import EditorPage from './components/EditorPage/EditorPage';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AuthPage from './components/AuthPage';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return null;
    return user ? children : <AuthPage />;
}

function App() {
    return (
        <AuthProvider>
            <Toaster
                position="top-right"
                toastOptions={{
                    success: {
                        duration: 4000, // Stay for 4 seconds
                        style: {
                            background: '#282a36',
                            color: '#50fa7b',
                            border: '1px solid #50fa7b',
                        },
                    },
                    error: {
                        duration: 5000, // Stay for 5 seconds
                         style: {
                            background: '#282a36',
                            color: '#ff5555',
                            border: '1px solid #ff5555',
                        },
                    },
                }}
            ></Toaster>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<AuthPage />} />
                <Route path="/register" element={<AuthPage />} />
                <Route
                    path="/editor/:roomId"
                    element={
                        <ProtectedRoute>
                            <EditorPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </AuthProvider>
    );
}

export default App;