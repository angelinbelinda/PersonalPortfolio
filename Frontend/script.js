// ==========================================
// MOBILE MENU
// ==========================================

function toggleMenu() {

    const navLinks = document.querySelector(".nav-links");

    if (navLinks) {
        navLinks.classList.toggle("active");
    }

}


// ==========================================
// PROJECT BUTTON
// ==========================================

function showProjectMessage(projectName) {

    if (projectName === "AI Language Translator") {

        window.open(
            "https://github.com/angelinbelinda/CodeAlpha_AI_Language_Translation_Tool",
            "_blank"
        );

    }

    else if (projectName === "AI FAQ Chatbot") {

        window.open(
            "https://github.com/angelinbelinda/CodeAlpha_FAQ_Chatbot",
            "_blank"
        );

    }

}


// ==========================================
// CONTACT FORM
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const contactForm = document.getElementById("contactForm");

    if (!contactForm) {
        console.error("Contact form not found!");
        return;
    }

    contactForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const message =
            document.getElementById("message").value.trim();


        if (!name || !email || !message) {

            alert("Please fill in all fields.");

            return;
        }


        const submitButton =
            contactForm.querySelector(
                'button[type="submit"]'
            );


        if (submitButton) {

            submitButton.disabled = true;

            submitButton.textContent = "Sending...";

        }


        try {

            console.log(
                "Sending contact message..."
            );


            const response = await fetch(
                "http://127.0.0.1:5000/api/contact",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        name: name,

                        email: email,

                        message: message

                    })
                }
            );


            console.log(
                "Server response:",
                response.status
            );


            const data = await response.json();


            console.log(
                "Server data:",
                data
            );


            if (response.ok && data.success) {

                alert(
                    "✅ " + data.message
                );

                contactForm.reset();

            }

            else {

                alert(
                    "❌ " +
                    (data.message ||
                    "Something went wrong.")
                );

            }

        }

        catch (error) {

            console.error(
                "Connection error:",
                error
            );


            alert(
                "❌ Unable to connect to the server.\n\n" +
                "Please make sure the Node.js server is running."
            );

        }


        finally {

            if (submitButton) {

                submitButton.disabled = false;

                submitButton.textContent =
                    "Send Message";

            }

        }

    });

});