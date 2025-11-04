import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function LoadingOverlay({ loading }) {
    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    className="loading-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="spinner-container">
                        <motion.div
                            className="spinner modern-spinner"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.p
                            className="loading-text"
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            Loading...
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default LoadingOverlay;