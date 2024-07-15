import "../../index.css";
import ReactDOM from "react-dom";
import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { TaskCardAttachmentService } from "./services/TaskCardAttachmentService"; 
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import "./DataTable.css";
import DataService from "../DataServices"; 
import Layout from "../../views/Layout";
import useCrud from "../useCrud";
import useAxios from "../../utils/useAxios";

import { Dropdown } from 'primereact/dropdown';
        

import IconButton from '@material-ui/core/IconButton';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { BiPencil, BiTrash } from "react-icons/bi";

function   extractFilenameFromURLS  (url)  {
    // Create a URL object from the provided URL string
    const urlObject = new URL(url);
    // Get the pathname from the URL object
    const pathname = urlObject.pathname;
    // Extract the filename from the pathname
    const filename = pathname.substring(pathname.lastIndexOf('/') + 1);
    return filename;
};
function TaskAttachmentList() {
  let emptyAttachment = {
    name: "",
    path: "",
    task_card: ""
  };

  const [attachments, setAttachments] = useState([]);
  const [attachmentDialog, setAttachmentDialog] = useState(false);
  const [deleteAttachmentDialog, setDeleteAttachmentDialog] = useState(false);
  const [deleteAttachmentsDialog, setDeleteAttachmentsDialog] = useState(false);
  const [attachment, setAttachment] = useState(emptyAttachment);
  const [selectedAttachments, setSelectedAttachments] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);
  const [selectedTaskCard, setSelectedTaskCard] = useState(attachment.task_card);
  const [taskCards, setTaskCards] = useState([]);

//   const taskCardAttachmentService = new TaskCardAttachmentService();
 const { allprojects,allactivities,alltasks,alluserss,alltaskmembers,allteammembers,allcardattachement, activities_by_project, tasksbyproject } = DataService(); // Assuming useCrud fetches data

const { data, loading, error, create, update, remove } = useCrud("/task-attachments/");

const api = useAxios();
    
