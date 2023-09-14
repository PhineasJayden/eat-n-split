import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [activeFriend, setActiveFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleSelect(friend) {
    setActiveFriend((selected) => (selected?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === activeFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setActiveFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          activeFriend={activeFriend}
          onSelect={handleSelect}
        />

        {showAddFriend && (
          <FormAddFriend friends={friends} setFriends={setFriends} />
        )}

        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "close" : "Add Friend"}
        </Button>
      </div>
      {activeFriend && (
        <FormSplitBill
          activeFriend={activeFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FriendsList({ friends, onSelect, activeFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelect={onSelect}
          activeFriend={activeFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelect, activeFriend }) {
  const isSelected = activeFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      <p
        className={
          friend.balance > 0 ? "green" : friend.balance < 0 ? "red" : ""
        }
      >
        {friend.balance === 0
          ? `You and ${friend.name} are even`
          : friend.balance < 0
          ? `You owe ${friend.name} ${Math.abs(friend.balance)}€`
          : `${friend.name} owes you ${friend.balance}€`}
      </p>
      <Button onClick={() => onSelect(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ friends, setFriends }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();
    const id = crypto.randomUUID();
    if (!name || !image) return;
    const newFriend = {
      name,
      image: `${image}?=${id}`,
      balance: 0,
      id,
    };

    setFriends([...friends, newFriend]);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>⭐Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>
      <label>⭐Friend Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      ></input>
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ activeFriend, onSplitBill }) {
  const [bill, setBill] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [payingPerson, setPayingPerson] = useState("You");
  const expensesFriend = bill - expenses;

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !expenses) return;
    onSplitBill(payingPerson === "You" ? expensesFriend : -expenses);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {activeFriend.name}</h2>
      <label>⭐Bill value</label>
      <input
        type="number"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      ></input>
      <label>⭐Your expenses</label>
      <input
        type="number"
        value={expenses}
        onChange={(e) =>
          setExpenses(
            Number(e.target.value) > bill ? expenses : Number(e.target.value)
          )
        }
      ></input>
      <label>⭐{activeFriend.name}'s expenses</label>
      <input type="number" disabled value={expensesFriend}></input>
      <label>⭐Who is paying the Bill?</label>
      <select
        value={payingPerson}
        onChange={(e) => setPayingPerson(e.target.value)}
      >
        <option>You</option>
        <option>{activeFriend.name}</option>
      </select>
      <Button>Split the Bill</Button>
    </form>
  );
}
