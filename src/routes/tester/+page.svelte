<script lang="ts">
  let endpoint = '/v1.0/me/sendMail';
  let subject = 'Hello from Mock Graph';
  let body = 'This is a test email.';
  let toAddress = 'test@example.com';
  let toName = 'Test';
  let requestBody = JSON.stringify({
    message: {
      subject: "Hello from Mock Graph",
      body: { contentType: "Text", content: "This is a test email." },
      toRecipients: [{ emailAddress: { address: "test@example.com", name: "Test" } }]
    },
    saveToSentItems: true
  }, null, 2);

  let responseStatus: number | null = null;
  let responseHeaders: Record<string, string> = {};
  let responseBody = '';
  let loading = false;

  async function send() {
    loading = true;
    responseStatus = null;
    responseHeaders = {};
    responseBody = '';
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

  async function sendEmail() {
    requestBody = JSON.stringify({
      message: {
        subject,
        body: { contentType: 'Text', content: body },
        toRecipients: [{ emailAddress: { address: toAddress, name: toName } }]
      },
      saveToSentItems: true
    }, null, 2);

    await send();
  }
</script>

<h1 class="text-xl font-semibold mb-4">API Tester</h1>

<div class="grid gap-4 lg:grid-cols-2">
  <div class="card">
    <div class="card-title mb-2">Request</div>

    <label class="text-xs text-gray-600">Endpoint</label>
    <input class="input mt-1 mb-3" bind:value={endpoint} />

    <label class="text-xs text-gray-600">JSON Body</label>
    <textarea class="textarea mt-1 min-h-[360px]" bind:value={requestBody}></textarea>

    <button class="btn btn-primary mt-3" disabled={loading} on:click={send}>
      {loading ? 'Sending…' : 'Send'}
    </button>
  </div>

  <div class="card">
    <div class="card-title mb-2">Response</div>

    {#if responseStatus !== null}
      <div class="text-sm"><span class="font-medium">Status:</span> {responseStatus}</div>
      <div class="mt-2 text-xs text-gray-600 font-medium">Headers</div>
      <pre class="mt-1 whitespace-pre-wrap rounded-lg bg-gray-50 p-3 text-xs">{JSON.stringify(responseHeaders, null, 2)}</pre>
    {/if}

    <div class="mt-2 text-xs text-gray-600 font-medium">Body</div>
    <pre class="mt-1 whitespace-pre-wrap rounded-lg bg-gray-50 p-3 text-xs">{responseBody}</pre>
  </div>
</div>

<form class="card mt-4" on:submit|preventDefault={sendEmail}>
  <div class="card-title mb-2">Quick Send</div>

  <label class="text-xs text-gray-600">To</label>
  <div class="grid gap-2 sm:grid-cols-2 mt-1">
    <input class="input" type="text" placeholder="Email address" bind:value={toAddress} required />
    <input class="input" type="text" placeholder="Name" bind:value={toName} />
  </div>

  <label class="text-xs text-gray-600 mt-3">Subject</label>
  <input class="input mt-1" type="text" placeholder="Subject" bind:value={subject} required />

  <label class="text-xs text-gray-600 mt-3">Body</label>
  <textarea class="textarea mt-1" placeholder="Body" bind:value={body} required></textarea>

  <button class="btn btn-primary mt-3" type="submit" disabled={loading}>
    {loading ? 'Sending…' : 'Send Email'}
  </button>
</form>
