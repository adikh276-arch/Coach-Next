"use client";
import '../lib/i18n';
import '../styles/index.css';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AssessmentProvider } from './context/AssessmentContext';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <AssessmentProvider>
        <RouterProvider router={router} />
      </AssessmentProvider>
    </AuthProvider>
  );
}

