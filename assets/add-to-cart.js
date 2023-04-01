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

function attachRemoveItemListeners() {
  document.querySelectorAll('.remove-item-btn').forEach((btn) =>
    btn.addEventListener('click', async (event) => {
      const cartItemId = event.target.getAttribute('data-cart-item-id');
      const productVariantId = event.target.getAttribute('data-product-variant-id');

      await removeCartItem(cartItemId, productVariantId);
      
      // Update the cart drawer after removing an item
      await updateCartDrawer();
      
      // Update the total number of items in the cart badge
      const cartBadge = document.querySelector('#cart-items-badge');
      
      if (cartBadge) {
        const updatedCount = Number(cartBadge.innerHTML) - 1;
        cartBadge.innerHTML = updatedCount;
      }
    })
  );
}

async function removeCartItem(cartItemId, productVariantId) {
  // Get the remove button and spinner elements for this cartItemId
  const removeButton = document.querySelector(`[data-cart-item-id="${cartItemId}"]`);
  const spinner = document.querySelector(`[data-spinner-id="${cartItemId}"]`);

  try {
    // Hide the remove button and show the spinner
    if (removeButton) {
      removeButton.style.display = 'none';
    }
    if (spinner) {
      spinner.style.display = 'block';
    }

    const response = await youcanjs.cart.removeItem({
      cartItemId,
      productVariantId,
    });

    // Handle successful removal of the item from the cart
    // e.g., update UI, show a success message, etc.

  } catch (error) {
    // Handle errors while removing the item from the cart
    // e.g., show an error message
    console.error('Error removing item from cart:', error);
  } finally {
    // Hide only spinner and do not display remove button again
    if (spinner) {
      spinner.style.display = 'none';
      
      // Update Cart Drawer to reflect changes in UI
      updateCartDrawer();
      
     }
   }
}


async function updateCartDrawer() {
  console.log('Updating cart drawer');

  try {
    const cartData = await youcanjs.cart.fetch();
    console.log(cartData);
// Handle closing the cart drawer when clicking on the close button
document.querySelector('.cart-drawer__close').addEventListener('click', toggleCartDrawer);
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
    
        // Add a remove button to each cart item
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add('remove-item-btn');
        removeButton.setAttribute('data-cart-item-id', item.id);
        removeButton.setAttribute('data-product-variant-id', item.productVariant.id);
        
        // Add a spinner element (hidden by default) to each cart item
    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    spinner.setAttribute('data-spinner-id', item.id);
    spinner.style.display = 'none';

    li.appendChild(removeButton);
    li.appendChild(spinner);  // Add the spinner element here

    ul.appendChild(li);
      }
    
      cartDrawerContent.appendChild(ul);
    
      // Attach event listeners to the newly added remove buttons
      attachRemoveItemListeners();
    

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

// Handle closing the cart drawer when clicking outside of it
document.addEventListener('click', (event) => {
  const cartDrawer = document.querySelector('.cart-drawer');
  
  if (event.target.closest('.cart-drawer')) return; // Click inside the cart drawer, do nothing
  
  if (event.target.closest('.add-to-cart')) return; // Click on add-to-cart button, do nothing

  
   if (cartDrawer.classList.contains('open')) {
    toggleCartDrawer(); // Close the cart drawer
   }
});

document.addEventListener('DOMContentLoaded', async () => {
  // Attach click event listener to the navbar cart icon
  document.querySelector('#navbar-cart-icon').addEventListener('click', toggleCartDrawer);

  // Attach click event listener to the cart drawer close button
  document.querySelector('.cart-drawer__close').addEventListener('click', toggleCartDrawer);

  // Update Cart Drawer on page load
  await updateCartDrawer();

  // Other code that depends on elements being available in the DOM
});

