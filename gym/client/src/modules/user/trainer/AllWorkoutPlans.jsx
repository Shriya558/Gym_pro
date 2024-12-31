import React, { useState, useEffect } from 'react';
import { Col, Container, Spinner, Modal, Form } from 'react-bootstrap';
import axiosInstance from '../../common/AxiosInstance';
import { message } from 'antd';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';

const AllWorkoutPlans = () => {
  const [filterItemTarget, setItemTarget] = useState('');
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [show, setShow] = useState(false);
  const [updateWorkout, setUpdateWorkout] = useState({
    muscleTargeted: 'Choose...',
    workoutTitle: '',
    workoutPrice: '',
    duration: ''
  });
  const [selectedItem, setSelectedItem] = useState(null);

  const handleChange = (e) => {
    setUpdateWorkout({ ...updateWorkout, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setShow(false);
    setSelectedItem(null);
  };
  console.log("workoutPlans",workoutPlans)
  const handleShow = () => setShow(true);

  const allWorkouts = async () => {
   console.log("hit")
    try {
      const res = await axiosInstance.get('/fetch-workout-plans');
      console.log(res,"status")
      console.log(res.data,"data")
      setWorkoutPlans(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    allWorkouts();
  }, []);

  const filteredPlans = workoutPlans.filter(
    (item) =>
      filterItemTarget === '' ||
      item.muscleTargeted.toLowerCase().includes(filterItemTarget.toLowerCase())
  );

  const updatedItem = (i) => {
    setSelectedItem(i);
    setUpdateWorkout({
      muscleTargeted: i.muscleTargeted,
      workoutTitle: i.workoutTitle,
      workoutPrice: i.workoutPrice,
      duration: i.duration
    });
    handleShow();
  };

  const handleSaveChanges = async () => {
    try {
      const res = await axiosInstance.put(
        `/api/user/trainer/inventory/${selectedItem._id}`,
        updateWorkout,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (res.data.success) {
        message.success(res.data.message);
        allWorkouts();
      } else {
        message.warning(res.data.message);
      }
    } catch (error) {
      console.log(error.message);
    }

    handleClose();
  };

  const deleteItem = async (id) => {
    const sure = confirm('Are you sure to delete this item?');
    if (!sure) return;
    try {
      const res = await axiosInstance.delete(`/api/user/trainer/item/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.data.success) {
        message.success(res.data.message);
        allWorkouts();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Container>
      <h1 className='my-5 text-center text-white'>All Workout Plans</h1>
      <div className="mt-4 filter-container text-center">
        <p className="mt-3">Filter By: </p>
        <select value={filterItemTarget} onChange={(e) => setItemTarget(e.target.value)}>
          <option value="">Select Target</option>
          <option value="Calf">Calf</option>
          <option value="Shoulders">Shoulders</option>
          <option value="Chest">Chest</option>
          <option value="Others">Others</option>
        </select>
      </div>
      <div className="all-items mt-5">
        {filteredPlans && filteredPlans.length > 0 ? (
          filteredPlans.map((item) => (
            <Card key={item._id} sx={{ maxWidth: 300 }}>
              <CardMedia
                component="img"
                height='140'
                src={`http://localhost:8002${item.photo.path}`}
                alt={item.photo.filename}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {item.workoutTitle}
                </Typography>
                <Typography className='d-flex flex-wrap justify-content-between' variant="body2" color="text.secondary" margin={'15px auto'}>
                  <ul>
                    <li><b>Target Muscle:&nbsp;</b> {item.muscleTargeted}</li>
                    <li><b>Duration:&nbsp;</b> {item.duration}</li>
                    <li><b>Price:&nbsp;</b> ${item.workoutPrice}</li>
                  </ul>
                </Typography>
              </CardContent>
              <CardActions className='d-flex w-100 justify-content-between'>
                <Button variant='outlined' size="small" startIcon={<UpdateIcon />} onClick={() => updatedItem(item)}>
                  Update
                </Button>
                <Button variant='outlined' size="small" startIcon={<DeleteIcon />} onClick={() => deleteItem(item._id)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          ))
        ) : (
          <div className="spinner-container">
            <Spinner animation="grow" variant="info" />
          </div>
        )}
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Workout Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="updateWorkoutTitle">
              <Form.Label>Workout Title</Form.Label>
              <Form.Control
                type="text"
                name='workoutTitle'
                value={updateWorkout.workoutTitle}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="updateMuscleTargeted">
              <Form.Label>Target Muscle</Form.Label>
              <Form.Select name='muscleTargeted' value={updateWorkout.muscleTargeted} onChange={handleChange}>
                <option value="">Choose...</option>
                <option value="Calf">Calf</option>
                <option value="Shoulders">Shoulders</option>
                <option value="Chest">Chest</option>
                <option value="Others">Others</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="updateDuration">
              <Form.Label>Workout Duration</Form.Label>
              <Form.Select name='duration' value={updateWorkout.duration} onChange={handleChange}>
                <option value="">Choose...</option>
                <option value="3 days">3 days</option>
                <option value="4 days">4 days</option>
                <option value="5 days">5 days</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="updateWorkoutPrice">
              <Form.Label>Workout Price</Form.Label>
              <Form.Control
                type="number"
                name='workoutPrice'
                value={updateWorkout.workoutPrice}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AllWorkoutPlans;
