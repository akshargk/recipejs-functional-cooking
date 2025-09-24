const reveals = document.querySelectorAll(".reveal")
const heroText = document.getElementById("hero-text")
const aboutParagraphs = document.querySelectorAll("#about p")
const textContent = "Welcome to My Portfolio"
let charIndex = 0

function revealOnScroll() {
  const windowHeight = window.innerHeight
  const elementVisible = 100

  reveals.forEach((el) => {
    const elementTop = el.getBoundingClientRect().top
    const elementBottom = el.getBoundingClientRect().bottom

    if (elementTop < windowHeight - elementVisible && elementBottom > 0) {
      el.classList.add("active")
    } else {
      el.classList.remove("active")
    }
  })

  aboutParagraphs.forEach((para, index) => {
    const top = para.getBoundingClientRect().top
    const bottom = para.getBoundingClientRect().bottom
    if (top < windowHeight - 50 && bottom > 0) {
      para.style.opacity = 1
      para.style.transform = "translateY(0)"
    } else {
      para.style.opacity = 0
      para.style.transform = "translateY(20px)"
    }
  })
}

function typeText() {
  if (charIndex < textContent.length) {
    heroText.textContent += textContent.charAt(charIndex)
    charIndex++
    setTimeout(typeText, 120)
  }
}

heroText.textContent = ""
typeText()

document.querySelectorAll('nav a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute('href'))
    target.scrollIntoView({ behavior: 'smooth' })
  })
})

window.addEventListener("scroll", revealOnScroll)
window.addEventListener("load", revealOnScroll)
