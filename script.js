// Display Advice
async function displayRandomQuote() {
  // const res = await fetch('https://api.adviceslip.com/advice');
  const response = await fetch('https://proverbs.kajlund.com/api/v1/proverbs/random');
  if (response.ok) {
    const res = await response.json();
    console.log(res);
    document.getElementById("quoteText").textContent = `"${res.data.content}"`
    document.getElementById("quoteAuthor").textContent = res.data.author;
  } else {
    console.error("Failed to fetch quote")
  }
}

// Mobile Menu Toggle
const burgerBtn = document.getElementById("burgerBtn")
const mobileNav = document.getElementById("mobileNav")

burgerBtn.addEventListener("click", () => {
  burgerBtn.classList.toggle("active")
  mobileNav.classList.toggle("active")
})

// Login Dialog
const loginDialog = document.getElementById("loginDialog")
const openLoginBtn = document.getElementById("openLoginBtn")
const openLoginBtnMobile = document.getElementById("openLoginBtnMobile")
const closeDialogBtn = document.getElementById("closeDialogBtn")

function openLoginDialog() {
  loginDialog.classList.add("active")
  document.body.style.overflow = "hidden"
}

function closeLoginDialog() {
  loginDialog.classList.remove("active")
  document.body.style.overflow = ""
}

openLoginBtn.addEventListener("click", openLoginDialog)
openLoginBtnMobile.addEventListener("click", () => {
  openLoginDialog()
  mobileNav.classList.remove("active")
  burgerBtn.classList.remove("active")
})

closeDialogBtn.addEventListener("click", closeLoginDialog)

loginDialog.addEventListener("click", (e) => {
  if (e.target === loginDialog) {
    closeLoginDialog()
  }
})

// Login Form Submission
const loginForm = document.getElementById("loginForm")
const errorMessage = document.getElementById("errorMessage")

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault()

  const email = document.getElementById("email").value
  const password = document.getElementById("password").value
  const submitBtn = loginForm.querySelector(".btn-submit")

  // Clear previous error
  errorMessage.textContent = ""

  // Disable submit button
  submitBtn.disabled = true
  submitBtn.textContent = "Signing in..."

  try {
    const response = await fetch("https://authz.kajlund.com/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      // Important: This tells the browser to include/save the cookies!
      credentials: 'include'
    })

    const res = await response.json()

    if (response.ok) {
      // Store JWT token in localStorage
      localStorage.setItem("access_token", res?.data?.accessToken)

      // Optional: Store user info
      if (res?.data?.user) {
        localStorage.setItem("user_info", JSON.stringify(res.data.user))
      }

      // Success - close dialog and redirect or update UI
      closeLoginDialog()
      loginForm.reset()
      alert("Login successful!")

      // You can redirect to another page or update the UI here
      // window.location.href = '/dashboard';
    } else {
      errorMessage.textContent = data.message || "Invalid email or password"
    }
  } catch (error) {
    console.error("Login error:", error)
    errorMessage.textContent = "An error occurred. Please try again."
  } finally {
    // Re-enable submit button
    submitBtn.disabled = false
    submitBtn.textContent = "Sign In"
  }
})

// Check if user is already logged in
function checkAuth() {
  const token = localStorage.getItem("jwt_token")
  if (token) {
    // User is logged in, you can update UI accordingly
    console.log("User is authenticated")
    // You might want to hide login button and show logout button
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  displayRandomQuote()
  checkAuth()

  // Change quote every 20 seconds
  setInterval(displayRandomQuote, 20000)
})

// Utility function to get JWT token
function getAuthToken() {
  return localStorage.getItem("jwt_token")
}

// Utility function to make authenticated requests
async function authenticatedFetch(url, options = {}) {
  const token = getAuthToken()

  if (!token) {
    throw new Error("No authentication token found")
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  }

  return fetch(url, { ...options, headers })
}

// Export utility functions for use in other scripts
window.getAuthToken = getAuthToken
window.authenticatedFetch = authenticatedFetch
