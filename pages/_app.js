import '@/lib/i18n';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/globals.css';
import { Suspense } from 'react';

export default function App({ Component, pageProps }) {
  return (
    <Suspense fallback={<div className="d-flex justify-content-center mt-5">
      <div className="spinner-border text-primary" role="status" />
    </div>}>
      <Component {...pageProps} />
    </Suspense>
  );
}