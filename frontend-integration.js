// 1. Add Supabase JS CDN to your HTML file (before the closing </body> tag)
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

// 2. Add this script to handle the form submission
const supabaseUrl = 'https://dnhkdloztlrhsxisbwbs.supabase.co'
const supabaseKey = 'sb_publishable_25MLRb11MWbpVs87KChnYA_rMXc_BI0'
const supabase = supabase.createClient(supabaseUrl, supabaseKey)

// Replace 'enrollment-form' with the actual ID of your form
const form = document.getElementById('enrollment-form') || document.querySelector('form')

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    // Get form data
    const formData = new FormData(form)
    const data = {
      parent_name: formData.get('parent_name') || document.querySelector('[name="parent_name"]')?.value || document.querySelector('input[placeholder*="Parent"]')?.value,
      email: formData.get('email') || document.querySelector('[name="email"]')?.value,
      phone: formData.get('phone') || document.querySelector('[name="phone"]')?.value,
      child_name: formData.get('child_name') || document.querySelector('[name="child_name"]')?.value || document.querySelector('input[placeholder*="Child"]')?.value,
      program_interest: formData.get('program_interest') || document.querySelector('select')?.value,
      message: formData.get('message') || document.querySelector('textarea')?.value,
      page_url: window.location.href,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      status: 'new'
    }

    // Submit to Supabase
    const { error } = await supabase
      .from('leads')
      .insert([data])

    if (error) {
      console.error('Error submitting form:', error)
      alert('There was an error submitting your inquiry. Please try again.')
    } else {
      alert('Thank you! We have received your inquiry.')
      form.reset()
    }
  })
}
