import React from 'react';
import { motion } from 'framer-motion';

const navItems = [
    { id: 'weather', icon: '🌤️', label: 'Weather' },
    { id: 'news', icon: '📰', label: 'News' },
    { id: 'pets', icon: '🐱', label: 'Pets' },
    { id: 'movies', icon: '🎬', label: 'Movies' },
    { id: 'misc', icon: '🌍', label: 'Misc' }
];

function NavigationRail({ activePage, setActivePage }) {
    return (
        <nav className="navigation-rail">
            {navItems.map((item, index) => (
                <motion.button
                    key={item.id}
                    className={`nav-button ${activePage === item.id ? 'active' : ''}`}
                    onClick={() => setActivePage(item.id)}
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <span className="icon">{item.icon}</span>
                    <span className="label">{item.label}</span>
                </motion.button>
            ))}
        </nav>
    );
}

export default NavigationRail;