<script lang="ts">
  export let data: { mail: any };
  const to = JSON.parse(data.mail.to_json).map((x:any)=>x.address).join(', ');
  const cc = data.mail.cc_json ? JSON.parse(data.mail.cc_json).map((x:any)=>x.address).join(', ') : '';
  const bcc = data.mail.bcc_json ? JSON.parse(data.mail.bcc_json).map((x:any)=>x.address).join(', ') : '';
</script>

<a class="text-sm underline" href="/mails">← Back</a>

<div class="card mt-4 space-y-3">
  <div class="text-sm text-gray-600">{new Date(data.mail.created_at).toLocaleString()}</div>
  <div><span class="font-medium">To:</span> {to}</div>
  {#if cc}<div><span class="font-medium">Cc:</span> {cc}</div>{/if}
  {#if bcc}<div><span class="font-medium">Bcc:</span> {bcc}</div>{/if}
  <div><span class="font-medium">Subject:</span> {data.mail.subject || '(no subject)'}</div>

  <div>
    <div class="font-medium mb-2">Body ({data.mail.body_content_type || 'Text'})</div>
    <pre class="whitespace-pre-wrap rounded-lg bg-gray-50 p-3 text-sm">{data.mail.body_content || ''}</pre>
  </div>

  <details>
    <summary class="cursor-pointer font-medium">Raw request JSON</summary>
    <pre class="mt-2 whitespace-pre-wrap rounded-lg bg-gray-50 p-3 text-xs">{data.mail.raw_request_json}</pre>
  </details>
</div>
