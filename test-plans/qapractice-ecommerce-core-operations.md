# QA Practice E-commerce — Five Core User Operations

## Application Overview

Exploration-based test plan for the QA Practice e-commerce demo at https://www.qapractice.com/practice-ecommerece-website. The storefront offers product search, category filters, price/rating sorting, pagination, product detail pages, quantity controls, an off-canvas cart, shipping-address entry, and payment/order confirmation. Each test begins with a fresh isolated browser state and no cart items; no account or real payment details are required.

## Test Scenarios

### 1. Core e-commerce user operations

**Seed:** `tests\seed.spec.ts`

#### 1.1. Find products using search, category, sort, and pagination

**File:** `tests\ecommerce\find-products.spec.ts`

**Steps:**
  1. Start from the QA Practice home page in a fresh isolated browser session. Select Practice Sites, locate E-commerce Automation, and choose Start practising →.
    - expect: The E-commerce Automation Practice storefront opens with the product listing, search field, category buttons (All, Electronics, Fashion, Beauty, Beverages), sort selector, and product pagination.
  2. Search for “mouse” using the storefront search field.
    - expect: Only products matching the search term are displayed; the product count reflects the filtered results.
  3. Clear the search, select the Fashion category, and inspect the visible product list and count.
    - expect: Only Fashion products are displayed and the result count updates to match the category.
  4. Select “Price: Low to High” from Sort by and compare the displayed product prices in order.
    - expect: The visible products are ordered from lowest price to highest price.
  5. Return to All products if needed, select page 2, then use Previous to return to page 1.
    - expect: A different set of products appears on page 2; Previous is enabled there and returns to the first product page.
  6. Search for a term that does not match any product, then clear the search.
    - expect: No unrelated products are shown; the UI communicates zero matching results or an empty state without breaking the listing. Clearing the search restores products.

#### 1.2. Inspect a product and add a chosen quantity

**File:** `tests\ecommerce\inspect-product-add-to-cart.spec.ts`

**Steps:**
  1. Start at the QA Practice home page in a fresh isolated browser session with an empty cart. Open Practice Sites → E-commerce Automation → Start practising →.
    - expect: The product listing is displayed and the cart badge indicates an empty cart.
  2. Open a product by selecting its image or name (for example, Laptop Pro).
    - expect: A product detail view opens with a Back to products control, product category, name, brand, rating/review count, price, description, quantity field, and Add to Cart action.
  3. Set the quantity to 2 and select Add to Cart.
    - expect: The cart badge reflects the two added units and the selected product remains identifiable in the detail/listing UI.
  4. Return to the product listing and try entering a quantity below 1 for a product.
    - expect: The quantity control enforces its minimum of 1 and does not add a zero or negative quantity.

#### 1.3. Review cart contents, totals, removal, and empty-cart behavior

**File:** `tests\ecommerce\manage-cart.spec.ts`

**Steps:**
  1. Start at the QA Practice home page in a fresh isolated browser session with no cart items. Open the E-commerce Automation storefront.
    - expect: The product listing is available and the cart starts empty.
  2. Set Wireless Mouse quantity to 2 and add it; set Keyboard RGB quantity to 1 and add it. Open the cart using the cart button/badge.
    - expect: The cart dialog lists Wireless Mouse at $25 × 2 and Keyboard RGB at $80 × 1. The total is $130.00 and the badge reflects three units.
  3. Remove Wireless Mouse from the cart.
    - expect: Wireless Mouse is removed, Keyboard RGB remains, and the total recalculates to $80.00.
  4. Remove the remaining item and inspect the cart dialog.
    - expect: The cart shows an empty-cart message and a $0.00 total; Proceed to Buy is disabled.

#### 1.4. Enter and validate a shipping address

**File:** `tests\ecommerce\shipping-address.spec.ts`

**Steps:**
  1. Start at the QA Practice home page in a fresh isolated browser session. Open the E-commerce Automation storefront, add one product, open the cart, and select Proceed to Buy.
    - expect: The Shipping Address step is displayed with Full Name, Street Address, City, State, and ZIP Code fields and a Save Address & Continue to Payment action.
  2. Leave the address fields blank and select Save Address & Continue to Payment.
    - expect: The form rejects the incomplete address with the validation alert/message (observed message: “Please fill in all address fields.”); payment is not advanced to.
  3. Dismiss the alert, populate all five address fields with non-sensitive test data, and save the address.
    - expect: The address is accepted and the checkout advances to the payment step.

#### 1.5. Validate payment details and place an order

**File:** `tests\ecommerce\payment-and-order.spec.ts`

**Steps:**
  1. Start at the QA Practice home page in a fresh isolated browser session. Open the E-commerce Automation storefront, add a product, proceed through the cart, and complete the shipping-address step using dummy test data.
    - expect: The payment step displays Card Number, Expiry Date (MM/YY), and CVV fields plus a Buy Now action.
  2. Submit the payment step with empty or invalid card details.
    - expect: Payment validation errors are shown; the order is not completed and the purchased items remain available for correction.
  3. Enter only demo/test payment values accepted by the practice app (never use real card data) and select Buy Now.
    - expect: An “Order Successful!” confirmation is shown with the purchased item(s); the order is not silently duplicated and the confirmation represents the selected cart contents.
