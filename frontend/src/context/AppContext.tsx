import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// The shape of the prediction data returned by our FastAPI backend
export interface PredictionRow {
    Container_ID: string;
    Risk_Score: number;
    Risk_Level: 'Critical' | 'Medium' | 'Low';
    Anomaly_Flag?: 'Yes' | 'No';
    Explanation_Summary: string;
    Origin_Country?: string;
    Declared_Value?: number;
    Declaration_Date?: string;
    Declaration_Time?: string;
    Declared_Weight?: number;
    Measured_Weight?: number;
    Dwell_Time_Hours?: number;
}

interface AppContextType {
    predictions: PredictionRow[];
    setPredictions: (predictions: PredictionRow[]) => void;
    theme: 'dark' | 'light';
    toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [predictions, setPredictions] = useState<PredictionRow[]>([]);
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme]);

    return (
        <AppContext.Provider value={{ predictions, setPredictions, theme, toggleTheme }}>
            {children}
        </AppContext.Provider>
    );
};

export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}
