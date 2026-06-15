function attachRecaptcha(formId, actionName) {

    const form = document.getElementById(formId);

    if (!form) return;

    form.addEventListener("submit", function(e) {

        console.log("RECAPTCHA SUBMIT:", formId);

        e.preventDefault();

        grecaptcha.ready(function() {

            console.log("RECAPTCHA READY:", formId);

            grecaptcha.execute(
                "6LcmCQ4tAAAAAEFDRP4OBVuOIptLKJkUUmKpBtmL",
                { action: actionName }
            ).then(function(token) {

                console.log("TOKEN GENERATED:", token);

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

                console.log("TOKEN SET:", input.value);

                form.submit();
            });

        });

    });

}
