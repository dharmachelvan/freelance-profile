const EMAILJS_PUBLIC_KEY = "OWHcwmYtQpIOisGnQ";
const EMAILJS_SERVICE_ID = "service_orti5da";
const EMAILJS_TEMPLATE_ID = "template_zd4ka7d";

const projectForm = document.getElementById("projectForm");
const statusMessage = document.getElementById("status");
const emailFallback = document.getElementById("emailFallback");
const submitButton = projectForm.querySelector('button[type="submit"]');
const originalButtonText = submitButton.textContent;
const emailJs = window.emailjs;
let emailJsReady = false;

if (emailJs && typeof emailJs.send === "function") {
  try {
    emailJs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    emailJsReady = true;
  } catch (error) {
    console.error("EmailJS initialization failed:", error);
  }
}

projectForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(projectForm);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const projectType = String(formData.get("project_type") || "");
  const details = String(formData.get("details") || "").trim();
  const templateParams = {
    name,
    email,
    project_type: projectType,
    details,
    message: details,
    from_name: name,
    from_email: email,
    reply_to: email,
  };
  const subject = `Project request from ${name}`;
  const body = [
    "New project request",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Project type: ${projectType}`,
    "",
    "Project details:",
    details,
  ].join("\n");
  const composeUrl = new URL("https://mail.google.com/mail/");
  composeUrl.searchParams.set("view", "cm");
  composeUrl.searchParams.set("fs", "1");
  composeUrl.searchParams.set("to", "dharmachelvanp@gmail.com");
  composeUrl.searchParams.set("su", subject);
  composeUrl.searchParams.set("body", body);

  emailFallback.href = composeUrl.toString();
  emailFallback.hidden = true;

  if (!emailJsReady) {
    statusMessage.textContent =
      "Email sending is unavailable right now. You can prepare your request in Gmail below.";
    emailFallback.hidden = false;
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Sending...";
  statusMessage.textContent = "Sending your project request...";

  try {
    await emailJs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
    );
    statusMessage.textContent =
      "Thanks! Your project request has been sent. I'll be in touch soon.";
    projectForm.reset();
  } catch (error) {
    console.error("EmailJS failed to send the project request:", error);
    statusMessage.textContent =
      "Your request could not be sent. You can prepare it in Gmail below.";
    emailFallback.hidden = false;
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  }
});