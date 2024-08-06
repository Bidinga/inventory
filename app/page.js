'use client'
import { useState, useEffect } from 'react'
import { firestore } from '@/firebase' // Ensure this path is correct
import { Box, Modal, Typography, Stack, TextField, Button, Select, MenuItem } from '@mui/material'
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('name'); // New state for sorting

  const updateInventory = async () => {
    setLoading(true);
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    setLoading(false);
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    try {
      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        await setDoc(docRef, { quantity: quantity + 1 });
      } else {
        await setDoc(docRef, { quantity: 1 });
      }
      await updateInventory();
    } catch (error) {
      console.error("Error adding item:", error);
    }
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    try {
      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        if (quantity === 1) {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, { quantity: quantity - 1 });
        }
      }
      await updateInventory();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  }

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Search filter
  const filteredInventory = inventory.filter(({ name }) => name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Sort inventory based on sortOrder state
  const sortedInventory = [...filteredInventory].sort((a, b) => {
    if (sortOrder === 'name') {
      return a.name.localeCompare(b.name);
    } else {
      return b.quantity - a.quantity;
    }
  });

  // Calculate total number of items
  const totalItems = inventory.reduce((sum, { quantity }) => sum + quantity, 0);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Typography variant="h1" color="#333" textAlign="center" mb={2}>
        iPantry
      </Typography>
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
            transform: "translate(-50%,-50%)"
          }}
        >
          <Typography variant="h4">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName('');
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
        onClick={handleOpen}
        sx={{ mb: 2 }}
      >
        Add New Item
      </Button>
      <TextField
        variant="outlined"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        sx={{ mb: 2 }}
      >
        <MenuItem value="name">Sort by Name</MenuItem>
        <MenuItem value="quantity">Sort by Quantity</MenuItem>
      </Select>
      <Typography variant="h6" color="#333" textAlign="center">
        Total Items: {totalItems}
      </Typography>
      {loading ? (
        <Typography variant="h5" color="#333">
          Loading...
        </Typography>
      ) : (
        <Box border="1px solid #333" width="800px">
          <Box
            height="100px"
            bgcolor="ADD8E6"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="h2" color="#333">
              Inventory Items
            </Typography>
          </Box>
          <Stack width="100%" height="300px" spacing={2} overflow="auto">
            {sortedInventory.map(({ name, quantity }) => (
              <Box
                key={name}
                width="100%"
                minHeight="150px"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgcolor="#f0f0f0"
                padding={5}
              >
                <Typography variant="h3" color="#333" textAlign="center">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h3" color="#333" textAlign="center">
                  {quantity}
                </Typography>
                <Stack direction = "row" spacing={2}>
                   <Button variant="contained" onClick={() => addItem(name)}>
                     Add
                      </Button>
                <Button variant="contained" onClick={() => removeItem(name)}>
                  Remove
                </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  )
}

