import API from '../api';

export default function ExportButtons() {
  const download = async (path) => {
    try {
      const res = await API.get(path, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = path.split('/').slice(-1)[0];
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert('Export failed');
    }
  };

  return (
    <div style={{display:'flex', gap:8}}>
      <button onClick={() => download('/export/holdings/csv')}>Download Holdings CSV</button>
      <button onClick={() => download('/export/holdings/pdf')}>Download Holdings PDF</button>
      <button onClick={() => download('/export/orders/csv')}>Download Orders CSV</button>
    </div>
  );
}
