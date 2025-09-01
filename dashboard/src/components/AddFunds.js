import { useState } from 'react';
import API from '../api';
export default function AddFunds() {
  const [amount, setAmount] = useState('100');
  const [loading, setLoading] = useState(false);
  const pay = async () => {
    setLoading(true);
    try {
      const res = await API.post('/payment/charge', { amount: Number(amount) });
      alert('Payment simulated: ' + JSON.stringify(res.data));
    } catch (err) { alert('Payment failed'); }
    setLoading(false);
  };
  return (
    <div style={{padding:12}}>
      <h3>Add Funds</h3>
      <input value={amount} onChange={e=>setAmount(e.target.value)} />
      <button onClick={pay} disabled={loading}>{loading ? 'Processing...' : 'Pay (Simulated)'}</button>
    </div>
  );
}
