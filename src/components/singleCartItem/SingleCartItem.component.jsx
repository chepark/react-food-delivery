import { useState, useEffect, useContext } from "react";

import { CartContext } from "../../contexts/CartContext";
import { AuthContext } from "../../contexts/AuthContext";
import { ADD_TO_CART } from "../../types/types";
import {
  editCartItemQuantityInFirestore,
  removeCartItemFromFirestore,
} from "../../apis";

import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import {
  listItemContainerMui,
  listItemLeftMui,
  listItemRightMui,
} from "../menuItem/singleMenuMuiStyles";

const SingleCartItem = ({ cartItem, user, cartItems, setCartItems }) => {
  const { state: cartState, dispatch: cartDispatch } = useContext(CartContext);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [changedQuantity, setChangedQuantity] = useState(cartItem.quantity);

  useEffect(() => {
    editCartItemQuantityInFirestore(
      authState.user.uid,
      cartItem,
      changedQuantity,
      (cartItemsArr) => {
        setLoading(false);
        setCartItems(cartItemsArr);
        cartDispatch({ type: ADD_TO_CART, payload: cartItemsArr });
      }
    );

    setLoading(true);
  }, [changedQuantity]);

  const handleQuantityChange = (e) => {
    e.preventDefault();
    setChangedQuantity(e.target.value);
  };

  //!refactoring
  const handleRemove = (e) => {
    e.preventDefault();
    // remove from firestore
    removeCartItemFromFirestore(user, cartItem, (cartItemsArr) => {
      cartDispatch({ type: ADD_TO_CART, payload: cartItemsArr });
    });

    // remove from cart state
    const cartItemsAfterRemoving = [];
    cartItems.forEach((item) => {
      if (item.name !== cartItem.name) {
        cartItemsAfterRemoving.push(item);
      }
    });
    setCartItems(cartItemsAfterRemoving);
  };

  return (
    <>
      <ListItem disabled={loading} sx={listItemContainerMui}>
        <Box component="div" sx={listItemLeftMui}>
          <img
            className="menu-image"
            src={cartItem.imageURL}
            alt={cartItem.name}
          />
          <ListItemText
            primary={cartItem.name}
            secondary={"€" + cartItem.price}
          />
        </Box>
        <Box component="div" sx={listItemRightMui}>
          <TextField
            // error={isError}
            // helperText={errorMessage}
            size="small"
            id="quantity"
            label="Quantity"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            value={changedQuantity}
            onChange={handleQuantityChange}
          />

          <Button
            variant="outlined"
            sx={{ width: "100%" }}
            onClick={(e) => handleRemove(e, cartItem)}
          >
            Remove
          </Button>
        </Box>
      </ListItem>
      <Divider />
    </>
  );
};

export default SingleCartItem;
