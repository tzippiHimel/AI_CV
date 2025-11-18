import { useState } from 'react';
import './App.css';

function App() {
  const [cvFile, setCvFile] = useState(null);
  const [jobListing, setJobListing] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState('');
  const [pdfFilename, setPdfFilename] = useState('');

  const handleFileUpload = (e) => setCvFile(e.target.files[0]);

  const analyzeCV = async () => {
    if (!cvFile || !jobListing) return alert('Upload CV and enter job description');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('cv', cvFile);
      formData.append('jobDescription', jobListing);

      const res = await fetch('/api/optimize-for-job', { // כאן אנחנו משתמשים ב-proxy
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      setResults(data.analysis);
      setPdfFilename(data.pdfFilename);
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to analyze CV');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!pdfFilename) return;
    window.open(`/api/download/${pdfFilename}`);
  };

  return (
    <div className="app-container">
      <h1>CV Optimizer</h1>
      <div className="card">
        <input type="file" accept="application/pdf" onChange={handleFileUpload} />
        <textarea
          placeholder="Job description"
          value={jobListing}
          onChange={(e) => setJobListing(e.target.value)}
        />
        <button onClick={analyzeCV}>Analyze CV</button>
        {loading && <div>Loading...</div>}
      </div>

      {results && (
        <div className="results-card">
          <h3>Analysis & Suggestions:</h3>
          <pre>{results}</pre>
          <button onClick={downloadPDF}>Download Improved PDF</button>
        </div>
      )}
    </div>
  );
}

export default App;
