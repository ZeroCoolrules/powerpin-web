"use client" 

 

export function ManageBilling({ customerId }: { customerId: string }) { 

  async function openPortal() { 

    const res = await fetch("/api/portal", { 

      method: "POST", 

      body: JSON.stringify({ customerId }), 

    }) 

    const data = await res.json() 

    window.location.href = data.url 

  } 

 

  return <button onClick={openPortal}>Manage Billing</button> 

} 