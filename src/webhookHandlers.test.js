import resolver from './webhookHandlers';

describe('Webhook Handlers', () => {
  it('should handle issue-created event', async () => {
    const payload = { issue: { id: '1', key: 'TEST-1' } };
    const consoleSpy = jest.spyOn(console, 'log');
    await resolver.get('issue-created')({ payload });
    expect(consoleSpy).toHaveBeenCalledWith('Issue created:', payload);
    consoleSpy.mockRestore();
  });

  it('should handle issue-updated event', async () => {
    const payload = { issue: { id: '1', key: 'TEST-1' } };
    const consoleSpy = jest.spyOn(console, 'log');
    await resolver.get('issue-updated')({ payload });
    expect(consoleSpy).toHaveBeenCalledWith('Issue updated:', payload);
    consoleSpy.mockRestore();
  });

  it('should handle issue-deleted event', async () => {
    const payload = { issue: { id: '1', key: 'TEST-1' } };
    const consoleSpy = jest.spyOn(console, 'log');
    await resolver.get('issue-deleted')({ payload });
    expect(consoleSpy).toHaveBeenCalledWith('Issue deleted:', payload);
    consoleSpy.mockRestore();
  });
});
