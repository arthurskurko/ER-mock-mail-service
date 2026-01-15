<script lang="ts">
  export let data: { mails: Array<{ id: string; created_at: string; subject: string | null; to_json: string }> };
</script>

<h1 class="text-xl font-semibold mb-4">Sent mails</h1>

{#if data.mails.length === 0}
  <div class="card text-sm text-gray-600">
    No emails yet. Send one from <a class="underline" href="/tester">API Tester</a>.
  </div>
{:else}
  <div class="card p-0 overflow-hidden">
    <table class="table">
      <thead>
        <tr>
          <th class="th">Date</th>
          <th class="th">To</th>
          <th class="th">Subject</th>
        </tr>
      </thead>
      <tbody>
        {#each data.mails as m}
          <tr class="border-t hover:bg-gray-50">
            <td class="td whitespace-nowrap">{new Date(m.created_at).toLocaleString()}</td>
            <td class="td">{JSON.parse(m.to_json).map((x:any)=>x.address).join(', ')}</td>
            <td class="td">
              <a class="underline" href={`/mails/${m.id}`}>{m.subject || '(no subject)'}</a>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}
