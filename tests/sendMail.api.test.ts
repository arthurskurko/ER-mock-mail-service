import { describe, it, expect, beforeEach } from 'vitest';
import { POST } from '../src/routes/v1.0/me/sendMail/+server';

class MockRequest {
  constructor(private body: any) {}
  async json() {
    return this.body;
  }
}

class FakeRepo {
  rows: any[] = [];
  async insertEmail(row: any) {
    this.rows.push(row);
    return row;
  }
}

// Mock the database module
let mockRepo: FakeRepo;
vi.mock('$lib/server/db', () => ({
  getDb: () => null
}));

vi.mock('$lib/server/mailRepo', () => ({
  MailRepo: class {
    async insertEmail(row: any) {
      return mockRepo.insertEmail(row);
    }
  }
}));

describe('Send Mail API - Input Validation', () => {
  beforeEach(() => {
    mockRepo = new FakeRepo();
  });

  it('should accept valid email with recipient name', async () => {
    const request = new MockRequest({
      message: {
        subject: 'Test Subject',
        body: { contentType: 'Text', content: 'Test body' },
        toRecipients: [{ emailAddress: { address: 'test@example.com', name: 'Test User' } }]
      },
      saveToSentItems: true
    });

    const response = await POST({ request, platform: undefined } as any);
    
    expect(response.status).toBe(202);
    expect(mockRepo.rows.length).toBe(1);
    expect(mockRepo.rows[0].to_name).toBe('Test User');
  });

  it('should accept valid email without recipient name', async () => {
    const request = new MockRequest({
      message: {
        subject: 'Test Subject',
        body: { contentType: 'Text', content: 'Test body' },
        toRecipients: [{ emailAddress: { address: 'test@example.com' } }]
      },
      saveToSentItems: true
    });

    const response = await POST({ request, platform: undefined } as any);
    
    expect(response.status).toBe(202);
    expect(mockRepo.rows.length).toBe(1);
    expect(mockRepo.rows[0].to_name).toBe('test@example.com');
  });

  it('should accept multiple recipients with mixed names', async () => {
    const request = new MockRequest({
      message: {
        subject: 'Test Subject',
        body: { contentType: 'Text', content: 'Test body' },
        toRecipients: [
          { emailAddress: { address: 'user1@example.com', name: 'User One' } },
          { emailAddress: { address: 'user2@example.com' } }
        ]
      },
      saveToSentItems: true
    });

    const response = await POST({ request, platform: undefined } as any);
    
    expect(response.status).toBe(202);
    expect(mockRepo.rows[0].to_name).toBe('User One, user2@example.com');
  });

  it('should reject missing subject', async () => {
    const request = new MockRequest({
      message: {
        body: { contentType: 'Text', content: 'Test body' },
        toRecipients: [{ emailAddress: { address: 'test@example.com' } }]
      }
    });

    const response = await POST({ request, platform: undefined } as any);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it('should reject missing body', async () => {
    const request = new MockRequest({
      message: {
        subject: 'Test',
        toRecipients: [{ emailAddress: { address: 'test@example.com' } }]
      }
    });

    const response = await POST({ request, platform: undefined } as any);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it('should reject missing recipients', async () => {
    const request = new MockRequest({
      message: {
        subject: 'Test',
        body: { contentType: 'Text', content: 'Test body' }
      }
    });

    const response = await POST({ request, platform: undefined } as any);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error).toContain('Invalid request body');
  });

  it('should reject empty recipient address', async () => {
    const request = new MockRequest({
      message: {
        subject: 'Test',
        body: { contentType: 'Text', content: 'Test body' },
        toRecipients: [{ emailAddress: { address: '', name: 'Test' } }]
      }
    });

    const response = await POST({ request, platform: undefined } as any);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it('should reject invalid JSON', async () => {
    const request = {
      async json() {
        throw new Error('Invalid JSON');
      }
    };

    const response = await POST({ request, platform: undefined } as any);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid JSON');
  });

  it('should handle HTML content type', async () => {
    const request = new MockRequest({
      message: {
        subject: 'HTML Email',
        body: { contentType: 'HTML', content: '<p>Test</p>' },
        toRecipients: [{ emailAddress: { address: 'test@example.com', name: 'Test' } }]
      },
      saveToSentItems: false
    });

    const response = await POST({ request, platform: undefined } as any);
    
    expect(response.status).toBe(202);
    expect(mockRepo.rows[0].body_content_type).toBe('HTML');
    expect(mockRepo.rows[0].save_to_sent).toBe(0);
  });

  it('should store CC recipients when provided', async () => {
    const request = new MockRequest({
      message: {
        subject: 'Test with CC',
        body: { contentType: 'Text', content: 'Test' },
        toRecipients: [{ emailAddress: { address: 'to@example.com' } }],
        ccRecipients: [{ emailAddress: { address: 'cc@example.com', name: 'CC User' } }]
      },
      saveToSentItems: true
    });

    const response = await POST({ request, platform: undefined } as any);
    
    expect(response.status).toBe(202);
    expect(mockRepo.rows[0].cc_json).toBeDefined();
    const ccData = JSON.parse(mockRepo.rows[0].cc_json);
    expect(ccData[0].address).toBe('cc@example.com');
  });

  it('should store BCC recipients when provided', async () => {
    const request = new MockRequest({
      message: {
        subject: 'Test with BCC',
        body: { contentType: 'Text', content: 'Test' },
        toRecipients: [{ emailAddress: { address: 'to@example.com' } }],
        bccRecipients: [{ emailAddress: { address: 'bcc@example.com' } }]
      },
      saveToSentItems: true
    });

    const response = await POST({ request, platform: undefined } as any);
    
    expect(response.status).toBe(202);
    expect(mockRepo.rows[0].bcc_json).toBeDefined();
  });

  it('should return location header on success', async () => {
    const request = new MockRequest({
      message: {
        subject: 'Test',
        body: { contentType: 'Text', content: 'Test' },
        toRecipients: [{ emailAddress: { address: 'test@example.com' } }]
      },
      saveToSentItems: true
    });

    const response = await POST({ request, platform: undefined } as any);
    const location = response.headers.get('Location');
    
    expect(response.status).toBe(202);
    expect(location).toMatch(/^\/mails\/.+/);
  });
});
