import "../../index.css";
import React, { useContext,useState, useEffect, useRef } from "react";

import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Toolbar } from "primereact/toolbar";
// import { InputText } from "primereact/inputtext";
import { Input } from 'antd';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from "primereact/dialog";
import IconButton from '@material-ui/core/IconButton';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { BiPencil, BiTrash } from "react-icons/bi";
import axios from "axios";
import Layout from "../../views/Layout";
import useAxios from "../../utils/useAxios";
import useRole from "../useRole";
import AuthContext from "../../context/AuthContext";
// import "./DataTable.css";
import { UploadOutlined } from '@ant-design/icons';

// import
// { Upload }
// from
// "antd"
;
function   extractFilenameFromURLS  (url)  {
  // Create a URL object from the provided URL 
  console.log("Here is the struggling file ",url)
  try {
    // Create a URL object from the provided URL string
    const urlObject = new URL(url);
    // Get the pathname from the URL object
    const pathname = urlObject.pathname;
        
    // Extract the filename from the pathname
    const filename = pathname.substring(pathname.lastIndexOf('/') + 1);
    return filename;
} catch (error) {
    console.error('Invalid URL:', url);
    return null; // or handle the error as per your application's requirements
}
};



const ProjectResource = () => {
  const emptyAttachment = {
    description: "",
    path: "",
    submitted_by:1,
    project_name:null,
    remark:""

  };
  const { user, logoutUser,roles } = useContext(AuthContext);
  const { hasAccess: canEdit  } = useRole(['Admin', 'ProjectCoordinator']);
  const { hasAccess: canAdd } = useRole(['Admin', 'ProjectCoordinator']);
  const { hasAccess: canDelete } = useRole(['Admin','ProjectCoordinator']);
  const { hasAccess: canView } = useRole(['Member','Admin','ProjectCoordinator']);

  const [attachments, setAttachments] = useState([]);
  const [attachmentDialog, setAttachmentDialog] = useState(false);
  const [deleteAttachmentDialog, setDeleteAttachmentDialog] = useState(false);
  const [deleteAttachmentsDialog, setDeleteAttachmentsDialog] = useState(false);
  const [attachment, setAttachment] = useState(emptyAttachment);
  const [selectedAttachments, setSelectedAttachments] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [projectresource, setProjectresource] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const toast = useRef(null);
  const dt = useRef(null);

  const api = useAxios();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectResponse, projectresourceResponse] = await Promise.all([
        api.get('/project/'),
        api.get("/projectresource/")
      ]);

      if (projectResponse.status < 200 || projectresourceResponse.status >= 300) {
        throw new Error("One or more network responses were not ok");
      }

      const projectData = projectResponse.data;
      const resourceData = projectresourceResponse.data;

      setProjectresource(resourceData);
     
      if (projectData.length > 0) {
        const formattedProjects = projectData.map(project => ({
          label: project.project_name,
          value: project.id
        }));
        setProjects(formattedProjects);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setAttachment(prevAttachment => ({
      ...prevAttachment,
      project_name: event.value
    }));
  };

  const openNew = () => {
    setAttachment(emptyAttachment);
    setSubmitted(false);
    setAttachmentDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setAttachmentDialog(false);
  };

  const hideDeleteAttachmentDialog = () => {
    setDeleteAttachmentDialog(false);
  };

  const hideDeleteAttachmentsDialog = () => {
    setDeleteAttachmentsDialog(false);
  };


  const onUpload = (e) => {
    const file = e.files[0];
    console.log("The file attached is",file)
    let _attachment = { ...attachment };
    _attachment.path = file;
    setAttachment(_attachment);
};

