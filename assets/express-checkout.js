async function placeOrder() {
  const expressCheckoutForm = document.querySelector('#express-checkout-form');
  let fields = Object.fromEntries(new FormData(expressCheckoutForm));

  load('#loading__checkout');
  try {
    const productVariantId = document.getElementById('variantId')?.value;
    const quantity = document.getElementById('quantity')?.value || 1;
    const attachedImage = document.querySelector('#yc-upload-link')?.value;

    if (attachedImage) {
      fields = { ...fields, attachedImage };
    }

    const response = await youcanjs.checkout.placeExpressCheckoutOrder({ productVariantId, quantity, fields });

    response
      .onSuccess((data, redirectToThankyouPage) => {
        redirectToThankyouPage();
      })
      .onValidationErr((err) => {
        displayValidationErrors(err);
      })
      .onSkipShippingStep((data, redirectToShippingPage) => {
        redirectToShippingPage();
      })
      .onSkipPaymentStep((data, redirectToPaymentPage) => {
        redirectToPaymentPage();
      });
  } catch (e) {
    notify(e.message, 'error');
  } finally {
    stopLoad('#loading__checkout');
  }
}

function displayValidationErrors(err) {
  const form = document.querySelector('#express-checkout-form');
  const errorFields = err.meta.fields;

  if (!form || !errorFields) return;

  form.querySelectorAll('.validation-error').forEach(el => el.textContent = '');

  Object.keys(errorFields).forEach((field) => {
    const fieldName = field.startsWith('extra_fields') ? `extra_fields[${field.split('.')[1]}]` : field;
    const formElement = form.querySelector(`[name="${fieldName}"]`);
    const errorEl = form.querySelector(`.validation-error[data-error-for="${fieldName}"]`);

    if (formElement && errorEl) {
      formElement.classList.add('error');
      errorEl.textContent = errorFields[field][0];
      formElement.addEventListener('input', () => {
        formElement.classList.remove('error');
        errorEl.textContent = '';
      });
    } else {
      notify(`Please check the form's structure. ${fieldName}`, 'error');
    }
  });
}

