export function loadRazorpay() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => reject(new Error('Failed to load Razorpay'))
    document.body.appendChild(script)
  })
}

export async function openRazorpayCheckout(options) {
  await loadRazorpay()
  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', (resp) => reject(resp))
    rzp.open()
  })
}


