import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function MiscSection({ setLoading, showSnackbar }) {
    const [content, setContent] = useState(null);

    const getJoke = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://v2.jokeapi.dev/joke/Any?safe-mode');
            const data = await response.json();

            let jokeText = '';
            if (data.type === 'single') {
                jokeText = data.joke;
            } else {
                jokeText = `${data.setup}\n\n${data.delivery}`;
            }

            setContent({ type: 'joke', data: jokeText });
            showSnackbar('Joke loaded! 😂');
        } catch (error) {
            showSnackbar('Could not fetch joke');
        } finally {
            setLoading(false);
        }
    };

    const getNASA = async () => {
        setLoading(true);
        try {
            const searchTerms = ['nebula', 'galaxy spiral', 'hubble', 'pillars of creation', 'aurora', 'earth from space'];
            const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];

            const response = await fetch(
                `https://images-api.nasa.gov/search?q=${randomTerm}&media_type=image&page_size=50`
            );
            const data = await response.json();

            const itemsWithImages = data.collection.items.filter(item => item.links && item.links[0]);
            const randomItem = itemsWithImages[Math.floor(Math.random() * itemsWithImages.length)];
            const imageData = randomItem.data[0];

            setContent({
                type: 'nasa',
                data: {
                    url: randomItem.links[0].href,
                    title: imageData.title,
                    description: imageData.description,
                    date: imageData.date_created
                }
            });
            showSnackbar('Random NASA photo loaded! 🚀');
        } catch (error) {
            showSnackbar('Could not fetch NASA image');
        } finally {
            setLoading(false);
        }
    };

    const getCountry = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,region,subregion,population,area,flags');
            const countries = await response.json();
            const country = countries[Math.floor(Math.random() * countries.length)];

            setContent({ type: 'country', data: country });
            showSnackbar('Random country loaded! 🌍');
        } catch (error) {
            showSnackbar('Could not fetch country data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            key="misc"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
        >
            <div className="content-card elevated glass-effect">
                <motion.h2
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    🌍 Miscellaneous
                </motion.h2>
                <div className="button-group">
                    <motion.button
                        className="cta-button filled shimmer-button"
                        onClick={getJoke}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span>Random Joke</span>
                    </motion.button>
                    <motion.button
                        className="cta-button filled shimmer-button"
                        onClick={getNASA}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span>NASA Photo</span>
                    </motion.button>
                    <motion.button
                        className="cta-button outlined pulse-button"
                        onClick={getCountry}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span>Random Country</span>
                    </motion.button>
                </div>

                <AnimatePresence mode="wait">
                    {content && content.type === 'joke' && (
                        <motion.div
                            key="joke"
                            className="joke-card"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <div className="joke-text">{content.data}</div>
                        </motion.div>
                    )}

                    {content && content.type === 'nasa' && (
                        <motion.div
                            key="nasa"
                            className="nasa-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <motion.div
                                className="nasa-title"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                {content.data.title}
                            </motion.div>
                            <div className="image-container">
                                <motion.img
                                    src={content.data.url}
                                    alt={content.data.title}
                                    className="api-image"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    whileHover={{ scale: 1.02 }}
                                />
                            </div>
                            <motion.div
                                className="nasa-description"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                {content.data.description}
                            </motion.div>
                        </motion.div>
                    )}

                    {content && content.type === 'country' && (
                        <motion.div
                            key="country"
                            className="country-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <motion.div style={{ textAlign: 'center', marginBottom: '16px' }}>
                                <motion.img
                                    src={content.data.flags?.png}
                                    alt={content.data.name?.common}
                                    style={{ maxWidth: '200px', borderRadius: '12px', boxShadow: 'var(--md-sys-elevation-2)' }}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200 }}
                                />
                            </motion.div>
                            <motion.div
                                className="country-name"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                {content.data.name?.common}
                            </motion.div>
                            <motion.div
                                className="country-info"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className="weather-item">
                                    <span className="weather-label">Official Name</span>
                                    <span className="weather-value">{content.data.name?.official || 'N/A'}</span>
                                </div>
                                <div className="weather-item">
                                    <span className="weather-label">Capital</span>
                                    <span className="weather-value">{content.data.capital?.[0] || 'N/A'}</span>
                                </div>
                                <div className="weather-item">
                                    <span className="weather-label">Region</span>
                                    <span className="weather-value">{content.data.region || 'N/A'}</span>
                                </div>
                                <div className="weather-item">
                                    <span className="weather-label">Population</span>
                                    <span className="weather-value">{content.data.population?.toLocaleString() || 'N/A'}</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

export default MiscSection;