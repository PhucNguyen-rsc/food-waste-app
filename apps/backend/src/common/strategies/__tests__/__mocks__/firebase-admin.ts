export const mockVerifyIdToken = jest.fn();

export const mockAuth = {
  verifyIdToken: mockVerifyIdToken,
};

export default {
  auth: jest.fn(() => mockAuth),
}; 