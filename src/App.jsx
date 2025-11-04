import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import NavigationRail from './components/NavigationRail';
import WeatherSection from './components/sections/WeatherSection';
import NewsSection from './components/sections/NewsSection';
import PetsSection from './components/sections/PetsSection';
import MoviesSection from './components/sections/MoviesSection';
import MiscSection from './components/sections/MiscSection';
import LoadingOverlay from './components/LoadingOverlay';
import Snackbar from './components/Snackbar';
import './styles/App.css';
import { ChatBot } from './components/ChatBot';

function App() {
    const [activePage, setActivePage] = useState('weather');
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ show: false, message: '' });

    const showSnackbar = (message) => {
        setSnackbar({ show: true, message });
        setTimeout(() => setSnackbar({ show: false, message: '' }), 3000);
    };

    const sections = {
        weather: <WeatherSection setLoading={setLoading} showSnackbar={showSnackbar} />,
        news: <NewsSection setLoading={setLoading} showSnackbar={showSnackbar} />,
        pets: <PetsSection setLoading={setLoading} showSnackbar={showSnackbar} />,
        movies: <MoviesSection setLoading={setLoading} showSnackbar={showSnackbar} />,
        misc: <MiscSection setLoading={setLoading} showSnackbar={showSnackbar} />
    };

    return (
        <>
            <Header />
            <div className="container">
                <NavigationRail activePage={activePage} setActivePage={setActivePage} />
                <main className="main-content">
                    <AnimatePresence mode="wait">
                        {sections[activePage]}
                    </AnimatePresence>
                </main>
            </div>
            <LoadingOverlay loading={loading} />
            <Snackbar show={snackbar.show} message={snackbar.message} />
        </>
    );
}

export default App;