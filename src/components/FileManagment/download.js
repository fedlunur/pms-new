import axios from "axios";
import useAxios from "../../utils/useAxios";
const DownloadButton = ({ fileName }) => {
 axios=useAxios();
    const handleDownload = async () => {
      try {
      
        const response = await axios.get(`/api/download/${fileName}/`, {
          responseType: 'blob', // Important: responseType must be 'blob' to handle binary data
        });
  
        // Create a temporary anchor element
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
  
        // Clean up resources
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading file:', error);
        // Handle error as needed
      }
    };
  
    return (
      <button onClick={handleDownload}>
        Download {fileName}
      </button>
    );
  };
  
  export default DownloadButton;