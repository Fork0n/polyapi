import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Snackbar({ show, message }) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="snackbar"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                >
                    {message}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default Snackbar;