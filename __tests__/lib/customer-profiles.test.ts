import { getRandomCustomerProfile } from '../../lib/customer-profiles';

describe('getRandomCustomerProfile', () => {
  it('should return a valid customer profile', () => {
    const profile = getRandomCustomerProfile();
    expect(profile).toHaveProperty('name');
    expect(profile).toHaveProperty('avatar');
    expect(profile).toHaveProperty('mood');
    expect(profile).toHaveProperty('difficulty');
    expect(profile).toHaveProperty('issue');
    expect(profile).toHaveProperty('background');
  });
});
