import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function PetsSection({ setLoading, showSnackbar }) {
    const [image, setImage] = useState(null);

    const getCat = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://api.thecatapi.com/v1/images/search');
            const data = await response.json();
            setImage({ url: data[0].url, title: 'Random Cat 🐱' });
            showSnackbar('Meow! 🐱');
        } catch (error) {
            showSnackbar('Could not fetch cat image');
        } finally {
            setLoading(false);
        }
    };

    const getDog = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://api.thedogapi.com/v1/images/search');
            const data = await response.json();
            setImage({ url: data[0].url, title: 'Random Dog 🐕' });
            showSnackbar('Woof! 🐕');
        } catch (error) {
            showSnackbar('Could not fetch dog image');
        } finally {
            setLoading(false);
        }
    };

    const getMeme = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://api.imgflip.com/get_memes');
            const data = await response.json();
            const randomMeme = data.data.memes[Math.floor(Math.random() * data.data.memes.length)];
            setImage({ url: randomMeme.url, title: randomMeme.name });
            showSnackbar('Meme loaded! 😂');
        } catch (error) {
            showSnackbar('Could not fetch meme');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            key="pets"
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
                    🐱 Pet Gallery
                </motion.h2>
                <div className="button-group">
                    <motion.button
                        className="cta-button filled shimmer-button"
                        onClick={getCat}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span>Random Cat</span>
                    </motion.button>
                    <motion.button
                        className="cta-button filled shimmer-button"
                        onClick={getDog}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span>Random Dog</span>
                    </motion.button>
                    <motion.button
                        className="cta-button outlined pulse-button"
                        onClick={getMeme}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span>Random Meme</span>
                    </motion.button>
                </div>

                <AnimatePresence mode="wait">
                    {image && (
                        <motion.div
                            key={image.url}
                            className="image-container"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div>
                                <motion.h3
                                    style={{ textAlign: 'center', marginBottom: '16px', color: 'var(--md-sys-color-primary)' }}
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                >
                                    {image.title}
                                </motion.h3>
                                <motion.img
                                    src={image.url}
                                    alt={image.title}
                                    className="api-image"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    whileHover={{ scale: 1.02 }}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

export default PetsSection;