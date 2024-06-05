import { useState, useEffect } from "react";
import useAxios from "../utils/useAxios";

export default function useCrud(resourceUrl) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const api = useAxios();
 





  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(resourceUrl);
        const data = await response.data;
   
        setData(data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [resourceUrl]);

  const create = async (data) => {
    console.log("I will Save this ",data)
    try {
      const response = await api.post(resourceUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const newData = await response.json;
      if(newData)
      setData([...data, newData]);
     
      return newData;
    } catch (err) {
      setError(err);
      console.log("Error ",err)
      return null;
    }
  };

//   const update = async(data)=>{
//   const response = await api.patch(
//     `/task-attachments/${data.id}/`,
//     {
//       data,
//     },
//     {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   );

//   if (response.status === 200) {
//     const updatedData = await response.json();
//         const updatedIndex = data.findIndex((item) => item.id === data.id);
//         data[updatedIndex] = updatedData;
//         setData([...data]);
//         return updatedData;
//   } else {
//     console.error("Task update failed");
//   }
//   }
  const update = async (id, data) => {
    try {
      const response = await api.patch(`${resourceUrl}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const updatedData = await response.json();
      const updatedIndex = data.findIndex((item) => item.id === id);
      data[updatedIndex] = updatedData;
      setData([...data]);
      return updatedData;
    } catch (err) {
      setError(err);
      return null;
    }
  };

  const remove = async (id) => {
    try {
      const response = await api.delete(`${resourceUrl}/${id}`, {
        method: "DELETE",
      });
      if (response.status === 204) {
        setData(data.filter((item) => item.id !== id));
      } else {
        throw new Error("Failed to delete item");
      }
    } catch (err) {
      setError(err);
    }
  };

  return { data, loading, error, create, update, remove };
}