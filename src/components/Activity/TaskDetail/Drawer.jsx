
import React, { useState, useEffect } from "react";
import { Button, Drawer, Spin , Flex, Tooltip } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
 function TaskDrower ({ subtasks })   {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
 

    // Calculate completed and incomplete tasks
    const completedTasks = subtasks.filter((task) => task.status).length;
    const totalTasks = subtasks.length;
    const completedPercentage = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
    const incompletePercentage = totalTasks ? ((totalTasks - completedTasks) / totalTasks) * 100 : 0;

  const showDrawer = () => {
    setOpen(true);
  };

  const showLoading = () => {
    setOpen(true);
    setLoading(true);

    // Simple loading mock. You should add cleanup logic in real world.
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  return (
    <>
    <Tooltip title="Search">
        <Button shape="circle" icon={<SearchOutlined />} onClick={showLoading} />
      </Tooltip>
 
      <Drawer
        closable
        destroyOnClose
        title={<p>Loading Data</p>}
        placement="right"
        open={open}
        loading={loading}
        onClose={() => setOpen(false)}
      >
    
        <p>Total Tasks <br></br> {subtasks.length}</p>
        <p>Complted Tasks In percentage <br></br>  {completedPercentage}</p>
        <p>Incompleted Tasks In Percentage <br></br> {incompletePercentage}</p>
      
      </Drawer>
    </>
  );
};
export default TaskDrower;