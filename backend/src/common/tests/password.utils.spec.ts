import { hashPassword, comparePassword } from '../utils/password.utils';

describe('Password Utils', () => {
  describe('hashPassword', () => {
    it('should hash a password and return a different string', async () => {
      const password = 'test123456';
      const hash = await hashPassword(password);

      expect(hash).not.toBe(password);
      expect(hash.startsWith('$2')).toBe(true);
    });

    it('should produce different hashes for the same password', async () => {
      const hash1 = await hashPassword('test123');
      const hash2 = await hashPassword('test123');

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    it('should return true for correct password', async () => {
      const hash = await hashPassword('correct');
      const result = await comparePassword('correct', hash);

      expect(result).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const hash = await hashPassword('correct');
      const result = await comparePassword('wrong', hash);

      expect(result).toBe(false);
    });
  });
});
