import { useState, useEffect } from "react";

export default function useCrud(resourceUrl) {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(resourceUrl);
        const data = await response.json();
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
    try {
      const response = await fetch(resourceUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const newData = await response.json();
      setData([...data, newData]);
      return newData;
    } catch (err) {
      setError(err);
      return null;
    }
  };

  const update = async (id, data) => {
    try {
      const response = await fetch(`${resourceUrl}/${id}`, {
        method: "PUT",
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
      const response = await fetch(`${resourceUrl}/${id}`, {
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