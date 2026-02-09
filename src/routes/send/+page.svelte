<script lang="ts">
  let endpoint = '/v1.0/me/sendMail';
  let subject = 'Hello from Mock Graph';
  let body = 'This is a test email.';
  let toAddress = 'test@example.com';
  let toName = 'Test';

  let responseStatus: number | null = null;
  let responseHeaders: Record<string, string> = {};
  let responseBody = '';
  let loading = false;

  async function sendEmail() {
    loading = true;
    responseStatus = null;
    responseHeaders = {};
    responseBody = '';

    const requestBody = JSON.stringify({
      message: {
        subject,
        body: { contentType: 'Text', content: body },
        toRecipients: [{ emailAddress: { address: toAddress, name: toName || undefined } }]
      },
      saveToSentItems: true
    }, null, 2);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: requestBody
      });

      responseStatus = res.status;
      res.headers.forEach((v, k) => (responseHeaders[k] = v));
      const txt = await res.text();
      responseBody = txt || '(empty body)';
    } catch (e: any) {
      responseBody = e?.message ?? String(e);
    } finally {
      loading = false;
    }
  }
</script>

<h1 class="text-xl font-semibold mb-4">Send Email</h1>

<form class="card" on:submit|preventDefault={sendEmail}>
  <label class="text-xs text-gray-600" for="to-address">To</label>
  <div class="grid gap-2 sm:grid-cols-2 mt-1">
    <input id="to-address" class="input" type="email" placeholder="Email address" bind:value={toAddress} required />
    <input id="to-name" class="input" type="text" placeholder="Name" bind:value={toName} />
  </div>

  <label class="text-xs text-gray-600 mt-3" for="subject">Subject</label>
  <input id="subject" class="input mt-1" type="text" placeholder="Subject" bind:value={subject} required />

  <label class="text-xs text-gray-600 mt-3" for="body">Body</label>
  <textarea id="body" class="textarea mt-1" placeholder="Body" bind:value={body} required></textarea>

  <button class="btn btn-primary mt-3" type="submit" disabled={loading}>
    {loading ? 'Sending…' : 'Send Email'}
  </button>
</form>

{#if responseStatus !== null}
  <div class="card mt-4">
    <div class="text-sm"><span class="font-medium">Status:</span> {responseStatus}</div>
    <div class="mt-2 text-xs text-gray-600 font-medium">Headers</div>
    <pre class="mt-1 whitespace-pre-wrap rounded-lg bg-gray-50 p-3 text-xs">{JSON.stringify(responseHeaders, null, 2)}</pre>
    <div class="mt-2 text-xs text-gray-600 font-medium">Body</div>
    <pre class="mt-1 whitespace-pre-wrap rounded-lg bg-gray-50 p-3 text-xs">{responseBody}</pre>
  </div>
{/if}
