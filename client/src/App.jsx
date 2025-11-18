import { useState } from 'react';
import './App.css'; // נניח שיש קובץ CSS נפרד

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

    const formData = new FormData();
    formData.append('cv', cvFile);
    formData.append('jobDescription', jobListing);

    const res = await fetch('http://localhost:3001/api/optimize-for-job', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    setResults(data.analysis);
    setPdfFilename(data.pdfFilename);
    setLoading(false);
  };

  const downloadPDF = () => {
    window.open(`http://localhost:3001/api/download/${pdfFilename}`);
  };

  return (
    <div className="app-container">
      <h1>CV Optimizer</h1>
      <div className="card">
        <input type="file" accept="application/pdf" onChange={handleFileUpload} className="file-input" />
        <textarea
          placeholder="Job description"
          value={jobListing}
          onChange={(e) => setJobListing(e.target.value)}
          className="job-textarea"
        />
        <button onClick={analyzeCV} className="btn">
          Analyze CV
        </button>
        {loading && <div className="loader"></div>}
      </div>

      {results && (
        <div className="results-card">
          <h3>Analysis & Suggestions:</h3>
          <pre className="results">{results}</pre>
          <button onClick={downloadPDF} className="btn download-btn">
            Download Improved PDF
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
