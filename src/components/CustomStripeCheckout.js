import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

class CustomStripeCheckout extends React.Component {
  async handleClick() {
    const stripe = await loadStripe(this.props.stripeKey);
    const { totalAmount, currency, onToken } = this.props;

    const { error } = await stripe.redirectToCheckout({
      lineItems: [
        { price: totalAmount * 100, quantity: 1 }
      ],
      mode: 'payment',
      successUrl: 'https://your-website.com/success',
      cancelUrl: 'https://your-website.com/cancel',
      currency: currency,
    });

    if (error) {
      console.error("Error:", error);
    } else {
      console.log("Redirecting to checkout...");
    }
  }

  render() {
    return (
      <button onClick={() => this.handleClick()}>
        Checkout
      </button>
    );
  }
}

export default CustomStripeCheckout;
