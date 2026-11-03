(() => {
    const form = document.getElementById('campus-visit-form');
    const dateInput = document.getElementById('visit-date');
    const timeInput = document.getElementById('visit-time');
    const successMessage = document.getElementById('visit-success');

    if (!(form instanceof HTMLFormElement) || !(dateInput instanceof HTMLInputElement) || !(timeInput instanceof HTMLInputElement)) {
        return;
    }

    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
    dateInput.min = localDate;

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        timeInput.setCustomValidity('');
        if (!form.reportValidity()) return;

        const time = timeInput.value;
        if (time < '09:00' || time > '12:00') {
            timeInput.setCustomValidity('Choose a visit time between 9:00 AM and 12:00 PM.');
            timeInput.reportValidity();
            return;
        }

        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending...';
        submitButton.disabled = true;

        const formData = new FormData(form);

        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        })
        .then(response => {
            if (response.ok) {
                successMessage.classList.remove('hidden');
                form.reset();
                successMessage.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => {
                    successMessage.classList.add('hidden');
                }, 6000);
            } else {
                alert('There was an error submitting your request. Please try again.');
            }
        })
        .catch(error => {
            alert('There was an error submitting your request. Please try again.');
            console.error('Form submission error:', error);
        })
        .finally(() => {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        });
    });
})();
