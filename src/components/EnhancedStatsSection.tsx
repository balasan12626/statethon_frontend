
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { 
  FaIndustry, 
  FaSearch,
  FaDatabase,
  FaGlobe,
  FaAward,
  FaRocket
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

interface StatItem {
  number: number;
  suffix: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const EnhancedStatsSection: React.FC = () => {
  const { t } = useTranslation();

  const stats: StatItem[] = [
    {
      number: 3600,
      suffix: '+',
      label: t('stats.occupations'),
      icon: <FaDatabase className="w-8 h-8" />,
      color: 'blue',
      description: 'Comprehensive database of occupation codes covering all industry sectors'
    },
    {
      number: 52,
      suffix: '',
      label: t('stats.sectors'),
      icon: <FaIndustry className="w-8 h-8" />,
      color: 'emerald',
      description: 'Industry sectors with detailed classification and categorization'
    },
    {
      number: 95,
      suffix: '%',
      label: t('stats.accuracy'),
      icon: <FaAward className="w-8 h-8" />,
      color: 'purple',
      description: 'High accuracy rate in job classification and matching'
    },
    {
      number: 10000,
      suffix: '+',
      label: t('stats.searches'),
      icon: <FaSearch className="w-8 h-8" />,
      color: 'orange',
      description: 'Daily searches performed by users across the platform'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800',
      purple: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
      orange: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getGlowClass = (color: string) => {
    const glowMap = {
      blue: 'shadow-blue-500/50',
      emerald: 'shadow-emerald-500/50',
      purple: 'shadow-purple-500/50',
      orange: 'shadow-orange-500/50'
    };
    return glowMap[color as keyof typeof glowMap] || glowMap.blue;
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
      
      {/* Wave Divider */}
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-transparent via-blue-200/20 to-purple-200/20 dark:from-transparent dark:via-blue-800/20 dark:to-purple-800/20 transform -skew-y-1"></div>
      
      <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm py-20 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 shadow-lg">
              <FaRocket className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Platform Statistics
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Empowering job seekers and employers with accurate classification data
            </p>
          </motion.div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                {/* Card */}
                <div className={`relative p-6 rounded-2xl border-2 ${getColorClasses(stat.color)} transition-all duration-300 group-hover:shadow-xl group-hover:shadow-lg ${getGlowClass(stat.color)}`}>
                  
                  {/* Icon */}
                  <div className={`flex items-center justify-center w-16 h-16 rounded-full bg-white dark:bg-gray-800 shadow-lg mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 ${getColorClasses(stat.color).split(' ')[0]}`}>
                    {stat.icon}
                  </div>
                  
                  {/* Number */}
                  <div className="text-center mb-2">
                    <div className={`text-3xl md:text-4xl font-bold ${getColorClasses(stat.color).split(' ')[0]} mb-1 drop-shadow-sm`}>
                      <CountUp 
                        end={stat.number} 
                        duration={2.5} 
                        delay={index * 0.2}
                        separator=","
                      />
                      <span className="text-2xl">{stat.suffix}</span>
                    </div>
                  </div>
                  
                  {/* Label */}
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {stat.label}
                    </h3>
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 max-w-xs text-center">
                    {stat.description}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                  </div>
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Bottom Wave */}
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <FaGlobe className="w-5 h-5" />
              <span className="text-sm font-medium">Trusted by professionals worldwide</span>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Bottom Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-r from-purple-200/20 via-transparent to-blue-200/20 dark:from-purple-800/20 dark:to-blue-800/20 transform skew-y-1"></div>
    </div>
  );
};

export default EnhancedStatsSection; 