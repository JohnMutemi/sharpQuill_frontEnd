import React, { useState, useEffect } from 'react';
import './PostAssignment.css';
import { useUser } from './UserContext';

const PostAssignment = () => {
  const { user, token } = useUser();
  console.log('Token:', token);
  console.log('User:', user);

  const [assignment, setAssignment] = useState({
    title: '',
    due_date: '',
    description: '',
    price_tag: '',
    pages: '',
    reference_style: '',
  });

  const [assignments, setAssignments] = useState(() => {
    const savedAssignments = localStorage.getItem('assignments');
    return savedAssignments ? JSON.parse(savedAssignments) : [];
  });

  const [showForm, setShowForm] = useState(true);
  const [editingAssignment, setEditingAssignment] = useState(null);

useEffect(() => {
  const fetchAssignments = async () => {
    if (!token) {
      alert('No token found. Please log in.');
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:5555/assignments?user_id=${user.userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      if (Array.isArray(data)) {
        setAssignments(data);
        localStorage.setItem('assignments', JSON.stringify(data));
      } else {
        console.error('Unexpected response format:', data);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  if (user) fetchAssignments();
}, [token, user]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssignment((prevAssignment) => ({
      ...prevAssignment,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('You must be logged in to post an assignment.');
      return;
    }

    if (!token) {
      alert('No token found. Please log in.');
      return;
    }

    const formData = new FormData();
    formData.append('title', assignment.title);
    formData.append('due_date', assignment.due_date);
    formData.append('description', assignment.description);
    formData.append('price_tag', assignment.price_tag);
    formData.append('pages', assignment.pages);
    formData.append('reference_style', assignment.reference_style);
    formData.append('user_id', user.userId); // Include user ID in the form data

    try {
      const url = editingAssignment
        ? `http://127.0.0.1:5555/assignments/${editingAssignment.id}`
        : 'http://127.0.0.1:5555/assignments';

      const response = await fetch(url, {
        method: editingAssignment ? 'PUT' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        alert('Assignment posted/updated successfully!');

        setAssignments((prevAssignments) => {
          const updatedAssignments = editingAssignment
            ? prevAssignments.map((assgn) =>
                assgn.id === data.id ? data : assgn
              )
            : [...prevAssignments, data];
          localStorage.setItem(
            'assignments',
            JSON.stringify(updatedAssignments)
          );
          return updatedAssignments;
        });

        setAssignment({
          title: '',
          due_date: '',
          description: '',
          price_tag: '',
          pages: '',
          reference_style: '',
        });
        setEditingAssignment(null);
        setShowForm(false);
      } else {
        const errorMessage = await response.text();
        console.error('Failed to post/update assignment:', errorMessage);
        alert('Failed to post/update assignment. Please try again.');
      }
    } catch (error) {
      console.error('Error posting/updating assignment:', error);
      alert('Error while posting/updating assignment. Please try again.');
    }
  };

  const handleEdit = (assignment) => {
    setAssignment({
      title: assignment.title,
      due_date: assignment.due_date,
      description: assignment.description,
      price_tag: assignment.price_tag,
      pages: assignment.pages,
      reference_style: assignment.reference_style,
    });
    setEditingAssignment(assignment);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!user) {
      alert('You must be logged in to delete an assignment.');
      return;
    }

    if (!token) {
      alert('No token found. Please log in.');
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:5555/assignments/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Assignment deleted successfully!');
        setAssignments((prevAssignments) =>
          prevAssignments.filter((assignment) => assignment.id !== id)
        );
        localStorage.setItem(
          'assignments',
          JSON.stringify(
            assignments.filter((assignment) => assignment.id !== id)
          )
        );
      } else {
        const errorMessage = await response.text();
        console.error('Failed to delete assignment:', errorMessage);
        alert('Failed to delete assignment. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting assignment:', error);
      alert('Error while deleting assignment. Please try again.');
    }
  };

  return (
    <div className="post-assignment-container">
      <button
        className="toggle-form-button"
        onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Hide Form' : 'Show Form'}
      </button>

      {showForm && (
        <form className="post-assignment-form" onSubmit={handleSubmit}>
          <h2>
            {editingAssignment ? 'Edit Assignment' : 'Post a New Assignment'}
          </h2>
          <div className="input-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={assignment.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="due_date">Due Date</label>
            <input
              type="date"
              id="due_date"
              name="due_date"
              value={assignment.due_date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="description">Assignment Description</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={assignment.description}
              onChange={handleChange}
              required></textarea>
          </div>
          <div className="input-group">
            <label htmlFor="price_tag">Price Tag</label>
            <input
              type="number"
              id="price_tag"
              name="price_tag"
              value={assignment.price_tag}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="pages">Number of Pages</label>
            <input
              type="number"
              id="pages"
              name="pages"
              value={assignment.pages}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="reference_style">Reference Style</label>
            <select
              id="reference_style"
              name="reference_style"
              value={assignment.reference_style}
              onChange={handleChange}
              required>
              <option value="" disabled>
                Select Reference Style
              </option>
              <option value="APA">APA</option>
              <option value="MLA">MLA</option>
              <option value="Chicago">Chicago</option>
              <option value="Harvard">Harvard</option>
            </select>
          </div>
          <button type="submit" className="post-assignment-button">
            {editingAssignment ? 'Update Assignment' : 'Post Assignment'}
          </button>
        </form>
      )}

      <div className="assignment-list">
        <h2>Posted Assignments</h2>
        {assignments.length === 0 ? (
          <p>No assignments posted yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Due Date</th>
                <th>Description</th>
                <th>Price</th>
                <th>Pages</th>
                <th>Reference Style</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment.id}>
                  <td>{assignment.title}</td>
                  <td>{assignment.due_date}</td>
                  <td>{assignment.description}</td>
                  <td>{assignment.price_tag}</td>
                  <td>{assignment.pages}</td>
                  <td>{assignment.reference_style}</td>
                  <td>
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(assignment)}>
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(assignment.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PostAssignment;