useEffect(() => {
    if (data) {
      setAttachments(data);
      if (alltasks.length > 0) {
        const formattedTaskCards = alltasks.map(task => ({
          label: task.task_name, // Use task_name for display
          value: task.id // Use id for the underlying value
        }));
        setTaskCards(formattedTaskCards);
      }
    }
  }, [data]);


  const handleChange = (event) => {
    setSelectedTaskCard(event.value);
    onInputChange(event, "task_card"); // Pass the event object for potential additional data
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
 
  const saveAttachment = async () => {
    setSubmitted(true);

    if (attachment.name.trim()) {
      let _attachments = [...attachments];
    
  
      setAttachments(_attachments);
      const formData = new FormData();
      formData.append("name", attachment.name);
      formData.append("path", attachment.path);
      formData.append("task_card", attachment.task_card);

      try {
          const response = await api.post('/protask/api/task-attachments/', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
          });
        setAttachments([...attachments, response.data]);
        setAttachments([...attachments, response.data]);
        setAttachmentDialog(false);
       
        toast.current.show({ severity: "success", summary: "Successful", detail: "Attachment Created", life: 3000 });
    } catch (error) {
        if (error.response && error.response.data) {
            const errorMessage = error.response.data.name ? error.response.data.name.join(', ') : 'An error occurred';
            toast.current.show({ severity: "error", summary: "Error", detail: errorMessage, life: 3000 });
            console.log("ERror is ",error)
        } else {
            toast.current.show({ severity: "error", summary: "Error", detail: "An error occurred", life: 3000 });
        }
    }



      setAttachmentDialog(false);
      
      setAttachment(emptyAttachment);
    }
  };

  const editAttachment = async (attachment) => {
    setAttachment({ ...attachment });
    if (attachment.name.trim() && attachment.path) {
        const formData = new FormData();
        formData.append("name", attachment.name);
        formData.append("path", attachment.path);
        formData.append("task_card", attachment.task_card);

        try {
            const response = await api.patch(`/protask/api/task-attachments/${attachment.id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const updatedAttachmentIndex = attachments.findIndex(a => a.id === attachment.id);
            if (updatedAttachmentIndex !== -1) {
                const updatedAttachments = [...attachments];
                updatedAttachments[updatedAttachmentIndex] = response.data;
                setAttachments(updatedAttachments);
            }
            setAttachmentDialog(false);
            setAttachment(emptyAttachment);
            toast.current.show({ severity: "success", summary: "Successful", detail: "Attachment Updated", life: 3000 });
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.name ? error.response.data.name.join(', ') : 'An error occurred';
                toast.current.show({ severity: "error", summary: "Error", detail: errorMessage, life: 3000 });
                console.log("Error is", error.response.data);
            } else {
                toast.current.show({ severity: "error", summary: "Error", detail: "An error occurred", life: 3000 });
            }
        }
    setAttachmentDialog(true);
  }
};

  const confirmDeleteAttachment = async (attachment) => {
    setAttachment(attachment);

    setDeleteAttachmentDialog(true);
  };

  const deleteAttachment = async () => {
    let _attachments = attachments.filter((val) => val.id !== attachment.id);
    setAttachments(_attachments);
    try {
        await api.delete(`/protask/api/task-attachments/${attachment.id}/`);
        const updatedAttachments = attachments.filter(a => a.id !== attachment.id);
        setAttachments(updatedAttachments);
        toast.current.show({ severity: "success", summary: "Successful", detail: "Attachment Deleted", life: 3000 });
    } catch (error) {
        if (error.response && error.response.data) {
            const errorMessage = error.response.data.name ? error.response.data.name.join(', ') : 'An error occurred';
            toast.current.show({ severity: "error", summary: "Error", detail: errorMessage, life: 3000 });
            console.log("Error is", error.response.data);
        } else {
            toast.current.show({ severity: "error", summary: "Error", detail: "An error occurred", life: 3000 });
        }
    }
    setDeleteAttachmentDialog(false);
    setAttachment(emptyAttachment);

  };


  const importCSV = (e) => {
    const file = e.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target.result;
      const data = csv.split("\n");

      // Prepare DataTable
      const cols = data[0].replace(/['"]+/g, "").split(",");
      data.shift();

      const importedData = data.map((d) => {
        d = d.split(",");
        const processedData = cols.reduce((obj, c, i) => {
          obj[c.toLowerCase()] = d[i].replace(/['"]+/g, "");
          return obj;
        }, {});

        
        return processedData;
      });

      const _attachments = [...attachments, ...importedData];

      setAttachments(_attachments);
    };

    reader.readAsText(file, "UTF-8");
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteAttachmentsDialog(true);
  };

  const deleteSelectedAttachments = () => {
    let _attachments = attachments.filter((val) => !selectedAttachments.includes(val));
    setAttachments(_attachments);
    setDeleteAttachmentsDialog(false);
    setSelectedAttachments(null);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Attachments Deleted",
      life: 3000
    });
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _attachment = { ...attachment };
    _attachment[`${name}`] = val;

    setAttachment(_attachment);
  };
    
  const onUpload = (e) => {
    const file = e.files[0];
    let _attachment = { ...attachment };
    _attachment.path = file;
    setAttachment(_attachment);
};
  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label="New"
          icon="pi pi-plus"
          className="p-button-success mr-2"
          onClick={openNew}
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={confirmDeleteSelected}
          disabled={!selectedAttachments || !selectedAttachments.length}
        />
      </React.Fragment>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <FileUpload
          mode="basic"
          name="demo[]"
          auto
          url="https://primefaces.org/primereact/showcase/upload.php"
          accept=".csv"
          chooseLabel="Import"
          className="mr-2 inline-block"
          onUpload={importCSV}
        />
        <Button
          label="Export"
          icon="pi pi-upload"
          className="p-button-help"
          onClick={exportCSV}
        />
      </React.Fragment>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
         <IconButton  onClick={() => editAttachment(rowData)} >
        <BiPencil />
    </IconButton>
    <IconButton onClick={() => confirmDeleteAttachment(rowData)} >
        <BiTrash />
    </IconButton>
      
      </React.Fragment>
    );
  };

  const header = (
    <div className="table-header">
      <h5 className="mx-0 my-1">Manage Task Card Attachments</h5>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
      </span>
    </div>
  );
  const extractFilenameFromURL = (url) => {
    // Create a URL object from the provided URL string
    const urlObject = new URL(url);
    // Get the pathname from the URL object
    const pathname = urlObject.pathname;
    // Extract the filename from the pathname
    const filename = pathname.substring(pathname.lastIndexOf('/') + 1);
    return filename;
};
    
const DownloadFile = async (filePath) => {
    try {
        // Extract the filename from the provided file path
        const filename = extractFilenameFromURL(filePath);
        // Construct the download URL
        const downloadURL = `/api/download/${filename}/`;
        
        // Fetch the file from the download URL
        const response = await fetch(downloadURL);
        if (!response.ok) {
            throw new Error('Failed to download file');
        }

        // Create a blob from the response data
        const blob = await response.blob();
        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);

        // Create a temporary link element to trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        // Click the link to initiate the download
        link.click();
        // Cleanup: remove the link element from the DOM
        link.parentNode.removeChild(link);
    } catch (error) {
        console.error('Error downloading file:', error);
    }
};


  
const downloadBodyTemplate = (rowData) => {
    return (
        <IconButton onClick={() => DownloadFile(rowData.path)}>
        <CloudDownloadIcon />
    </IconButton>
    );
};
// const findTaskNameById = (taskId) => {
   
//     const foundTask = alltasks.find(task => task.id === taskId); // Find by ID
//     return foundTask ? foundTask.task_name : 'Task not found'; // Handle missing task
//   };
const taskBody = (rowData) => {

   
    return (
        <p>
          { rowData.task_card.task_name}
   {/* {taskName} */}
        </p>
       
    );
};

  const attachmentDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveAttachment}
      />
    </React.Fragment>
  );

  const deleteAttachmentDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteAttachmentDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteAttachment}
      />
    </React.Fragment>
  );

  const deleteAttachmentsDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteAttachmentsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedAttachments}
      />
    </React.Fragment>
  );
  const onFileChange = (e) => {
    let _attachment = { ...attachment };
    _attachment.path = e.target.files[0];
    setAttachment(_attachment);
};
  return (

    <Layout>
    <div class="content-wrapper">
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <h1 class="m-0">Task Detail </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="content">
        <div className="container-fluid">
          <section className="content">
            <div className="container-fluid">
    <div className="datatable-crud-demo">
      <Toast ref={toast} />

      <div className="card">
        <Toolbar
          className="mb-4"
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        ></Toolbar>

        <DataTable
          ref={dt}
          virtualScroll
          value={attachments}
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
          responsiveLayout="scroll"
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
            exportable={false}
          ></Column>
       <Column
            field="task_card"
            header="Task Name"
            sortable
            body={taskBody}
            style={{ minWidth: "16rem" }}
          ></Column>
        
      <Column
            field="name"
            header="File Name"
            sortable
            style={{ minWidth: "16rem" }}
          ></Column>
<Column
            field="image"
            header="File"
            body={downloadBodyTemplate}
          ></Column>
         
          <Column
           header="Operations"
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "8rem" }}
          ></Column>
        </DataTable>
      </div>






      <Dialog
        visible={attachmentDialog}
        style={{ width: "450px" }}
        header="Attachment Details"
        modal
        className="p-fluid"
        footer={attachmentDialogFooter}
        onHide={hideDialog}
      >
        <div className="field">
          <label htmlFor="name">Name</label>
          <InputText
            id="name"
            value={attachment.name}
            onChange={(e) => onInputChange(e, "name")}
            required
            autoFocus
            className={classNames({ "p-invalid": submitted && !attachment.name })}
          />
          {submitted && !attachment.name && (
            <small className="p-invalid">Name is required.</small>
          )}
        </div>

        <div className="field">
  <label htmlFor="path">Attach File</label>

  { /* Optional: Display a placeholder if no path is available */}
  
  <FileUpload mode="basic" name="path" maxFileSize={1000000} onSelect={onUpload} />
  {submitted && !attachment.path && <small className="p-error">File is required.</small>}
  {attachment.path && (
    <span id="filePathDisplay">{extractFilenameFromURLS(attachment.path)}</span>
  )}
</div>

        <div className="field">
          <label htmlFor="task_card">Task Card</label>
          <Dropdown
        id="task_card"
      
        value={attachment.task_card}
        options={taskCards}
        onChange={handleChange}
        filter
        showClear={true}
        placeholder="Select Task Card"
      />
        </div>
      </Dialog>

      <Dialog
        visible={deleteAttachmentDialog}
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={deleteAttachmentDialogFooter}
        onHide={hideDeleteAttachmentDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {attachment && (
            <span>
              Are you sure you want to delete <b>{attachment.name}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={deleteAttachmentsDialog}
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={deleteAttachmentsDialogFooter}
        onHide={hideDeleteAttachmentsDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {attachment && (
            <span>Are you sure you want to delete the selected attachments?</span>
          )}
        </div>
      </Dialog>
    </div>
    </div></section></div></div></div></Layout>
  );
}

export default TaskAttachmentList;
