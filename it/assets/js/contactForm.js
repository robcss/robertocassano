(function () {
    "use strict";

    let forms = document.querySelectorAll('.email-form');

    forms.forEach(function (e) {
        e.addEventListener('submit', function (event) {
            event.preventDefault();

            const thisForm = this;

            const action = thisForm.getAttribute('action');

            if (!action) {
                displayError(thisForm, 'The form action property is not set!')
                return;
            }

            thisForm.querySelector('.loading').classList.add('d-block');
            thisForm.querySelector('.error-message').classList.remove('d-block');
            thisForm.querySelector('.sent-message').classList.remove('d-block');

            const formData = new FormData(thisForm);

            fetch(action, {
                method: thisForm.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    throw new Error(`${response.status} ${response.statusText} ${response.url}`);
                }
            }).then(data => {
                thisForm.querySelector('.loading').classList.remove('d-block');
                if (data.ok) {
                    thisForm.querySelector('.sent-message').classList.add('d-block');
                    thisForm.reset();
                } else {
                    throw new Error(data ? "Error while sending message" : 'Form submission failed and no error message returned from: ' + action);
                }
            }).catch((error) => {
                displayError(thisForm, error);
            });
        });
    })

    function displayError(thisForm, error) {
        thisForm.querySelector('.loading').classList.remove('d-block');
        thisForm.querySelector('.error-message').innerHTML = error;
        thisForm.querySelector('.error-message').classList.add('d-block');
    }

})();
