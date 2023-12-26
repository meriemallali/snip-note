export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    // Other Jest configurations
    type: 'module',
    transform: {
        '^.+\\.js$': 'babel-jest', 
        '\\.(png|jpg)$': 'jest-transform-stub', 
      },
  };