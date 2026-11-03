(() => {
    const showMessage = (form, message, isError) => {
        let feedback = form.querySelector('[data-form-feedback]');
        if (!feedback) {
            feedback = document.createElement('p');
            feedback.dataset.formFeedback = '';
            feedback.className = 'mt-4 rounded-lg px-4 py-3';
            feedback.setAttribute('aria-live', 'polite');
            form.append(feedback);
        }
        feedback.textContent = message;
        feedback.classList.toggle('bg-red-100', isError);
        feedback.classList.toggle('text-red-800', isError);
        feedback.classList.toggle('bg-green-100', !isError);
        feedback.classList.toggle('text-green-800', !isError);
    };

    document.addEventListener('submit', async (event) => {
        const form = event.target;
        if (!(form instanceof HTMLFormElement) || !form.action.includes('formspree.io')) return;

        event.preventDefault();
        event.stopImmediatePropagation();

        if (form.id === 'campus-visit-form') {
            const visitDate = form.querySelector('#visit-date');
            const visitTime = form.querySelector('#visit-time');
            if (visitDate instanceof HTMLInputElement && visitDate.value) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const selectedDate = new Date(`${visitDate.value}T00:00:00`);
                if (selectedDate < today) {
                    visitDate.setCustomValidity('Choose today or a future date.');
                } else {
                    visitDate.setCustomValidity('');
                }
            }
            if (visitTime instanceof HTMLInputElement && visitTime.value) {
                visitTime.setCustomValidity(
                    visitTime.value < '09:00' || visitTime.value > '12:00'
                        ? 'Choose a visit time between 9:00 AM and 12:00 PM.'
                        : ''
                );
            }
        }

        if (!form.reportValidity()) return;

        const button = form.querySelector('button[type="submit"], input[type="submit"]');
        const originalLabel = button instanceof HTMLButtonElement ? button.innerHTML : '';
        if (button instanceof HTMLButtonElement) {
            button.disabled = true;
            button.textContent = 'Sending…';
        }

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' }
            });
            if (!response.ok) {
                throw new Error(`Form submission failed with status ${response.status}.`);
            }
            showMessage(form, 'Thank you. Your message has been sent successfully.', false);
            form.reset();
        } catch (error) {
            console.error('Form submission error:', error);
            showMessage(
                form,
                'We could not send your message. Please try again or contact the school by phone or email.',
                true
            );
        } finally {
            if (button instanceof HTMLButtonElement) {
                button.disabled = false;
                button.innerHTML = originalLabel;
            }
        }
    }, true);
})();
