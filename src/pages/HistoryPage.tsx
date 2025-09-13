import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react'; // changed icon

interface ScanHistory {
    id: string;
    image: string;
    prediction: string;
    date: string;
}

const HistoryPage = () => {
    const [history, setHistory] = useState<ScanHistory[]>([]);

    useEffect(() => {
        const storedHistory = JSON.parse(localStorage.getItem('wildscan-history') || '[]');
        setHistory(storedHistory);
    }, []);

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6 text-center text-brand-green-dark dark:text-brand-green-light">
                Scan History
            </h1>

            {history.length === 0 ? (
                <p className="text-center text-gray-500">You have no saved scans yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {history.map((scan, index) => (
                        <motion.div
                            key={scan.id}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl hover:scale-105 transition-transform duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                            <div className="relative">
                                <img
                                    src={scan.image}
                                    alt={scan.prediction}
                                    className="w-full h-48 object-cover rounded-t-2xl"
                                />
                                <div className="absolute top-2 right-2 bg-white/70 dark:bg-gray-700/70 rounded-full p-1">
                                    <Star size={20} className="text-brand-green-dark dark:text-brand-green-light" />
                                </div>
                            </div>
                            <div className="p-4">
                                <p className="font-bold text-lg flex items-center gap-2 capitalize">
                                    <Star size={16} className="text-brand-green-dark dark:text-brand-green-light" />
                                    {scan.prediction.replace(/_/g, ' ')}
                                </p>
                                <p className="text-sm text-gray-500">{scan.date}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistoryPage;
