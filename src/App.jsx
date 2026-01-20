import { useEffect, useState } from "react";
import "./App.css";
import Card from "./components/card/card";
import Cart from "./components/cart/cart";
import { getData } from "./constants/db";
import { useCallback } from "react";
const courses = getData();
const telegram = window.Telegram.WebApp;

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  useEffect(() => {
    telegram.ready();
  });
  const onAddItem = (item) => {
    const exsitItem = cartItems.find((c) => c.id == item.id);

    if (exsitItem) {
      const newData = cartItems.map((c) =>
        c.id == item.id
          ? { ...exsitItem, quantity: exsitItem.quantity + 1 }
          : c,
      );

      setCartItems(newData);
    } else {
      const newData = [...cartItems, { ...item, quantity: 1 }];

      setCartItems(newData);
    }
  };

  const onRemoveItem = (item) => {
    const exsitItem = cartItems.find((c) => c.id == item.id);

    if (exsitItem.quantity === 1) {
      const newData = cartItems.filter((c) => c.id !== exsitItem.id);

      setCartItems(newData);
    } else {
      const newData = cartItems.map((c) =>
        c.id === exsitItem.id
          ? { ...exsitItem, quantity: exsitItem.quantity - 1 }
          : c,
      );

      setCartItems(newData);
    }
  };
  const onCheckout = () => {
    telegram.MainButton.text = "Sotib Olish";
    telegram.MainButton.show();
  };
  const onSendData = useCallback(() => {
    const queryID = telegram.initDataUnsave?.query_id;
    if(queryID){
      fetch("http://localhost:8000/web-data",{
        method: "POST",
        headers: {"Content-Type": 'application/json'},
        body: JSON.stringify(cartItems)
      })
    }else{

      telegram.sendData(JSON.stringify(cartItems));
    }
  }, [cartItems]);
  useEffect(() => {
  telegram.onEvent("mainButtonClicked", onSendData);
  return () => telegram.offEvent("mainButtonClicked", onSendData);
}, [onSendData]);

  return (
    <div className="">
      <h1>Sammi kurslarssss</h1>
      <Cart cartItems={cartItems} onCheckout={onCheckout} />
      <div className="cards__container">
        {courses.map((course) => {
          return (
            <Card
              key={course.id}
              onRemoveItem={onRemoveItem}
              onAddItem={onAddItem}
              course={course}
            />
          );
        })}
      </div>
    </div>
  );
};

export default App;
