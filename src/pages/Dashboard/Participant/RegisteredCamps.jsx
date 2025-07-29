import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  CircularProgress,
  Box,
} from "@mui/material";
import { format } from "date-fns";
import useAuth from "../../../hooks/useAuth";

const RegisteredCamps = () => {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const email = user?.email;
  useEffect(() => {
    const fetchRegisteredCamps = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/camps-with-registrations/${email}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch registered camps");
        }
        const data = await response.json();
        setCamps(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRegisteredCamps();
  }, [email]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" mt={4}>
        Error: {error}
      </Typography>
    );
  }

  if (camps.length === 0) {
    return (
      <Typography variant="h6" align="center" mt={4}>
        No camps registered for {email}
      </Typography>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Registered Camps for {email}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Camp Name</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Fees</TableCell>
              <TableCell>Healthcare Professional</TableCell>
              <TableCell>Registration Date</TableCell>
              <TableCell>Payment Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {camps.map((camp) => (
              <TableRow key={camp._id}>
                <TableCell>{camp.name}</TableCell>
                <TableCell>{format(new Date(camp.dateTime), "PPPp")}</TableCell>
                <TableCell>{camp.location}</TableCell>
                <TableCell>${camp.fees}</TableCell>
                <TableCell>{camp.healthcareProfessional}</TableCell>
                <TableCell>
                  {format(
                    new Date(camp.participants[0].registrationDate),
                    "PPPp"
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={camp.participants[0].paymentStatus}
                    color={
                      camp.participants[0].paymentStatus === "Paid"
                        ? "success"
                        : "warning"
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default RegisteredCamps;
