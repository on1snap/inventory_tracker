"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Typography,
  Stack,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  FormControl,
  OutlinedInput,
  InputLabel,
} from "@mui/material";
import { firestore } from "../firebase";
import { collection, getDocs, query, doc, getDoc, deleteDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    updateInventory();
  }, []);

  const updateInventory = async () => {
    try {
      const docs = await getDocs(query(collection(firestore, 'Inventory')));
      setInventory(docs.docs.map(doc => ({ name: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error updating inventory:", error);
    }
  };

  const addItem = () => {
    if (!itemName.trim() || quantity < 1) return;

    setInventory([...inventory, { name: itemName, Quantity: quantity }]);
    setItemName('');
    setQuantity(1);
    setOpen(false);
  };

  const removeItem = async (itemName) => {
    try {
      await deleteDoc(doc(firestore, 'Inventory', itemName.trim()));
      updateInventory();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      const docSnap = await getDoc(doc(firestore, 'Inventory', searchTerm.trim()));
      setSearchResult({ name: searchTerm, quantity: docSnap.exists() ? docSnap.data().Quantity : 0 });
    } catch (error) {
      console.error("Error searching for item:", error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box display="flex" flexDirection="column" alignItems="center" mt={4} mb={4}>
        <Typography variant="h4" gutterBottom>Welcome to the Inventory Manager</Typography>
        <Box display="flex" width="100%" mb={2} gap={2}>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ bgcolor: 'white' }}
          />
          <Button variant="contained" onClick={handleSearch}>Search</Button>
        </Box>
        {searchResult && (
          <Box mt={2} mb={2} p={2} border="1px solid #333" borderRadius="8px">
            <Typography variant="h6">Search Result:</Typography>
            <Typography>{searchResult.name}: {searchResult.quantity} in stock</Typography>
          </Box>
        )}
        <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>Add Item</Button>
      </Box>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box position="absolute" top="50%" left="50%" width={400} bgcolor="white" borderRadius="8px" boxShadow={24} p={4} display="flex" flexDirection="column" gap={2} sx={{ transform: 'translate(-50%, -50%)' }}>
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Quantity</InputLabel>
              <OutlinedInput
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                label="Quantity"
                inputProps={{ min: 1 }}
              />
            </FormControl>
          </Stack>
          <Button variant="contained" onClick={addItem} fullWidth sx={{ mt: 2 }}>Add</Button>
        </Box>
      </Modal>
      <Typography variant="h5" align="center" sx={{ mb: 2 }}>Pantry Items</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.map(({ name, Quantity }) => (
              <TableRow key={name}>
                <TableCell>{name}</TableCell>
                <TableCell align="center">{Quantity}</TableCell>
                <TableCell align="center">
                  <Button variant="contained" color="primary" sx={{ mr: 1 }}>Edit Quantity</Button>
                  <Button variant="contained" color="primary" onClick={() => removeItem(name)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
