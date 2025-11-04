import React, { useState } from 'react';
import { motion } from 'framer-motion';

const API_KEY = '4fdaf603c4594304b9ae686cb33efa90';

function NewsSection({ setLoading, showSnackbar }) {
    const [topic, setTopic] = useState('');
    const [articles, setArticles] = useState([]);

    const getNews = async () => {
        const searchTopic = topic.trim() || 'technology';
        setLoading(true);

        try {
            const response = await fetch(
                `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchTopic)}&pageSize=6&language=en&sortBy=publishedAt&apiKey=${API_KEY}`
            );
            if (!response.ok) throw new Error('Failed to fetch news');
            const data = await response.json();

            if (data.articles && data.articles.length > 0) {
                setArticles(data.articles);
                showSnackbar('News loaded! 📰');
            } else {
                showSnackbar('No news articles found');
                setArticles([]);
            }
        } catch (error) {
            showSnackbar('Could not fetch news');
            setArticles([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            key="news"
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
                    📰 Latest News
                </motion.h2>
                <div className="input-group">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && getNews()}
                        placeholder="Enter topic (e.g., technology)..."
                        className="text-field modern-input"
                    />
                    <motion.button
                        className="cta-button filled shimmer-button"
                        onClick={getNews}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span>Get News</span>
                    </motion.button>
                </div>

                {articles.length > 0 && (
                    <div className="news-grid">
                        {articles.map((article, index) => (
                            <motion.a
                                key={index}
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: 'none', color: 'inherit' }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02, y: -5 }}
                            >
                                <div className="news-card">
                                    {article.urlToImage && (
                                        <motion.img
                                            src={article.urlToImage}
                                            alt={article.title}
                                            className="news-image"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                        />
                                    )}
                                    <div className="news-content">
                                        <div className="news-title">{article.title}</div>
                                        <div className="news-description">{article.description || 'No description available'}</div>
                                        <div className="news-source">
                                            {article.source.name} • {new Date(article.publishedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export default NewsSection;