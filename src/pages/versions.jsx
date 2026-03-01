import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// Load versions from static JSON file generated at build time
function useVersions() {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('/versions.json')
      .then(res => res.json())
      .then(data => {
        setVersions(data);
        setLoading(false);
      })
      .catch(err => {
        console.warn('Failed to load versions.json:', err);
        setVersions([]);
        setLoading(false);
      });
  }, []);
  
  return { versions, loading };
}

function VersionCard({ version }) {
  return (
    <div style={{
      border: '1px solid var(--ifm-color-emphasis-300)',
      borderRadius: '8px',
      padding: '1.5rem',
      marginBottom: '1rem',
      transition: 'all 0.2s',
      cursor: 'pointer',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = 'var(--ifm-color-primary)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = 'var(--ifm-color-emphasis-300)';
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      <Link
        to={version.path}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>
          Version {version.label}
        </h3>
        <p style={{ marginBottom: 0, color: 'var(--ifm-color-emphasis-700)' }}>
          Container-pinned documentation for {version.label}
        </p>
        <div style={{ marginTop: '1rem' }}>
          <span style={{
            display: 'inline-block',
            padding: '0.25rem 0.75rem',
            backgroundColor: 'var(--ifm-color-primary)',
            color: 'white',
            borderRadius: '4px',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}>
            Browse Docs →
          </span>
        </div>
      </Link>
    </div>
  );
}

export default function Versions() {
  const { siteConfig } = useDocusaurusContext();
  const { versions, loading } = useVersions();
  
  return (
    <Layout
      title="Documentation Versions"
      description="Browse documentation for different versions of Coded Ventures frameworks"
    >
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <h1>Documentation Versions</h1>
            <p>
              Select a version to browse its documentation. Each version folder contains
              container-pinned documentation that was validated with that specific container build.
            </p>
            
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p>Loading versions...</p>
              </div>
            ) : versions.length > 0 ? (
              <div style={{ marginTop: '2rem' }}>
                {versions.map((version) => (
                  <VersionCard
                    key={version.id}
                    version={version}
                  />
                ))}
              </div>
            ) : (
              <div style={{
                padding: '2rem',
                textAlign: 'center',
                backgroundColor: 'var(--ifm-color-emphasis-100)',
                borderRadius: '8px',
                marginTop: '2rem',
              }}>
                <p>No version folders found. Version folders are created automatically when container docs are synced.</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-600)' }}>
                  Version folders follow the pattern: <code>docs/version-X-X-X/</code>
                </p>
              </div>
            )}
            
            <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: 'var(--ifm-color-emphasis-100)', borderRadius: '8px' }}>
              <h3>About Version Folders</h3>
              <p>
                Each version folder contains container-pinned documentation that was validated
                with a specific container build. These docs are synced from the container build
                process and represent the exact documentation state for that version.
              </p>
              <p>
                <strong>Latest Version:</strong> The most recent version folder represents the
                current stable or pre-release documentation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
