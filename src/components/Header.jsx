import React from 'react';
import ASCIIText from './ASCIIText';
import { motion } from 'framer-motion';

function Header() {
    return (
        <motion.header
            className="header"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
        >
            <div className="header-content">
                <motion.h1
                    className="animated-gradient-text"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    Boredom Inc.
                </motion.h1>
                <motion.p
                    className="subtitle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    Your dashboard to cure boredom with real-time data
                </motion.p>
            </div>
        </motion.header>
    );
}

export default Header;