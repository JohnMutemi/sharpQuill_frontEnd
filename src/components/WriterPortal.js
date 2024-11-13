import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import FileUpload from './FileUpload';
import {
  connectSocket,
  disconnectSocket,
  joinOrderRoom,
  sendMessage,
  onMessageReceived,
  joinSupportRoom,
  sendSupportMessage,
  onSupportMessageReceived,
} from './socket';
import moment from 'moment';

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
  const [balance, setBalance] = useState(100);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [supportMessages, setSupportMessages] = useState([]);
  const [supportMessage, setSupportMessage] = useState('');
  const { user } = useUser();
  const { token } = useUser();

  useEffect(() => {
    connectSocket();
    return () => disconnectSocket();
  }, []);

  useEffect(() => {
    fetchOrders('available', setAvailableOrders);
    fetchOrders('my-bids', setMyBids);
    fetchOrders('in-progress', setInProgress);
    fetchOrders('completed', setCompletedOrders);
    fetchOrders('canceled', setCanceledOrders);
    fetchBalance();
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
        setState(Array.isArray(data) ? data : []);
      })
      .catch(() => setState([]));
  };

  const fetchBalance = () => {
    fetch('http://127.0.0.1:5555/balance', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => setBalance(data.balance))
      .catch(() => {});
  };

  const fetchPaymentHistory = () => {
    fetch('http://127.0.0.1:5555/payment-history', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => setPaymentHistory(data))
      .catch(() => {});
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

  const handleSubmitCompleted = (assignmentId) => {
    setCompletedOrders((prev) => [
      ...prev,
      ...inProgress.filter((order) => order.id === assignmentId),
    ]);
    setInProgress((prev) => prev.filter((order) => order.id !== assignmentId));
    alert('Order marked as completed!');
  };

  const handleJoinOrderChat = (orderId) => {
    setActiveOrderId(orderId);
    setChatMessages([]);
    joinOrderRoom(orderId);
    onMessageReceived((message) => {
      setChatMessages((prev) => [...prev, message]);
    });
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage(activeOrderId, newMessage);
      setNewMessage('');
    }
  };

  const handleJoinSupportChat = () => {
    joinSupportRoom();
    onSupportMessageReceived((message) => {
      setSupportMessages((prev) => [...prev, message]);
    });
  };

  const handleSendSupportMessage = () => {
    if (supportMessage.trim()) {
      sendSupportMessage(supportMessage);
      setSupportMessage('');
    }
  };

  const renderOrderChat = () => (
    <div className="bg-primaryLight p-4 rounded-lg border border-primaryAccent">
      <div className="mb-4 space-y-2">
        {chatMessages.map((msg, index) => (
          <div key={index} className="text-secondary">
            {msg}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type your message..."
        className="border border-primaryAccent rounded w-full px-3 py-2"
      />
      <button
        onClick={handleSendMessage}
        className="mt-2 w-full bg-primaryAccent text-primaryDark font-semibold py-2 rounded">
        Send
      </button>
    </div>
  );

  const renderSupportChat = () => (
    <div className="bg-primaryLight p-4 rounded-lg border border-primaryAccent">
      <div className="mb-4 space-y-2">
        {supportMessages.map((msg, index) => (
          <div key={index} className="text-secondary">
            {msg}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={supportMessage}
        onChange={(e) => setSupportMessage(e.target.value)}
        placeholder="Ask for help..."
        className="border border-primaryAccent rounded w-full px-3 py-2"
      />
      <button
        onClick={handleSendSupportMessage}
        className="mt-2 w-full bg-primaryAccent text-primaryDark font-semibold py-2 rounded">
        Send
      </button>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'Available Orders':
        return (
          <Section
            title="Available Orders"
            orders={availableOrders}
            handleBid={handleBid}
          />
        );
      case 'My Bids':
        return <Section title="My Bids" orders={myBids} />;
      case 'In Progress':
        return (
          <Section
            title="In Progress"
            orders={inProgress}
            handleSubmitCompleted={handleSubmitCompleted}
            FileUpload={FileUpload}
          />
        );
      case 'Completed Orders':
        return <Section title="Completed Orders" orders={completedOrders} />;
      case 'Canceled Orders':
        return <Section title="Canceled Orders" orders={canceledOrders} />;
      case 'Balance':
        return (
          <BalanceSection
            balance={balance}
            fetchPaymentHistory={fetchPaymentHistory}
            paymentHistory={paymentHistory}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-primaryLight">
      <div className="w-1/4 bg-primaryDark text-primaryLight p-5 space-y-4">
        <h2 className="text-2xl">Welcome, {user?.username}!</h2>
        <ul className="space-y-2">
          {[
            'Balance',
            'Available Orders',
            'My Bids',
            'In Progress',
            'Completed Orders',
            'Canceled Orders',
            'Help',
          ].map((section) => (
            <li
              key={section}
              className={`p-2 rounded cursor-pointer ${
                activeSection === section
                  ? 'bg-primaryAccent text-primaryDark'
                  : 'hover:bg-primaryAccent'
              }`}
              onClick={() => {
                setActiveSection(section);
                if (section === 'Help') handleJoinSupportChat();
              }}>
              {section}
            </li>
          ))}
        </ul>
      </div>
      <div className="w-3/4 p-6">
        <h1 className="text-3xl font-bold text-primaryDark mb-4">
          {activeSection}
        </h1>
        {activeSection === 'Help' ? renderSupportChat() : renderSection()}
      </div>
    </div>
  );
};

const Section = ({
  title,
  orders,
  handleBid,
  handleSubmitCompleted,
  FileUpload,
}) => {
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [decline, setDecline] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [showDescription, setShowDescription] = useState(null); // To toggle the full description

  const toggleDescription = (orderId) => {
    setShowDescription(showDescription === orderId ? null : orderId); // Toggle the description view
  };

  // If onJoinChat is a function passed in from a parent, include it as a prop; otherwise, define it here
  const onJoinChat = (orderId) => {
    console.log(`Joining chat for order ${orderId}`);
    // Add any other logic you want to handle here for joining a chat
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primaryDark">{title}</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {' '}
        {/* 2 cards per row */}
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order.id}
              className={`p-5 border rounded-lg shadow-sm ${
                title === 'Completed Orders'
                  ? 'bg-primaryLight border-secondary'
                  : title === 'In Progress'
                  ? 'bg-primaryAccent border-primaryDark'
                  : title === 'Canceled Orders'
                  ? 'bg-highlight border-primaryDark'
                  : 'bg-white border-secondary'
              }`}>
              <h3 className="text-xl font-semibold mb-2 text-primaryDark">
                {order.title}
              </h3>
              <p className="text-sm text-primaryDark">
                <strong>Due Date:</strong>{' '}
                {moment(order.due_date).format('Do MMM, h:mmA')}
              </p>
              <div className="text-sm text-primaryDark">
                <strong>Description:</strong>{' '}
                <button
                  onClick={() => toggleDescription(order.id)}
                  className="text-blue-500 underline">
                  {order.description.length <= 50
                    ? order.description
                    : `${order.description.substring(0, 50)}...`}
                </button>
                {showDescription === order.id && (
                  <div className="mt-2 p-4 border border-primaryLight bg-gray-50 rounded-lg">
                    <p>{order.description}</p>
                  </div>
                )}
              </div>
              <p className="text-sm text-primaryDark">
                <strong>Price Tag:</strong> {order.price_tag}
              </p>
              <p className="text-sm text-primaryDark">
                <strong>Pages:</strong> {order.pages}
              </p>
              <p className="text-sm text-primaryDark">
                <strong>Reference Style:</strong> {order.reference_style}
              </p>

              <div className="mt-4 space-y-2">
                {handleBid && (
                  <div className="flex flex-col items-start space-y-2">
                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        className="mt-1 accent-highlight"
                        checked={selectedAssignmentId === order.id && decline}
                        onChange={() => {
                          setSelectedAssignmentId(order.id);
                          setDecline(!decline);
                        }}
                      />
                      <label className="text-xs font-medium text-primaryDark">
                        I have read the assignment details and I can deliver
                        exceptional quality
                      </label>
                    </div>
                    <input
                      type="number"
                      placeholder="Enter bid amount"
                      className="w-full p-2 border border-secondary rounded text-primaryDark"
                      value={selectedAssignmentId === order.id ? bidAmount : ''}
                      onChange={(e) => setBidAmount(e.target.value)}
                    />
                    <button
                      onClick={() => handleBid(order.id)}
                      className="w-full px-4 py-2 bg-primaryAccent text-primaryDark font-bold rounded hover:bg-highlight">
                      Place Bid
                    </button>
                  </div>
                )}
                {title === 'In Progress' && (
                  <div className="space-y-2">
                    <FileUpload assignmentId={order.id} />
                    <button
                      onClick={() => handleSubmitCompleted(order.id)}
                      className="w-full px-4 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600">
                      Mark as Completed
                    </button>
                  </div>
                )}
                <div
                  className="flex items-center space-x-2 cursor-pointer text-primaryDark"
                  onClick={() => onJoinChat(order.id)}>
                  <span role="img" aria-label="Chat" className="text-lg">
                    💬
                  </span>
                  <span className="text-sm font-medium">Chat Customer</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-primaryDark">No {title.toLowerCase()} available</p>
        )}
      </div>
    </div>
  );
};

const BalanceSection = ({ balance, fetchPaymentHistory, paymentHistory }) => (
  <div className="bg-primaryLight p-4 rounded-lg border border-primaryAccent">
    <h2 className="text-xl font-semibold text-primaryDark mb-4">Balance</h2>
    <div className="mb-4">
      <h3 className="text-2xl font-bold text-primaryDark">${balance}</h3>
    </div>
    <button
      onClick={fetchPaymentHistory}
      className="bg-primaryAccent text-primaryDark font-semibold py-2 px-4 rounded">
      View Payment History
    </button>
    {paymentHistory.length > 0 && (
      <div className="mt-4 space-y-2">
        {paymentHistory.map((payment, index) => (
          <div key={index} className="border-b border-primaryAccent pb-2">
            <p className="text-secondary">
              {payment.date} - ${payment.amount}
            </p>
            <p className="text-secondary">{payment.status}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default WriterPortal;
