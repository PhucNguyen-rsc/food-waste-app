module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/*.module.ts',
    '!**/*.dto.ts',
    '!**/*.entity.ts',
    '!**/*.interface.ts',
    '!**/main.ts',
    '!**/prisma/**',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/$1',
    '^@auth/(.*)$': '<rootDir>/modules/auth/$1',
    '^@common/(.*)$': '<rootDir>/common/$1',
    '^@business/(.*)$': '<rootDir>/modules/business/$1',
    '^@consumer/(.*)$': '<rootDir>/modules/consumer/$1',
    '^@courier/(.*)$': '<rootDir>/modules/courier/$1',
    '^@admin/(.*)$': '<rootDir>/modules/admin/$1',
    '^@users/(.*)$': '<rootDir>/modules/users/$1',
    '^@item/(.*)$': '<rootDir>/modules/foodItem/$1',
    '^@guards/(.*)$': '<rootDir>/common/guards/$1',
    '^@decorators/(.*)$': '<rootDir>/common/decorators/$1',
    '^@prisma/(.*)$': '<rootDir>/prisma/$1',
    '^@middleware/(.*)$': '<rootDir>/common/middleware/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}; 