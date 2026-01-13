'use client';
import React, { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Set up worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PDFImageViewerProps {
  pdfUrl: string;
  title: string;
  className?: string;
}

export default function PDFImageViewer({ pdfUrl, title, className = '' }: PDFImageViewerProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const extractImageFromPDF = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch the PDF
        const response = await fetch(pdfUrl);
        if (!response.ok) throw new Error('Failed to fetch PDF');
        
        const arrayBuffer = await response.arrayBuffer();
        
        // Load PDF document
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
        // Get first page
        const page = await pdf.getPage(1);
        
        // Set scale for rendering
        const scale = 2;
        const viewport = page.getViewport({ scale });
        
        // Create canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        if (!context) throw new Error('Canvas context not available');
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        // Render page to canvas
        await page.render({
          canvasContext: context,
          viewport: viewport,
          canvas: canvas,
        }).promise;
        
        // Convert canvas to image URL
        const imgUrl = canvas.toDataURL('image/png');
        setImageUrl(imgUrl);
      } catch (err) {
        console.error('Error extracting PDF image:', err);
        setError(err instanceof Error ? err.message : 'Failed to load PDF');
      } finally {
        setLoading(false);
      }
    };

    if (pdfUrl) {
      extractImageFromPDF();
    }
  }, [pdfUrl]);

  if (loading) {
    return (
      <div className={`relative w-full bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center ${className}`}>
        <div className="flex flex-col items-center justify-center gap-3 w-full pdf-viewer-container">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="text-sm text-gray-600">Loading PDF preview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`relative w-full bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center ${className}`}>
        <div className="flex flex-col items-center justify-center gap-3 w-full pdf-viewer-container">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-gray-600">Could not load PDF preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full rounded-lg overflow-hidden shadow-lg bg-gray-100 border ${className}`}>
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={`${title} sheet music preview`}
          className="w-full h-auto object-contain"
        />
      )}
    </div>
  );
}
