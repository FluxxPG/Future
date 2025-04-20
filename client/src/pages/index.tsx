import { Helmet } from 'react-helmet';
import LandingPage from "@/components/landing";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>FluxPay - Dynamic and Seamless Transactions</title>
        <meta name="description" content="The AI-powered payment gateway that streamlines your transactions and supercharges your business growth." />
      </Helmet>
      <LandingPage />
    </>
  );
}
