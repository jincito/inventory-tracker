"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { collection, deleteDoc, getDocs, query } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]); //state var to store inventory
  const [open, setOpen] = useState(false); //state variables used to add and remove items
  const [itemName, setItemName] = useState(""); //store name of console input

  //wont block code while fetching, entire website freezes while fetching
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    //snapshot is the inventory on firebase db
    const docs = await getDocs(snapshot);
    //fetches snapshot(inventory in DB)'s documents
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    console.log(inventoryList);
  };

  const addItem = async () => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDocs(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantiy + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  const removeItem = async () => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDocs(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  useEffect(() => {
    // updates the inventory when the "dependency" array.
    updateInventory();
  }, []); // dependency array = [] | Array is empty so only updates when the page loads:)

  // model helper function
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      height="100vh"
      flexDirection="column"
      display="flex"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            // mui sx
            transform: "translate(-50%,-50%)",
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button
        variant="contained"
        onClick={() => {
          handleOpen();
        }}
      >
        Add New Item
      </Button>
      <Box border="1px solid #333">
        <Box width="800px" height="100px" bgcolor="#ADD8E6"></Box>
      </Box>
    </Box>
  );
}
