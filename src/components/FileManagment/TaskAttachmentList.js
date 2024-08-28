// import "../../index.css";
import ReactDOM from "react-dom";
import React, { useState, useEffect, useRef, useContext } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Toolbar } from "primereact/toolbar";

import { Dialog } from "primereact/dialog";
// import { InputText } from "primereact/inputtext";
import { Input } from 'antd';
// import "./DataTable.css";
import DataService from "../DataServices"; 
import Layout from "../../views/Layout";
import useCrud from "../useCrud";
import useAxios from "../../utils/useAxios";

import { Dropdown } from 'primereact/dropdown';
        
import { classNames } from 'primereact/utils';
import IconButton from '@material-ui/core/IconButton';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { BiPencil, BiTrash } from "react-icons/bi";

import useRole from "../useRole";


function   extractFilenameFromURLS  (url)  {
    // Create a URL object from the provided URL string
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

const TRANSITIONS = {
  overlay: {
      timeout: 150,
      classNames: {
          enter: 'opacity-0 scale-75',
          enterActive: 'opacity-100 !scale-100 transition-transform transition-opacity duration-150 ease-in',
          exit: 'opacity-100',
          exitActive: '!opacity-0 transition-opacity duration-150 ease-linear'
      }
  }
};

const Tailwind = {
  datatable: {
      root: ({ props }) => ({
          className: classNames('relative', {
              'flex flex-col h-full': props.scrollable && props.scrollHeight === 'flex'
          })
      }),
      loadingoverlay: {
          className: classNames(
              'fixed w-full h-full t-0 l-0 bg-gray-100/40',
              'transition duration-200',
              'absolute flex items-center justify-center z-2',
              'dark:bg-gray-950/40' // Dark Mode
          )
      },
      loadingicon: 'w-8 h-8',
      wrapper: ({ props }) => ({
          className: classNames({
              relative: props.scrollable,
              'flex flex-col grow h-full': props.scrollable && props.scrollHeight === 'flex'
          })
      }),
      header: ({ props }) => ({
          className: classNames(
              'bg-slate-50 text-slate-700 border-gray-300 font-bold p-4',
              'dark:border-blue-900/40 dark:text-white/80 dark:bg-gray-900', // Dark Mode
              props.showGridlines ? 'border-x border-t border-b-0' : 'border-y border-x-0'
          )
      }),
      table: 'w-full border-spacing-0',
      thead: ({ context }) => ({
          className: classNames({
              'bg-slate-50 top-0 z-[1]': context.scrollable
          })
      }),
      tbody: ({ props, context }) => ({
          className: classNames({
              'sticky z-[1]': props.frozenRow && context.scrollable
          })
      }),
      tfoot: ({ context }) => ({
          className: classNames({
              'bg-slate-50 bottom-0 z-[1]': context.scrollable
          })
      }),
      footer: {
          className: classNames(
              'bg-slate-50 text-slate-700 border-t-0 border-b border-x-0 border-gray-300 font-bold p-4',
              'dark:border-blue-900/40 dark:text-white/80 dark:bg-gray-900' // Dark Mode
          )
      },
      column: {
          headercell: ({ context, props }) => ({
              className: classNames(
                  'text-left border-0 border-b border-solid border-gray-300 dark:border-blue-900/40 font-bold',
                  'transition duration-200',
                  context?.size === 'small' ? 'p-2' : context?.size === 'large' ? 'p-5' : 'p-4', // Size
                  context.sorted ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-700', // Sort
                  context.sorted ? 'dark:text-white/80 dark:bg-blue-300' : 'dark:text-white/80 dark:bg-gray-900', // Dark Mode
                  {
                      'sticky z-[1]': props.frozen || props.frozen === '', // Frozen Columns
                      'border-x border-y': context?.showGridlines,
                      'overflow-hidden space-nowrap border-y relative bg-clip-padding': context.resizable // Resizable
                  }
              )
          }),
          headercontent: 'flex items-center',
          bodycell: ({ props, context }) => ({
              className: classNames(
                  'text-left border-0 border-b border-solid border-gray-300',
                  context?.size === 'small' ? 'p-2' : context?.size === 'large' ? 'p-5' : 'p-4', // Size
                  'dark:text-white/80 dark:border-blue-900/40', // Dark Mode
                  {
                      'sticky bg-inherit': props && (props.frozen || props.frozen === ''), // Frozen Columns
                      'border-x border-y': context.showGridlines
                  }
              )
          }),
          footercell: ({ context }) => ({
              className: classNames(
                  'text-left border-0 border-b border-solid border-gray-300 font-bold',
                  'bg-slate-50 text-slate-700',
                  'transition duration-200',
                  context?.size === 'small' ? 'p-2' : context?.size === 'large' ? 'p-5' : 'p-4', // Size
                  'dark:text-white/80 dark:bg-gray-900 dark:border-blue-900/40', // Dark Mode
                  {
                      'border-x border-y': context.showGridlines
                  }
              )
          }),
          sorticon: ({ context }) => ({
              className: classNames('ml-2', context.sorted ? 'text-blue-700 dark:text-white/80' : 'text-slate-700 dark:text-white/70')
          }),
          sortbadge: {
              className: classNames(
                  'flex items-center justify-center align-middle',
                  'rounded-[50%] w-[1.143rem] leading-[1.143rem] ml-2',
                  'text-blue-700 bg-blue-50',
                  'dark:text-white/80 dark:bg-blue-400' // Dark Mode
              )
          },
          columnfilter: 'inline-flex items-center ml-auto',
          filteroverlay: {
              className: classNames(
                  'bg-white text-gray-600 border-0 rounded-md min-w-[12.5rem]',
                  'dark:bg-gray-900 dark:border-blue-900/40 dark:text-white/80' //Dark Mode
              )
          },
          filtermatchmodedropdown: {
              root: 'min-[0px]:flex mb-2'
          },
          filterrowitems: 'm-0 p-0 py-3 list-none ',
          filterrowitem: ({ context }) => ({
              className: classNames(
                  'm-0 py-3 px-5 bg-transparent',
                  'transition duration-200',
                  context?.highlighted ? 'text-blue-700 bg-blue-100 dark:text-white/80 dark:bg-blue-300' : 'text-gray-600 bg-transparent dark:text-white/80 dark:bg-transparent'
              )
          }),
          filteroperator: {
              className: classNames(
                  'px-5 py-3 border-b border-solid border-gray-300 text-slate-700 bg-slate-50 rounded-t-md',
                  'dark:border-blue-900/40 dark:text-white/80 dark:bg-gray-900' // Dark Mode
              )
          },
          filteroperatordropdown: {
              root: 'min-[0px]:flex'
          },
          filterconstraint: 'p-5 border-b border-solid border-gray-300 dark:border-blue-900/40',
          filteraddrule: 'py-3 px-5',
          filteraddrulebutton: {
              root: 'justify-center w-full min-[0px]:text-sm',
              label: 'flex-auto grow-0',
              icon: 'mr-2'
          },
          filterremovebutton: {
              root: 'ml-2',
              label: 'grow-0'
          },
          filterbuttonbar: 'flex items-center justify-between p-5',
          filterclearbutton: {
              root: 'w-auto min-[0px]:text-sm border-blue-500 text-blue-500 px-4 py-3'
          },
          filterapplybutton: {
              root: 'w-auto min-[0px]:text-sm px-4 py-3'
          },
          filtermenubutton: ({ context }) => ({
              className: classNames(
                  'inline-flex justify-center items-center cursor-pointer no-underline overflow-hidden relative ml-2',
                  'w-8 h-8 rounded-[50%]',
                  'transition duration-200',
                  'hover:text-slate-700 hover:bg-gray-300/20', // Hover
                  'focus:outline-0 focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)]', // Focus
                  'dark:text-white/70 dark:hover:text-white/80 dark:bg-gray-900', // Dark Mode
                  {
                      'bg-blue-50 text-blue-700': context.active
                  }
              )
          }),
          headerfilterclearbutton: ({ context }) => ({
              className: classNames('inline-flex justify-center items-center cursor-pointer no-underline overflow-hidden relative', 'text-left bg-transparent m-0 p-0 border-none select-none ml-2', {
                  invisible: !context.hidden
              })
          }),
          columnresizer: 'block absolute top-0 right-0 m-0 w-2 h-full p-0 cursor-col-resize border border-transparent',
          rowreordericon: 'cursor-move',
          roweditorinitbutton: {
              className: classNames(
                  'inline-flex items-center justify-center overflow-hidden relative',
                  'text-left cursor-pointer select-none',
                  'w-8 h-8 border-0 rounded-[50%]',
                  'transition duration-200',
                  'text-slate-700 border-transparent',
                  'focus:outline-0 focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)]', //Focus
                  'hover:text-slate-700 hover:bg-gray-300/20', //Hover
                  'dark:text-white/70' // Dark Mode
              )
          },
          roweditorsavebutton: {
              className: classNames(
                  'inline-flex items-center justify-center overflow-hidden relative',
                  'text-left cursor-pointer select-none',
                  'w-8 h-8 border-0 rounded-[50%]',
                  'transition duration-200',
                  'text-slate-700 border-transparent',
                  'focus:outline-0 focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)]', //Focus
                  'hover:text-slate-700 hover:bg-gray-300/20', //Hover
                  'dark:text-white/70' // Dark Mode
              )
          },
          roweditorcancelbutton: {
              className: classNames(
                  'inline-flex items-center justify-center overflow-hidden relative',
                  'text-left cursor-pointer select-none',
                  'w-8 h-8 border-0 rounded-[50%]',
                  'transition duration-200',
                  'text-slate-700 border-transparent',
                  'focus:outline-0 focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)]', //Focus
                  'hover:text-slate-700 hover:bg-gray-300/20', //Hover
                  'dark:text-white/70' // Dark Mode
              )
          },
          radioButton: {
              className: classNames('relative inline-flex cursor-pointer select-none align-bottom', 'w-6 h-6')
          },
          radioButtonInput: {
              className: classNames(
                  'w-full h-full top-0 left-0 absolute appearance-none select-none',
                  'p-0 m-0 opacity-0 z-[1] rounded-[50%] outline-none',
                  'cursor-pointer peer'
              )
          },
          radioButtonBox: ({ context }) => ({
              className: classNames(
                  'flex items-center justify-center',
                  'h-6 w-6 rounded-full border-2 text-gray-700 transition duration-200 ease-in-out',
                  context.checked
                      ? 'border-blue-500 bg-blue-500 dark:border-blue-400 dark:bg-blue-400 peer-hover:bg-blue-700 peer-hover:border-blue-700'
                      : 'border-gray-300 bg-white dark:border-blue-900/40 dark:bg-gray-900 peer-hover:border-blue-500',
                  {
                      'hover:border-blue-500 focus:shadow-input-focus focus:outline-none focus:outline-offset-0 dark:hover:border-blue-400 dark:focus:shadow-[inset_0_0_0_0.2rem_rgba(147,197,253,0.5)]': !context.disabled,
                      'cursor-default opacity-60': context.disabled,
                  },
              ),
          }),
          radioButtonIcon: ({ context }) => ({
              className: classNames(
                  'transform rounded-full',
                  'block h-3 w-3 bg-white transition duration-200 dark:bg-gray-900',
                  {
                      'backface-hidden scale-10 invisible': context.checked === false,
                      'visible scale-100 transform': context.checked === true,
                  },
              ),
          }),
          headercheckboxwrapper: {
              className: classNames('cursor-pointer inline-flex relative select-none align-bottom', 'w-6 h-6')
          },
          headercheckbox: ({ context }) => ({
              className: classNames(
                  'flex items-center justify-center',
                  'border-2 w-6 h-6 text-gray-600 rounded-lg transition-colors duration-200',
                  context.checked ? 'border-blue-500 bg-blue-500 dark:border-blue-400 dark:bg-blue-400' : 'border-gray-300 bg-white dark:border-blue-900/40 dark:bg-gray-900',
                  {
                      'hover:border-blue-500 dark:hover:border-blue-400 focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[inset_0_0_0_0.2rem_rgba(147,197,253,0.5)]': !context.disabled,
                      'cursor-default opacity-60': context.disabled
                  }
              )
          }),
          headercheckboxicon: 'w-4 h-4 transition-all duration-200 text-white text-base dark:text-gray-900',
          checkboxwrapper: {
              className: classNames('cursor-pointer inline-flex relative select-none align-bottom', 'w-6 h-6')
          },
          checkbox: ({ context }) => ({
              className: classNames(
                  'flex items-center justify-center',
                  'border-2 w-6 h-6 text-gray-600 rounded-lg transition-colors duration-200',
                  context.checked ? 'border-blue-500 bg-blue-500 dark:border-blue-400 dark:bg-blue-400' : 'border-gray-300 bg-white dark:border-blue-900/40 dark:bg-gray-900',
                  {
                      'hover:border-blue-500 dark:hover:border-blue-400 focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[inset_0_0_0_0.2rem_rgba(147,197,253,0.5)]': !context.disabled,
                      'cursor-default opacity-60': context.disabled
                  }
              )
          }),
          checkboxicon: 'w-4 h-4 transition-all duration-200 text-white text-base dark:text-gray-900',
          transition: TRANSITIONS.overlay
      },
      bodyrow: ({ context }) => ({
          className: classNames(
              context.selected ? 'bg-blue-50 text-blue-700 dark:bg-blue-300' : 'bg-white text-gray-600 dark:bg-gray-900',
              context.stripedRows ? (context.index % 2 === 0 ? 'bg-white text-gray-600 dark:bg-gray-900' : 'bg-blue-50/50 text-gray-600 dark:bg-gray-950') : '',
              'transition duration-200',
              'focus:outline focus:outline-[0.15rem] focus:outline-blue-200 focus:outline-offset-[-0.15rem]', // Focus
              'dark:text-white/80 dark:focus:outline dark:focus:outline-[0.15rem] dark:focus:outline-blue-300 dark:focus:outline-offset-[-0.15rem]', // Dark Mode
              {
                  'cursor-pointer': context.selectable,
                  'hover:bg-gray-300/20 hover:text-gray-600': context.selectable && !context.selected // Hover
              }
          )
      }),
      rowexpansion: 'bg-white text-gray-600 dark:bg-gray-900 dark:text-white/80',
      rowgroupheader: {
          className: classNames('sticky z-[1]', 'bg-white text-gray-600', 'transition duration-200')
      },
      rowgroupfooter: {
          className: classNames('sticky z-[1]', 'bg-white text-gray-600', 'transition duration-200')
      },
      rowgrouptoggler: {
          className: classNames(
              'text-left m-0 p-0 cursor-pointer select-none',
              'inline-flex items-center justify-center overflow-hidden relative',
              'w-8 h-8 text-gray-500 border-0 bg-transparent rounded-[50%]',
              'transition duration-200',
              'dark:text-white/70' // Dark Mode
          )
      },
      rowgrouptogglericon: 'inline-block w-4 h-4',
      resizehelper: 'absolute hidden w-px z-10 bg-blue-500 dark:bg-blue-300'
  }
}
      
function TaskAttachmentList() {
  let emptyAttachment = {
    name: "",
    path: "",
    task_card: null
  };
  const { hasAccess: canEdit, roles, user } = useRole(['admin', 'QualityAssurance']);
  const { hasAccess: canAdd } = useRole(['admin','QualityAssurance','member']);
  const { hasAccess: canDelete } = useRole(['admin']);
  const { hasAccess: canView } = useRole(['member']);


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
          const response = await api.post('/task-attachments/', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
          });
        
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
            const response = await api.patch(`/task-attachments/${attachment.id}/`, formData, {
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
        await api.delete(`/task-attachments/${attachment.id}/`);
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


  // const importCSV = (e) => {
  //   const file = e.files[0];
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     const csv = e.target.result;
  //     const data = csv.split("\n");

  //     // Prepare DataTable
  //     const cols = data[0].replace(/['"]+/g, "").split(",");
  //     data.shift();

  //     const importedData = data.map((d) => {
  //       d = d.split(",");
  //       const processedData = cols.reduce((obj, c, i) => {
  //         obj[c.toLowerCase()] = d[i].replace(/['"]+/g, "");
  //         return obj;
  //       }, {});

        
  //       return processedData;
  //     });

  //     const _attachments = [...attachments, ...importedData];

  //     setAttachments(_attachments);
  //   };

  //   reader.readAsText(file, "UTF-8");
  // };

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
    console.log("The file attached is",file)
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
          {canDelete && 
        <Button
          label="Delete"
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={confirmDeleteSelected}
          disabled={!selectedAttachments || !selectedAttachments.length}
        />
      }
      </React.Fragment>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        {/* <FileUpload
          mode="basic"
          name="demo[]"
          auto
          url="https://primefaces.org/primereact/showcase/upload.php"
          accept=".csv"
          chooseLabel="Import"
          className="mr-2 inline-block"
          onUpload={importCSV}
        /> */}
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
         {/* <IconButton  onClick={() => editAttachment(rowData)} >
        <BiPencil />
    </IconButton> */}
    <IconButton
        color="primary"
        onClick={() => {
          // Open the dialog and set the attachment data
          setAttachment({ ...rowData });
          setAttachmentDialog(true);
        }}
        disabled={!canEdit}
      >
        <BiPencil />
      </IconButton>


    {canDelete &&
    <IconButton onClick={() => confirmDeleteAttachment(rowData)} >
        <BiTrash />
    </IconButton>
  }
      </React.Fragment>
    );
  };

  const header = (
    <div className="table-header">
    <span className="p-input-icon-left">
      <i className="pi pi-search" style={{ marginRight: '5px' }} />
      <Input
        type="search"
        onInput={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search..."
        className="search-input"
      />
    </span>
  </div>
  );
  const extractFilenameFromURL = (url) => {
    const parts = url.split('/');
    return parts[parts.length - 1];
  };
  
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
const findTaskNameById = (taskId) => {
   
    const foundTask = alltasks.find(task => task.id === taskId); // Find by ID
    return foundTask ? foundTask.task_name : 'Task not found'; // Handle missing task
  };
const taskBody = (rowData) => {
   return (
        <p>
          { findTaskNameById(rowData.task_card)}
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


  return (

    <Layout>
    
    
      <section className="">
            <div className="container-fluid py-2 px-2">
    <div >
      <Toast ref={toast} />

      <div className="card">
      <h1 class="m-0">Tasks </h1>
        <Toolbar
          className="mb-4"
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        ></Toolbar>

        <DataTable
          ref={dt}
          tableStyle={{ minWidth: '50rem' }}
          virtualScroll
          showGridlines 
          rows={10} 
          loading={loading} 
          value={attachments}
          selection={selectedAttachments}
          onSelectionChange={(e) => setSelectedAttachments(e.value)}
          dataKey="id"
          paginator
         
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
          <Input
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
  
  <FileUpload mode="basic" name="path"   onSelect={onUpload} />
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
    </div></section>
    
    </Layout>
  );
}

export default TaskAttachmentList;
