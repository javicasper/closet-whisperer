'use client';

import { useState } from 'react';
import {
  Modal,
  FileUploader,
  InlineNotification,
  Loading,
} from '@carbon/react';
import { uploadGarment } from '@/lib/api';
import { Garment } from '@/types';

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (garment: Garment) => void;
}

export default function UploadModal({ open, onClose, onSuccess }: UploadModalProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: any) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const garment = await uploadGarment(file);
      onSuccess(garment);
      onClose();
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload garment. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      open={open}
      onRequestClose={onClose}
      modalHeading="Upload Garment"
      primaryButtonText="Close"
      secondaryButtonText={undefined}
      onRequestSubmit={onClose}
      preventCloseOnClickOutside={uploading}
    >
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ color: 'var(--cds-text-secondary)', marginBottom: '1rem' }}>
          Upload a photo of your garment. Our AI will automatically analyze and categorize it.
        </p>

        {error && (
          <InlineNotification
            kind="error"
            title="Upload failed"
            subtitle={error}
            onCloseButtonClick={() => setError(null)}
            style={{ marginBottom: '1rem' }}
          />
        )}

        {uploading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loading description="Uploading and analyzing..." withOverlay={false} />
            <p style={{ marginTop: '1rem', color: 'var(--cds-text-secondary)' }}>
              This may take a few seconds...
            </p>
          </div>
        ) : (
          <FileUploader
            labelTitle="Upload image"
            labelDescription="Max file size is 10MB. Supported formats: jpg, png, webp"
            buttonLabel="Select file"
            filenameStatus="edit"
            accept={['image/jpeg', 'image/png', 'image/webp']}
            multiple={false}
            disabled={uploading}
            onChange={handleFileChange}
            name="garment-image"
          />
        )}
      </div>
    </Modal>
  );
}
