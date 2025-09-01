import { useState } from 'react';
import API from '../api';
export default function Notifications() {
  const [form, setForm] = useState({ symbol:'', targetPrice:'', method:'email' });
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const register = async () => {
    try {
      await API.post('/notify/register', { symbol: form.symbol, targetPrice: Number(form.targetPrice), method: form.method });
      alert('Notification registered (demo)');
    } catch (err) { alert('Failed to register'); }
  };
  const testEmail = async () => {
    try {
      await API.post('/notify/test-email', { to: prompt('Send to email:'), subject: 'Test from TradeNest', text: 'This is a test' });
      alert('Test email attempted');
    } catch (err) { alert('Failed to send test email'); }
  };
  return (
    <div style={{padding:12}}>
      <h3>Price Alerts</h3>
      <input name="symbol" placeholder="Symbol" value={form.symbol} onChange={handle} />
      <input name="targetPrice" placeholder="Target Price" value={form.targetPrice} onChange={handle} />
      <select name="method" value={form.method} onChange={handle}>
        <option value="email">Email</option><option value="sms">SMS</option>
      </select>
      <div style={{display:'flex',gap:8,marginTop:8}}>
        <button onClick={register}>Register Alert</button>
        <button onClick={testEmail}>Send Test Email</button>
      </div>
    </div>
  );
}