const saveAttachment = async () => {
  setSubmitted(true);

  if (!attachment.description.trim()) {
      // Early return if description is empty
      return;
  }

  const formData = new FormData();
  formData.append("description", attachment.description);
  formData.append("project_name", attachment.project_name); // Ensure this is a valid ID or handle null
  formData.append("path", attachment.path);
  formData.append("remark", attachment.remark);
  formData.append("submitted_by", user.user_id );

  try {
      const response = await api.post('/projectresource/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Update the attachments state with the new attachment
      setAttachments(prevAttachments => [...prevAttachments, response.data]);

      // Close the dialog and reset the attachment state
      setAttachmentDialog(false);
      setAttachment(emptyAttachment);

      // Show success toast
      toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Attachment Created",
          life: 3000
      });
      fetchData();
  } catch (error) {
      // Handle error with toast
      const errorMessage = error.response && error.response.data.name
          ? error.response.data.name.join(', ')
          : 'An error occurred';

      toast.current.show({
          severity: "error",
          summary: "Error",
          detail: errorMessage,
          life: 3000
      });

      // Log the error for debugging
      console.error("Error:", error);
  }
};



  
  // Ensure you call handleSave() when the user confirms the form submission
  
  


  const confirmDeleteAttachment = (attachment) => {
    setAttachment(attachment);
    setDeleteAttachmentDialog(true);


  
  };

  const deleteAttachment = async () => {
    try {
      await api.delete(`/projectresource/${attachment.id}/`);
      setAttachments(prevAttachments => prevAttachments.filter(a => a.id !== attachment.id));
      
      toast.current.show({ severity: "success", summary: "Successful", detail: "Attachment Deleted", life: 3000 });
      fetchData();
    } catch (error) {
      handleApiError(error);
    } finally {
   
      hideDeleteAttachmentDialog();
    }
  };



  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteAttachmentsDialog(true);
  };

  const deleteSelectedAttachments = () => {
    setAttachments(prevAttachments => prevAttachments.filter(a => !selectedAttachments.includes(a)));
    setDeleteAttachmentsDialog(false);
    setSelectedAttachments(null);
    toast.current.show({ severity: "success", summary: "Successful", detail: "Attachments Deleted", life: 3000 });
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    setAttachment(prevAttachment => ({
      ...prevAttachment,
      [name]: val
    }));
  };

  // function onUpload(e) {
  //   const file = e.target.files[0]; // Access the file object from the input event
  //   console.log("The file attached is", file);

  //   let _attachment = { ...attachment };
  //   _attachment.file = file; // Store the file object itself
  //   setAttachment(_attachment); // Update the state with the new attachment
  // }

  const handleApiError = (error) => {
    console.error("API error:", error);
    toast.current.show({ severity: "error", summary: "Error", detail: "An error occurred", life: 3000 });
  };

  const taskBody = (rowData) => (
    <span>
      {rowData.description} 
    </span>
  );
  
  const DownloadFile = async (filePath, api) => {
    try {
      console.log("Here is the file path to download before ", filePath);
      // Extract the filename from the provided file path
      const filename = extractFilenameFromURL(filePath);
      console.log("I will download the file from ", filename);
      
      // Construct the download URL
      const downloadURL = `/download/${filename}/`;
      console.log('The api URL is',downloadURL)
      // Fetch the file from the download URL using axios
      const response = await api.get(downloadURL, {
        responseType: 'blob',  // Important: handle the response as a Blob
      });
  
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Create a temporary link element to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      // Click the link to initiate the download
      link.click();
      // Cleanup: remove the link element from the DOM
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };


  const downloadBodyTemplate = (rowData) => {
    const api = useAxios();
      return (
    
          <IconButton onClick={() => DownloadFile(rowData.path,api)}> 
          <CloudDownloadIcon />
      </IconButton>
      );
  };

  const extractFilenameFromURL = (url) => {
    const parts = url.split('/');
    return parts[parts.length - 1];
  };
  const actionBodyTemplate = (rowData) => (
    <div className="p-d-flex p-ai-center">
      <IconButton
      
        onClick={() => {
          // Open the dialog and set the attachment data
          setAttachment({ ...rowData });
          setAttachmentDialog(true);
        }}
        disabled={!canEdit}
      >
        <BiPencil />
      </IconButton>
      <IconButton
 
        onClick={() => confirmDeleteAttachment(rowData)}
        disabled={!canDelete}
      >
        <BiTrash />
      </IconButton>
    </div>
  );
  

  const leftToolbarTemplate = () => (
    <div className="my-2">
      <Button
        label="New"
        icon="pi pi-plus"
        className="p-button-success p-mr-2"
        onClick={openNew}
        disabled={!canAdd}
      />
      <Button
        label="Delete"
        icon="pi pi-trash"
        className="p-button-danger"
        onClick={confirmDeleteSelected}
        disabled={!canDelete || !selectedAttachments || selectedAttachments.length === 0}
      />
    </div>
  );

  const rightToolbarTemplate = () => (
    <div className="my-2">
      <Button
        label="Export"
        icon="pi pi-upload"
        className="p-button-primary"
        onClick={exportCSV}
        disabled={!attachments || attachments.length === 0}
      />
    </div>
  );

  const attachmentDialogFooter = (
    <div>
      <Button label="Cancel" icon="pi pi-times" onClick={hideDialog} className="p-button-text" />
      <Button label="Save" icon="pi pi-check" onClick={saveAttachment} />
    </div>
  );

  const deleteAttachmentDialogFooter = (
    <div>
      <Button label="No" icon="pi pi-times" onClick={hideDeleteAttachmentDialog} className="p-button-text" />
      <Button label="Yes" icon="pi pi-check" onClick={deleteAttachment} />
    </div>
  );

  const deleteAttachmentsDialogFooter = (
    <div>
      <Button label="No" icon="pi pi-times" onClick={hideDeleteAttachmentsDialog} className="p-button-text" />
      <Button label="Yes" icon="pi pi-check" onClick={deleteSelectedAttachments} />
    </div>
  );
  const header = (
    <div className="table-header">
    <span className="p-input-icon-left">
      <i className="pi pi-search" style={{ marginRight: '10px' }} />
      <Input
        type="search"
        onInput={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search..."
        className="search-input"
      />
    </span>
  </div>
  );
  return (
    <Layout>
      <div className="datatable-crud-demo">
        <Toast ref={toast} />
        <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} />
       
        <DataTable
           ref={dt}
           virtualScroll
         
           showGridlines
           showHeaders
           
            value={projectresource}
            selection={selectedAttachments}
           onSelectionChange={(e) => setSelectedAttachments(e.value)}
           dataKey="id"
           paginator
           rows={10}
           rowsPerPageOptions={[5, 10, 25]}
           paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
           currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
           globalFilter={globalFilter}
           header={header}
          emptyMessage="No attachments found."
        >
             <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
            exportable={false}
          ></Column>
          <Column
    header="Project"
    sortable
    body={(rowData) => (
      <span>{rowData.project_name_detail.project_name }</span>
    )}
  />
          <Column field="name" header="Description" sortable body={taskBody} />
          <Column field="path" header="path"   body={downloadBodyTemplate} />
          <Column
    header="Submitted By"
    sortable
    body={(rowData) => (
      <span>{rowData.submitted_by_detail.first_name}</span>
    )}
  />
          <Column body={actionBodyTemplate} header="Actions" />
        </DataTable>

        {/* New Attachment Dialog */}
        <Dialog
    visible={attachmentDialog}
    style={{ width: '450px' }}
    header="Attachment Details"
    modal
    className="p-fluid"
    footer={attachmentDialogFooter}
    onHide={hideDialog}
>
    <div className="p-field">
        <label htmlFor="description">Description  </label>
        <Input  id="description"
            value={attachment.description}
            onChange={(e) => onInputChange(e, 'description')}
            required
            autoFocus 
            className={classNames({ 'p-invalid': submitted && !attachment.description })} placeholder="Description " />
    
        {submitted && !attachment.description && <small className="p-error">Description is required.</small>}
    </div>
    <div className="field">
  <label htmlFor="path">Attach File</label>

  { /* Optional: Display a placeholder if no path is available */}
  
 
  <div className="card">
  <FileUpload mode="basic" name="path"   onSelect={onUpload} emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>} />
          
        </div>
  {submitted && !attachment.path && <small className="p-error">File is required.</small>}
  {attachment.path && (
    <span id="filePathDisplay">{extractFilenameFromURLS(attachment.path)}</span>
  )}
</div>
    <div className="p-field">
        <label htmlFor="project_name">Project</label>
        <Dropdown
            id="project_name"
            value={attachment.project_name}
            options={projects}
            onChange={handleChange}
            placeholder="Select a Project"
        />
    </div>
    <div className="p-field">
  <label htmlFor="remark">Remark</label>
  <Input
    id="remark"
    value={attachment.remark}
    onChange={(e) => onInputChange(e, 'remark')}
    required
    autoFocus placeholder="Remark"
    className={classNames({ 'p-invalid': submitted && !attachment.remark })}
  />
  {submitted && !attachment.remark && <small className="p-error">Remark is required.</small>}
</div>

</Dialog>

        {/* Delete Attachment Dialog */}
        <Dialog
          visible={deleteAttachmentDialog}
          style={{ width: '450px' }}
          header="Confirm"
          modal
          footer={deleteAttachmentDialogFooter}
          onHide={hideDeleteAttachmentDialog}
        >
          <div className="confirmation-content">
            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
            {attachment && <span>Are you sure you want to delete <b>{attachment.name}</b>?</span>}
          </div>
        </Dialog>

        {/* Delete Attachments Dialog */}
        <Dialog
          visible={deleteAttachmentsDialog}
          style={{ width: '450px' }}
          header="Confirm"
          modal
          footer={deleteAttachmentsDialogFooter}
          onHide={hideDeleteAttachmentsDialog}
        >
          <div className="confirmation-content">
            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
            {selectedAttachments && <span>Are you sure you want to delete the selected attachments?</span>}
          </div>
        </Dialog>
      </div>
    </Layout>
  );
};

export default ProjectResource;
  