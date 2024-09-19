import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import './writerportal.css';

const WriterPortal = () => {
  const [availableOrders, setAvailableOrders] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [canceledOrders, setCanceledOrders] = useState([]);
  const [bidAmount, setBidAmount] = useState('');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [decline, setDecline] = useState(false);
  const [activeSection, setActiveSection] = useState('Available Orders');
  const { token } = useUser();

  // Fetch orders based on status
  useEffect(() => {
    fetchOrders('available', setAvailableOrders);
    fetchOrders('my-bids', setMyBids);
    fetchOrders('in-progress', setInProgress);
    fetchOrders('completed', setCompletedOrders);
    fetchOrders('canceled', setCanceledOrders);
  }, [token]);

  const fetchOrders = (status, setState) => {
    fetch(`http://127.0.0.1:5555/assignments?status=${status}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setState(data);
        } else {
          console.error('Expected an array but got:', data);
          setState([]);
        }
      })
      .catch((error) => {
        console.error(`Error fetching ${status} orders:`, error);
        setState([]);
      });
  };

  const handleBid = (assignmentId) => {
    if (!bidAmount || isNaN(bidAmount) || Number(bidAmount) <= 0) {
      alert('Please enter a valid bid amount');
      return;
    }

    fetch('http://127.0.0.1:5555/bids', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assignment_id: assignmentId,
        amount: bidAmount,
        decline: decline,
      }),
    })
      .then((response) => {
        if (response.ok) {
          moveOrderToMyBids(assignmentId);
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then(() => {
        alert('Bid placed successfully');
        setBidAmount('');
        setDecline(false);
        setSelectedAssignmentId(null);
      })
      .catch((error) => {
        console.error('Error placing bid:', error);
      });
  };

  const moveOrderToMyBids = (assignmentId) => {
    const updatedAvailableOrders = availableOrders.filter(
      (order) => order.id !== assignmentId
    );
    setAvailableOrders(updatedAvailableOrders);

    const bidOrder = availableOrders.find((order) => order.id === assignmentId);
    if (bidOrder) {
      setMyBids([...myBids, bidOrder]);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'Available Orders':
        return (
          <Section
            title="Available Orders"
            orders={availableOrders}
            handleBid={handleBid}
            bidAmount={bidAmount}
            setBidAmount={setBidAmount}
            selectedAssignmentId={selectedAssignmentId}
            setSelectedAssignmentId={setSelectedAssignmentId}
            decline={decline}
            setDecline={setDecline}
          />
        );
      case 'My Bids':
        return <Section title="My Bids" orders={myBids} />;
      case 'In Progress':
        return <Section title="Orders in Progress" orders={inProgress} />;
      case 'Completed Orders':
        return <Section title="Completed Orders" orders={completedOrders} />;
      case 'Canceled Orders':
        return <Section title="Canceled Orders" orders={canceledOrders} />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Writer Portal</h2>
        <ul>
          <li
            className={activeSection === 'Available Orders' ? 'active' : ''}
            onClick={() => setActiveSection('Available Orders')}>
            Available Orders
          </li>
          <li
            className={activeSection === 'My Bids' ? 'active' : ''}
            onClick={() => setActiveSection('My Bids')}>
            My Bids
          </li>
          <li
            className={activeSection === 'In Progress' ? 'active' : ''}
            onClick={() => setActiveSection('In Progress')}>
            In Progress
          </li>
          <li
            className={activeSection === 'Completed Orders' ? 'active' : ''}
            onClick={() => setActiveSection('Completed Orders')}>
            Completed Orders
          </li>
          <li
            className={activeSection === 'Canceled Orders' ? 'active' : ''}
            onClick={() => setActiveSection('Canceled Orders')}>
            Canceled Orders
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1 className="section-header">{activeSection}</h1>
        {renderSection()}
      </div>
    </div>
  );
};

// Section Component to Render Orders as Cards
const Section = ({
  title,
  orders,
  handleBid,
  bidAmount,
  setBidAmount,
  selectedAssignmentId,
  setSelectedAssignmentId,
  decline,
  setDecline,
}) => (
  <div className="orders-list">
    {orders.length > 0 ? (
      orders.map((order) => (
        <div
          key={order.id}
          className={`order-card ${
            title === 'Completed Orders'
              ? 'completed'
              : title === 'In Progress'
              ? 'in-progress'
              : title === 'Canceled Orders'
              ? 'canceled'
              : ''
          }`}>
          <h3>{order.title}</h3>
          <p>
            <strong>Due Date:</strong> {order.due_date}
          </p>
          <p>
            <strong>Description:</strong> {order.description}
          </p>
          <p>
            <strong>Price Tag:</strong> {order.price_tag}
          </p>
          <p>
            <strong>Pages:</strong> {order.pages}
          </p>
          <p>
            <strong>Reference Style:</strong> {order.reference_style}
          </p>
          {handleBid && (
            <div className="bid-section">
              <input
                type="checkbox"
                checked={selectedAssignmentId === order.id && decline}
                onChange={() => {
                  setSelectedAssignmentId(order.id);
                  setDecline(!decline);
                }}
              />
              <label>
                I have read the assignment details and can deliver exceptional
                quality
              </label>
              <input
                type="number"
                placeholder="Enter bid amount"
                value={selectedAssignmentId === order.id ? bidAmount : ''}
                onChange={(e) => setBidAmount(e.target.value)}
              />
              <button onClick={() => handleBid(order.id)}>Place Bid</button>
            </div>
          )}
        </div>
      ))
    ) : (
      <p>No {title.toLowerCase()} available</p>
    )}
  </div>
);

export default WriterPortal;
