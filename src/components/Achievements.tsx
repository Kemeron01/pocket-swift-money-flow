
import React, { useState, useEffect } from 'react';
import { Award, Medal, Trophy, Star, Target, Shield, Users, TrendingUp, Calendar, Gift } from 'lucide-react';

const Achievements = ({ mockData, setMockData, showNotificationMessage }) => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    
    // Achievement definitions
    const achievementDefinitions = [
        // Financial Milestones
        {
            id: 'first_transfer',
            category: 'financial',
            title: 'First Transfer',
            description: 'Complete your first money transfer',
            icon: <Award className="w-6 h-6" />,
            points: 50,
            badge: '🏆',
            tier: 'bronze'
        },
        {
            id: 'savings_milestone_1k',
            category: 'financial',
            title: 'Savings Star',
            description: 'Save $1,000 in your account',
            icon: <Star className="w-6 h-6" />,
            points: 100,
            badge: '⭐',
            tier: 'silver'
        },
        {
            id: 'savings_milestone_5k',
            category: 'financial',
            title: 'Savings Champion',
            description: 'Save $5,000 in your account',
            icon: <Trophy className="w-6 h-6" />,
            points: 250,
            badge: '🏆',
            tier: 'gold'
        },
        {
            id: 'transaction_streak_7',
            category: 'financial',
            title: 'Weekly Warrior',
            description: 'Make transactions for 7 consecutive days',
            icon: <Calendar className="w-6 h-6" />,
            points: 75,
            badge: '📅',
            tier: 'bronze'
        },
        
        // Spending Management
        {
            id: 'budget_keeper',
            category: 'spending',
            title: 'Budget Keeper',
            description: 'Stay under $500 monthly spending',
            icon: <Target className="w-6 h-6" />,
            points: 100,
            badge: '🎯',
            tier: 'silver'
        },
        {
            id: 'smart_spender',
            category: 'spending',
            title: 'Smart Spender',
            description: 'Use business payments 10 times',
            icon: <TrendingUp className="w-6 h-6" />,
            points: 150,
            badge: '📈',
            tier: 'gold'
        },
        {
            id: 'bill_master',
            category: 'spending',
            title: 'Bill Master',
            description: 'Pay 5 different bills on time',
            icon: <Medal className="w-6 h-6" />,
            points: 80,
            badge: '🏅',
            tier: 'bronze'
        },
        
        // Social Features
        {
            id: 'social_butterfly',
            category: 'social',
            title: 'Social Butterfly',
            description: 'Send 10 P2P payments to friends',
            icon: <Users className="w-6 h-6" />,
            points: 120,
            badge: '🦋',
            tier: 'silver'
        },
        {
            id: 'red_envelope_master',
            category: 'social',
            title: 'Red Envelope Master',
            description: 'Send 5 digital red envelopes',
            icon: <Gift className="w-6 h-6" />,
            points: 90,
            badge: '🧧',
            tier: 'bronze'
        },
        {
            id: 'split_bill_pro',
            category: 'social',
            title: 'Split Bill Pro',
            description: 'Split bills with friends 3 times',
            icon: <Users className="w-6 h-6" />,
            points: 60,
            badge: '💰',
            tier: 'bronze'
        },
        
        // Security Achievements
        {
            id: 'security_guardian',
            category: 'security',
            title: 'Security Guardian',
            description: 'Enable all security features',
            icon: <Shield className="w-6 h-6" />,
            points: 200,
            badge: '🛡️',
            tier: 'gold'
        },
        {
            id: 'biometric_user',
            category: 'security',
            title: 'Biometric User',
            description: 'Enable biometric login',
            icon: <Shield className="w-6 h-6" />,
            points: 50,
            badge: '👆',
            tier: 'bronze'
        },
        
        // Special Achievements
        {
            id: 'early_adopter',
            category: 'special',
            title: 'Early Adopter',
            description: 'One of the first 1000 users',
            icon: <Trophy className="w-6 h-6" />,
            points: 500,
            badge: '🚀',
            tier: 'platinum'
        },
        {
            id: 'perfect_month',
            category: 'special',
            title: 'Perfect Month',
            description: 'Complete all daily tasks for a month',
            icon: <Star className="w-6 h-6" />,
            points: 300,
            badge: '✨',
            tier: 'gold'
        }
    ];

    // Initialize achievements in mockData if not present
    useEffect(() => {
        if (!mockData.achievements) {
            const initialAchievements = achievementDefinitions.map(def => ({
                ...def,
                unlocked: false,
                unlockedAt: null,
                progress: 0,
                maxProgress: getMaxProgress(def.id)
            }));
            
            // Unlock some initial achievements for demo
            initialAchievements[0].unlocked = true; // First transfer
            initialAchievements[0].unlockedAt = new Date('2024-06-01');
            initialAchievements[10].unlocked = true; // Biometric user
            initialAchievements[10].unlockedAt = new Date('2024-05-15');
            
            setMockData(prev => ({
                ...prev,
                achievements: initialAchievements,
                totalAchievementPoints: 100
            }));
        }
    }, []);

    const getMaxProgress = (achievementId) => {
        const progressMap = {
            'first_transfer': 1,
            'savings_milestone_1k': 1000,
            'savings_milestone_5k': 5000,
            'transaction_streak_7': 7,
            'budget_keeper': 1,
            'smart_spender': 10,
            'bill_master': 5,
            'social_butterfly': 10,
            'red_envelope_master': 5,
            'split_bill_pro': 3,
            'security_guardian': 4,
            'biometric_user': 1,
            'early_adopter': 1,
            'perfect_month': 30
        };
        return progressMap[achievementId] || 1;
    };

    const categories = [
        { id: 'all', name: 'All', icon: '🏆' },
        { id: 'financial', name: 'Financial', icon: '💰' },
        { id: 'spending', name: 'Spending', icon: '💳' },
        { id: 'social', name: 'Social', icon: '👥' },
        { id: 'security', name: 'Security', icon: '🔒' },
        { id: 'special', name: 'Special', icon: '✨' }
    ];

    const filteredAchievements = mockData.achievements?.filter(achievement => 
        selectedCategory === 'all' || achievement.category === selectedCategory
    ) || [];

    const unlockedCount = mockData.achievements?.filter(a => a.unlocked).length || 0;
    const totalCount = achievementDefinitions.length;

    const getTierColor = (tier) => {
        switch (tier) {
            case 'bronze': return 'text-amber-600 bg-amber-50';
            case 'silver': return 'text-gray-600 bg-gray-50';
            case 'gold': return 'text-yellow-600 bg-yellow-50';
            case 'platinum': return 'text-purple-600 bg-purple-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const claimReward = (achievement) => {
        if (achievement.unlocked && !achievement.claimed) {
            setMockData(prev => ({
                ...prev,
                achievements: prev.achievements.map(a => 
                    a.id === achievement.id ? { ...a, claimed: true } : a
                ),
                totalAchievementPoints: (prev.totalAchievementPoints || 0) + achievement.points
            }));
            showNotificationMessage(`Claimed ${achievement.points} points for "${achievement.title}"!`, 'success');
        }
    };

    return (
        <div className="fade-in p-4">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Achievements</h2>
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100">Progress</p>
                            <p className="text-2xl font-bold">{unlockedCount}/{totalCount}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-blue-100">Total Points</p>
                            <p className="text-2xl font-bold">{mockData.totalAchievementPoints || 0}</p>
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="bg-white/20 rounded-full h-2">
                            <div 
                                className="bg-white rounded-full h-2 transition-all duration-500"
                                style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
                <div className="flex overflow-x-auto hide-scrollbar space-x-2 pb-2">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors scale-on-tap ${
                                selectedCategory === category.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {category.icon} {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Achievements List */}
            <div className="space-y-4">
                {filteredAchievements.map(achievement => (
                    <div 
                        key={achievement.id}
                        className={`p-4 rounded-lg border transition-all duration-200 ${
                            achievement.unlocked 
                                ? 'bg-white border-green-200 shadow-sm' 
                                : 'bg-gray-50 border-gray-200'
                        }`}
                    >
                        <div className="flex items-start space-x-3">
                            {/* Icon */}
                            <div className={`p-2 rounded-full ${getTierColor(achievement.tier)} ${
                                achievement.unlocked ? '' : 'opacity-50'
                            }`}>
                                {achievement.icon}
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className={`font-semibold ${
                                        achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
                                    }`}>
                                        {achievement.title} {achievement.badge}
                                    </h3>
                                    <div className="flex items-center space-x-2">
                                        <span className={`text-xs px-2 py-1 rounded-full ${getTierColor(achievement.tier)}`}>
                                            {achievement.tier}
                                        </span>
                                        <span className="text-blue-600 font-medium">
                                            +{achievement.points}
                                        </span>
                                    </div>
                                </div>
                                
                                <p className={`text-sm mb-2 ${
                                    achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
                                }`}>
                                    {achievement.description}
                                </p>

                                {/* Progress Bar */}
                                {!achievement.unlocked && achievement.maxProgress > 1 && (
                                    <div className="mb-2">
                                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                            <span>Progress</span>
                                            <span>{achievement.progress || 0}/{achievement.maxProgress}</span>
                                        </div>
                                        <div className="bg-gray-200 rounded-full h-1.5">
                                            <div 
                                                className="bg-blue-500 rounded-full h-1.5 transition-all duration-500"
                                                style={{ 
                                                    width: `${((achievement.progress || 0) / achievement.maxProgress) * 100}%` 
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {/* Unlock Date or Claim Button */}
                                {achievement.unlocked && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-green-600">
                                            ✅ Unlocked {achievement.unlockedAt ? new Date(achievement.unlockedAt).toLocaleDateString() : 'Recently'}
                                        </span>
                                        {!achievement.claimed && (
                                            <button
                                                onClick={() => claimReward(achievement)}
                                                className="px-3 py-1 bg-green-600 text-white text-xs rounded-full hover:bg-green-700 transition-colors scale-on-tap"
                                            >
                                                Claim Reward
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredAchievements.length === 0 && (
                <div className="text-center py-8">
                    <div className="text-4xl mb-2">🏆</div>
                    <p className="text-gray-500">No achievements in this category yet</p>
                </div>
            )}
        </div>
    );
};

export default Achievements;
