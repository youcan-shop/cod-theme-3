async function addToCart(snippetId) {
  const parentSection = document.querySelector(`#s-${snippetId}`);

  const variantId = parentSection.querySelector(`#variantId`)?.value || undefined;
  const quantity = parentSection.querySelector(`#quantity`)?.value || 1;
  const uploadedImageLink = parentSection.querySelector(`#yc-upload-link`)?.value || undefined;

  if (!variantId) {
    return notify(ADD_TO_CART_EXPECTED_ERRORS.select_variant, 'error');
  }

  if (quantity < 1) {
    return notify(ADD_TO_CART_EXPECTED_ERRORS.quantity_smaller_than_zero, 'error');
  }

  try {
    load('#loading__cart');

    const response = await youcanjs.cart.addItem({
      productVariantId: variantId,
      attachedImage: uploadedImageLink,
      quantity,
    });

    if (response.error) throw new Error(response.error);

    const cart = document.querySelector('#cart-items-badge');
    const cartDrawer = document.querySelector('.cart-drawer');

    if (cart) {
      let cartBadgeBudge = Number(cart.innerHTML);
      cart.innerHTML = ++cartBadgeBudge;
      
      // Update the cart drawer
      if (cartDrawer) {
        await updateCartDrawer();
      }
    }

    stopLoad('#loading__cart');
    notify(ADD_TO_CART_EXPECTED_ERRORS.product_added, 'success');
    toggleCartDrawer();
  } catch (err) {
    stopLoad('#loading__cart');
    notify(err.message, 'error');
  }
}

async function updateCartDrawer() {
  console.log('Updating cart drawer');

  try {
    const cartData = await youcanjs.cart.fetch();
    console.log(cartData);

    const cartDrawerContent = document.querySelector('.cart-drawer__content');

    if (!cartDrawerContent) {
      console.error('Cart drawer content not found');
      return;
    }

    // Clear existing content
    cartDrawerContent.innerHTML = '';

    // Check if the cart has items
    if (cartData.count > 0) {
      // Create a list of items in the cart
      const ul = document.createElement('ul');

      for (const item of cartData.items) {
        const li = document.createElement('li');
        li.textContent = `${item.productVariant.product.name} - ${item.productVariant.variations.red} - Quantity: ${item.quantity}`;
        ul.appendChild(li);
      }

      cartDrawerContent.appendChild(ul);

    } else {
      const p = document.createElement('p');
      p.textContent = 'Your cart is currently empty.';
      cartDrawerContent.appendChild(p);
    }

  } catch (error) {
    console.error(error);
  }
}

function toggleCartDrawer() {
  const cartDrawer = document.querySelector('.cart-drawer');
  
  if (!cartDrawer) {
    console.error('Cart drawer not found');
    return;
  }

  // Toggle the 'open' class on the cart drawer
  cartDrawer.classList.toggle('open');
}

// Handle closing the cart drawer when clicking on the close button
document.querySelector('.cart-drawer__close').addEventListener('click', toggleCartDrawer);

// Handle closing the cart drawer when clicking outside of it
document.addEventListener('click', (event) => {
  const cartDrawer = document.querySelector('.cart-drawer');
  
  if (event.target.closest('.cart-drawer')) return; // Click inside the cart drawer, do nothing
  
  if (event.target.closest('.add-to-cart')) return; // Click on add-to-cart button, do nothing

  
   if (cartDrawer.classList.contains('open')) {
    toggleCartDrawer(); // Close the cart drawer
   }
});
