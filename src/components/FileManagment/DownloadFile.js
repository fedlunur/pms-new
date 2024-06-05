import React from 'react';
import useAxios from '../../utils/useAxios';

const DownloadFile = ({ fileName }) => {
    const api=useAxios();
  const downloadFile = async () => {
    try {
      const response = await api.get(`/download/${fileName}`);
      if (!response.ok) {
        throw new Error('Failed to download file');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <button onClick={downloadFile}>Download File</button>
  );
};

export default DownloadFile;
