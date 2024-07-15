import React from "react";
import Card from "react-bootstrap/Card";
import ProgressBar from "react-bootstrap/ProgressBar";
import "../card.css"; // app one folder
import {
  BiCheckDouble,
  BiEdit,
  BiTrash,
  BiCheckCircle,
  BiReset,
  BiRefresh,
  BiBookAdd,
} from "react-icons/bi";
import {
  CardContent,
  Typography,
  Button,
  TextField,
  ListSubheader,
  Divider,
  Box,
  IconButton,
} from "@mui/material";

const ProjectCard = ({ title, content }) => {
  const percentage = 20;
  return (
    <Card >
          
      <Card.Body>
        <Card.Title className="card-title">{title}</Card.Title>
        <Card.Text className="card-text">{content}</Card.Text>
        <Divider />
        <Divider />
        <ProgressBar now={percentage} label={`${percentage}%`} />
        <Divider />
        <Divider />
        <div>
          <Button
            variant="outlined"
            color="secondary"
            // onClick={() => handleDelete(item.id)}
          >
            <BiTrash />
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            // onClick={() => sendDataDetail(item)}
          >
            <BiCheckDouble />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProjectCard;
