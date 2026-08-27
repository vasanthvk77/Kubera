import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';

function App() {
    return (
        <MotionConfig reducedMotion="never">
            <Router>
                <ScrollToTop />
                <Routes>
                    
                    <Route path="/" element={<HomePage />} />
                </Routes>
            </Router>
        </MotionConfig>
    );
}

export default App;
