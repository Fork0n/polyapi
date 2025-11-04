import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_KEY = '22a0aa70';

function MoviesSection({ setLoading, showSnackbar }) {
    const [movieName, setMovieName] = useState('');
    const [movie, setMovie] = useState(null);

    const searchMovie = async () => {
        if (!movieName.trim()) {
            showSnackbar('Please enter a movie name');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(
                `https://www.omdbapi.com/?t=${encodeURIComponent(movieName)}&apikey=${API_KEY}`
            );
            const data = await response.json();

            if (data.Response === 'False') {
                throw new Error(data.Error || 'Movie not found');
            }

            setMovie(data);
            showSnackbar('Movie found! 🎬');
        } catch (error) {
            showSnackbar(`Could not fetch movie: ${error.message}`);
            setMovie(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            key="movies"
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
                    🎬 Movie Database
                </motion.h2>
                <div className="input-group">
                    <input
                        type="text"
                        value={movieName}
                        onChange={(e) => setMovieName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && searchMovie()}
                        placeholder="Search for a movie..."
                        className="text-field modern-input"
                    />
                    <motion.button
                        className="cta-button filled shimmer-button"
                        onClick={searchMovie}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span>Search</span>
                    </motion.button>
                </div>

                <AnimatePresence mode="wait">
                    {movie && (
                        <motion.div
                            key={movie.imdbID}
                            className="movie-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            <motion.img
                                src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/200x300?text=No+Poster'}
                                alt={movie.Title}
                                className="movie-poster"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            />
                            <div className="movie-info">
                                <motion.div
                                    className="movie-title"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    {movie.Title} ({movie.Year})
                                </motion.div>
                                <motion.div
                                    className="movie-details"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <div className="movie-detail-item">
                                        <strong>Rating:</strong> ⭐ {movie.imdbRating !== 'N/A' ? movie.imdbRating + '/10' : 'Not rated'}
                                    </div>
                                    <div className="movie-detail-item"><strong>Genre:</strong> {movie.Genre}</div>
                                    <div className="movie-detail-item"><strong>Director:</strong> {movie.Director}</div>
                                    <div className="movie-detail-item"><strong>Actors:</strong> {movie.Actors}</div>
                                    <div className="movie-detail-item"><strong>Runtime:</strong> {movie.Runtime}</div>
                                    {movie.Awards !== 'N/A' && (
                                        <div className="movie-detail-item"><strong>Awards:</strong> {movie.Awards}</div>
                                    )}
                                </motion.div>
                                <motion.div
                                    className="movie-plot"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    {movie.Plot}
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

export default MoviesSection;