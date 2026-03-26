import { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store, RootState, AppDispatch } from './store';
import AppRoutes from './routes/AppRoutes';
import { initializeAuth } from './store/slices/userSlice';
import './styles/index.css';

const WrappedApp = () => {
    const dispatch = useDispatch<AppDispatch>();
    const theme = useSelector((state: RootState) => state.ui.theme);

    useEffect(() => {
        dispatch(initializeAuth());
    }, [dispatch]);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme]);

    return (
        <Router>
            <AppRoutes />
        </Router>
    );
};

function App() {
    return (
        <Provider store={store}>
            <WrappedApp />
        </Provider>
    );
}

export default App;
