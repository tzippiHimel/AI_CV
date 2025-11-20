import { useState } from 'react';
import './App.css';

function App() {
  const [cvFile, setCvFile] = useState(null);
  const [jobListing, setJobListing] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState('');
  const [pdfFilename, setPdfFilename] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setCvFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setCvFile(e.dataTransfer.files[0]);
    }
  };

  const analyzeCV = async () => {
    if (!cvFile || !jobListing) {
      alert('Please upload your CV and enter the job description');
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('cv', cvFile);
      formData.append('jobDescription', jobListing);

      const res = await fetch('/api/optimize-for-job', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      setResults(data.analysis);
      setPdfFilename(data.pdfFilename);
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to analyze CV. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!pdfFilename) return;
    
    // Create a temporary link element to trigger download
    const link = document.createElement('a');
    link.href = `/api/download/${pdfFilename}`;
    link.download = pdfFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="app">
      <div className="background-animation"></div>
      
      <header className="header">
        <div className="logo">
          <div className="logo-icon">📄</div>
          <h1>AI CV Optimizer</h1>
        </div>
        <p className="subtitle">Transform your CV with AI-powered optimization</p>
      </header>

      <main className="main-content">
        <div className="upload-section">
          <div 
            className={`file-drop-zone ${dragActive ? 'drag-active' : ''} ${cvFile ? 'has-file' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              accept="application/pdf" 
              onChange={handleFileUpload}
              className="file-input-hidden"
              id="cv-upload"
            />
            <label htmlFor="cv-upload" className="file-drop-content">
              {cvFile ? (
                <div className="file-selected">
                  <div className="file-icon">✓</div>
                  <span className="file-name">{cvFile.name}</span>
                  <span className="file-size">{(cvFile.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              ) : (
                <div className="file-placeholder">
                  <div className="upload-icon">📁</div>
                  <h3>Drop your CV here</h3>
                  <p>or click to browse files</p>
                  <span className="file-format">PDF files only</span>
                </div>
              )}
            </label>
          </div>
        </div>

        <div className="job-section">
          <div className="input-group">
            <label htmlFor="job-description" className="input-label">
              <span className="label-icon">💼</span>
              Job Description
            </label>
            <textarea
              id="job-description"
              className="job-textarea"
              placeholder="Paste the job description here...\n\nInclude requirements, responsibilities, and desired skills to get the best optimization results."
              value={jobListing}
              onChange={(e) => setJobListing(e.target.value)}
              rows={8}
            />
          </div>
        </div>

        <div className="action-section">
          <button 
            className={`analyze-btn ${loading ? 'loading' : ''}`}
            onClick={analyzeCV}
            disabled={loading || !cvFile || !jobListing}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <span className="btn-icon">🚀</span>
                <span>Optimize My CV</span>
              </>
            )}
          </button>
        </div>

        {results && (
          <div className="results-section">
            <div className="results-header">
              <h2>
                <span className="results-icon">📊</span>
                Analysis Results
              </h2>
            </div>
            <div className="results-content">
              <pre className="analysis-text">{results}</pre>
            </div>
            <div className="results-actions">
              <button className="download-btn" onClick={downloadPDF}>
                <span className="btn-icon">⬇️</span>
                Download Optimized CV
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Powered by AI • Made with ❤️</p>
      </footer>
    </div>
  );
}

export default App;
