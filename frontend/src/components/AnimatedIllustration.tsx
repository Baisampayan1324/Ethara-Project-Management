import { motion } from 'framer-motion';
import { BarChart3, Zap, Users, Layers } from 'lucide-react';

interface AnimatedIllustrationProps {
  animationIntensity?: 'high' | 'low';
}

export const AnimatedIllustration = ({ animationIntensity = 'high' }: AnimatedIllustrationProps) => {
  const cardConfigs = [
    {
      id: 1,
      icon: BarChart3,
      title: 'Analytics',
      color: 'from-blue-500/30 to-blue-600/20',
      borderColor: 'border-blue-400/30',
      duration: 6,
      delay: 0,
      offset: -40,
    },
    {
      id: 2,
      icon: Zap,
      title: 'Performance',
      color: 'from-purple-500/30 to-purple-600/20',
      borderColor: 'border-purple-400/30',
      duration: 8,
      delay: 0.5,
      offset: 0,
    },
    {
      id: 3,
      icon: Users,
      title: 'Collaboration',
      color: 'from-pink-500/30 to-pink-600/20',
      borderColor: 'border-pink-400/30',
      duration: 10,
      delay: 1,
      offset: 40,
    },
    {
      id: 4,
      icon: Layers,
      title: 'Organization',
      color: 'from-cyan-500/30 to-cyan-600/20',
      borderColor: 'border-cyan-400/30',
      duration: 7,
      delay: 1.5,
      offset: -20,
    },
  ];

  const intensity = animationIntensity === 'high' ? 1 : 0.4;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Animated Cards */}
      {cardConfigs.map((config) => {
        const Icon = config.icon;

        return (
          <motion.div
            key={config.id}
            initial={{
              y: config.offset,
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              y: [config.offset - 30 * intensity, config.offset + 30 * intensity, config.offset - 30 * intensity],
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: config.duration,
              delay: config.delay,
              repeat: Infinity,
              ease: 'easeInOut',
              y: {
                duration: config.duration,
                repeat: Infinity,
                ease: 'easeInOut',
              },
              opacity: { duration: 0.5, delay: config.delay },
              scale: { duration: 0.5, delay: config.delay },
            }}
            className="absolute"
            style={{
              left: `${15 + config.id * 20}%`,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            {/* Glow Effect */}
            <motion.div
              className="absolute -inset-8 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"
              animate={{
                background: [
                  `rgba(59, 130, 246, ${0.1 * intensity})`,
                  `rgba(168, 85, 247, ${0.15 * intensity})`,
                  `rgba(59, 130, 246, ${0.1 * intensity})`,
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Card */}
            <motion.div
              whileHover={{ scale: 1.05, y: -10 }}
              className={`relative w-48 h-32 rounded-xl bg-gradient-to-br ${config.color} border ${config.borderColor} backdrop-blur-xl p-6 cursor-pointer will-change-transform`}
            >
              {/* Shimmer Effect */}
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                animate={{
                  opacity: [0, 0.1, 0],
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <motion.div
                    animate={{
                      rotate: [0, 5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <Icon size={24} className="text-white/80" />
                  </motion.div>
                  <motion.div
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="w-2 h-2 rounded-full bg-white"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white/90">{config.title}</h3>
                  <p className="text-xs text-white/60 mt-1">Live data</p>
                </div>
              </div>

              {/* Border Glow */}
              <motion.div
                className="absolute inset-0 rounded-xl"
                animate={{
                  boxShadow: [
                    `0 0 20px rgba(59, 130, 246, ${0.2 * intensity})`,
                    `0 0 40px rgba(168, 85, 247, ${0.3 * intensity})`,
                    `0 0 20px rgba(59, 130, 246, ${0.2 * intensity})`,
                  ],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>
          </motion.div>
        );
      })}

      {/* Floating Orbs Background */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"
        animate={{
          y: [0, 20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Accent Line */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};
