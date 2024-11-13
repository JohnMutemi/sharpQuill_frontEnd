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
import './writerportal.css';
import moment from "moment"

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

  // Connect to the socket when the component mounts
  useEffect(() => {
    connectSocket();

    return () => {
      disconnectSocket();
    };
  }, []);
  // Fetch orders and balance when token changes
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
      .catch((error) => console.error('Error fetching balance:', error));
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
      .catch((error) =>
        console.error('Error fetching payment history:', error)
      );
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
    const orderToComplete = inProgress.find(
      (order) => order.id === assignmentId
    );
    if (orderToComplete) {
      setCompletedOrders([...completedOrders, orderToComplete]);
      setInProgress(inProgress.filter((order) => order.id !== assignmentId));
      alert('Order marked as completed!');
    }
  };

  // Join the order chat room when a specific order is selected
  const handleJoinOrderChat = (orderId) => {
    setActiveOrderId(orderId);
    setChatMessages([]); // Reset chat messages when switching orders
    joinOrderRoom(orderId);

    // Listen for new messages in this order's chat
    onMessageReceived((message) => {
      setChatMessages((prevMessages) => [...prevMessages, message]);
    });
  };

  // Send a message in the order chat
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage(activeOrderId, newMessage);
      setNewMessage(''); // Clear input after sending
    }
  };

  // Join the support chat room
  const handleJoinSupportChat = () => {
    joinSupportRoom();

    // Listen for support messages
    onSupportMessageReceived((message) => {
      setSupportMessages((prevMessages) => [...prevMessages, message]);
    });
  };

  // Send a support message
  const handleSendSupportMessage = () => {
    if (supportMessage.trim()) {
      sendSupportMessage(supportMessage);
      setSupportMessage(''); // Clear input after sending
    }
  };

  // Render the chat window for an order
  const renderOrderChat = () => (
    <div className="chat-window">
      <div className="chat-messages">
        {chatMessages.map((msg, index) => (
          <div key={index} className="message">
            {msg}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );

  // Render the support chat window
  const renderSupportChat = () => (
    <div className="support-chat-window">
      <div className="support-chat-messages">
        {supportMessages.map((msg, index) => (
          <div key={index} className="message">
            {msg}
          </div>
        ))}
      </div>
      <div className="support-chat-input">
        <input
          type="text"
          value={supportMessage}
          onChange={(e) => setSupportMessage(e.target.value)}
          placeholder="Ask for help..."
        />
        <button onClick={handleSendSupportMessage}>Send</button>
      </div>
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
            bidAmount={bidAmount}
            setBidAmount={setBidAmount}
            selectedAssignmentId={selectedAssignmentId}
            setSelectedAssignmentId={setSelectedAssignmentId}
            decline={decline}
            setDecline={setDecline}
            onJoinChat={handleJoinOrderChat} // Pass down the chat handler
            
          />
        );
      case 'My Bids':
        return (
          <Section
            title="My Bids"
            orders={myBids}
            onJoinChat={handleJoinOrderChat} // Pass down the chat handler
          />
        );
      case 'In Progress':
        return (
          <Section
            title="Orders in Progress"
            orders={inProgress}
            handleSubmitCompleted={handleSubmitCompleted}
            FileUpload={FileUpload}
            onJoinChat={handleJoinOrderChat} // Pass down the chat handler
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
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Welcome, {user?.username}!</h2>
        {/* <h1>Welcome, {user?.username}!</h1> */}
        <ul>
          <li
            className={activeSection === 'Balance' ? 'active' : ''}
            onClick={() => setActiveSection('Balance')}>
            Account Balance :${balance}
          </li>
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
          <li
            className={activeSection === 'Help' ? 'active' : ''}
            onClick={() => {
              setActiveSection('Help');
              handleJoinSupportChat();
            }}>
            Help (Support)
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1 className="section-header">{activeSection}</h1>
        {activeSection === 'Help' && renderSupportChat()}
        {activeOrderId && renderOrderChat()}
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
  handleSubmitCompleted,
  FileUpload,
  onJoinChat,
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
            <strong>Due Date:</strong>{' '}
            {moment(order.due_date).format('Do MMM, h:mmA')}
          </p>
          <p>
            <strong>Description:</strong>{' '}
            {/*
              logic
              if(order description length <= 50)
                  print order description and pad the end with 50 &nbsp characters
              else
                  print a substring of order description of length 50 and add elipses at the end
            */}
            {order.description.length <= 50
              ? order.description.padEnd(50, '\u00A0 ')
              : order.description.substring(0, 50) + " ..."}
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

          <div className="order-actions">
            {handleBid && (
              <div className="bid-section">
                {/*
                  Wrap checkbox and label in a container div so they can be styled independent from the parent
                  flex - display flex
                  flex-row - flex-direction: row -> align items horizontally
                  item-start - align items to the top on the horizontal axis
                */}
                <div className={"flex flex-row items-start"}>
                  {/* mt-[6px] -> move margin 6px from the top to make text and checkbox aligned*/}
                  <input
                    className={"mt-[6px]"}
                    type="checkbox"
                    checked={selectedAssignmentId === order.id && decline}
                    onChange={() => {
                      setSelectedAssignmentId(order.id);
                      setDecline(!decline);
                    }}
                  />
                  {/* mt-0 - margin top 0, font-medium -> font-weight-500 coz text was too large, text-xs -> make text very small*/}
                  <label className={"mt-0 font-medium text-xs"}>
                    I have read the assignment details and I can deliver
                    exceptional quality
                  </label>
                </div>
                <input
                  type="number"
                  placeholder="Enter bid amount"
                  value={selectedAssignmentId === order.id ? bidAmount : ''}
                  onChange={(e) => setBidAmount(e.target.value)}
                />
                <button onClick={() => handleBid(order.id)}>Place Bid</button>
              </div>
            )}
            {title === 'In Progress' && (
              <div className="file-upload-section">
                <FileUpload assignmentId={order.id} />
                <button onClick={() => handleSubmitCompleted(order.id)}>
                  Mark as Completed
                </button>
              </div>
            )}
            {/* Chat Icon as Emoji for Chat */}
            <div className="chat-icon" onClick={() => onJoinChat(order.id)}>
              <span role="img" aria-label="Chat" className="chat-emoji">
                💬
              </span>
              <span>Chat Customer</span>
            </div>
          </div>
        </div>
      ))
    ) : (
      <p>No {title.toLowerCase()} available</p>
    )}
  </div>
);

// Balance Section
const BalanceSection = ({ balance, fetchPaymentHistory, paymentHistory }) => {
  useEffect(() => {
    fetchPaymentHistory();
  }, [fetchPaymentHistory]);

  return (
    <div className="balance-section">
      <h2>Balance: ${balance}</h2>
      <h3>Payment History</h3>
      <ul>
        {paymentHistory.length > 0 ? (
          paymentHistory.map((payment) => (
            <li key={payment.id}>
              {payment.date}: ${payment.amount} - {payment.description}
            </li>
          ))
        ) : (
          <li>No payment history available.</li>
        )}
      </ul>
    </div>
  );
};

export default WriterPortal;
