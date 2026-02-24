import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axiosInstance";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function CheckoutForm({ orderId }) {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await axios.post("/payment/create-intent", { orderId });
        const { clientSecret } = res.data;
        await stripe.confirmCardPayment(clientSecret, { payment_method: { card: elements.getElement(CardElement) } });
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit">Pay Now</button>
        </form>
    );
}

function CustomerOrder() {
    const { qrToken } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        axios.get(`/qr/product/${qrToken}`).then(res => setProduct(res.data));
    }, [qrToken]);

    if (!product) return <p>Loading...</p>;

    return (
        <div>
            <h1>{product.name}</h1>
            <p>${product.price}</p>
            <Elements stripe={stripePromise}>
                <CheckoutForm orderId={product.id} />
            </Elements>
        </div>
    );
}

export default CustomerOrder;
