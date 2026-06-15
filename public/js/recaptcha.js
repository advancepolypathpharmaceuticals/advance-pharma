function attachRecaptcha(formId, actionName) {

    const form = document.getElementById(formId);

    if (!form) return;

    form.addEventListener("submit", function(e) {

        e.preventDefault();

        grecaptcha.ready(function() {

            grecaptcha.execute(
                "6LcmCQ4tAAAAAEFDRP4OBVuOIptLKJkUUmKpBtmL",
                {
                    action: actionName
                }
            ).then(function(token) {

                let input = form.querySelector(
                    "[name='recaptchaToken']"
                );

                if (!input) {

                    input = document.createElement("input");

                    input.type = "hidden";
                    input.name = "recaptchaToken";

                    form.appendChild(input);
                }

                input.value = token;

                form.submit();
            });

        });

    });

}