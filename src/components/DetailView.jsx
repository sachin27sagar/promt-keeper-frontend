import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import apiCalls from '../api';
import LoaderSpinner from '../utils/Loader';

function DetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await apiCalls.getItem(id);
        setItem(response);
      } catch (error) {
        console.error('Error fetching item:', error);
        toast.error('Failed to load item details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await apiCalls.deleteItem(id);
      toast.success('Item deleted successfully');
      navigate('/');
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Error deleting item');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (item && item.promt) {
      navigator.clipboard
        .writeText(item.promt)
        .then(() => {
          toast.success('Prompt copied to clipboard!');
        })
        .catch((error) => {
          console.error('Error copying prompt:', error);
          toast.error('Failed to copy prompt');
        });
    }
  };

  if (isLoading) {
    return <LoaderSpinner />;
  }

  if (!item) return <div>Promt not found</div>;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-4">
          <img
            src={item.image.url}
            alt={item.promt}
            className="img-fluid rounded"
            style={{ maxHeight: '400px', objectFit: 'contain' }}
          />
        </div>
        <div className="col-md-8">
         <h5>{item.url}</h5>
          <h6>{item.promt}</h6>
          <button className="btn btn-info mt-3 me-2" onClick={handleCopy}>
            Copy Promt
          </button>
          <Link to={`/edit/${id}`} className="btn btn-secondary mt-3 me-2">
            Edit Promt
          </Link>
          <button className="btn btn-danger mt-3" onClick={handleDelete}>
            Delete Promt
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailView;
