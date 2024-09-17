import React, { useState } from 'react';
import { Button, TextField, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

const EventForm = ({ show, title, start, end, onClose, onConfirm, onDelete, edit }) => {
  const [formTitle, setFormTitle] = useState(title || '');
  const [formStart, setFormStart] = useState(start || new Date());
  const [formEnd, setFormEnd] = useState(end || new Date());

  const handleConfirm = () => {
    onConfirm({
      title: formTitle,
      start: formStart,
      end: formEnd,
      id: edit ? formTitle.id : undefined, 
    });
  };

  const handleDelete = () => {
    if (edit && onDelete) {
      onDelete();
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={show} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>{edit ? 'Edit Event' : 'Add Event'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Event Title"
              fullWidth
              variant="outlined"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
            />
            <DesktopDatePicker
              label="Start Date"
              inputFormat="MM/dd/yyyy"
              value={formStart}
              onChange={(date) => setFormStart(date)}
              renderInput={(params) => <TextField {...params} fullWidth sx={{ mt: 2 }} />}
            />
            <DesktopDatePicker
              label="End Date"
              inputFormat="MM/dd/yyyy"
              value={formEnd}
              onChange={(date) => setFormEnd(date)}
              renderInput={(params) => <TextField {...params} fullWidth sx={{ mt: 2 }} />}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirm} color="primary">
            {edit ? 'Update Event' : 'Add Event'}
          </Button>
          {edit && (
            <Button onClick={handleDelete} color="error">
              Delete Event
            </Button>
          )}
          <Button onClick={onClose} color="inherit">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default EventForm;
