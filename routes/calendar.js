// routes/calendar.js
const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/dashboard/calendarController');

// Add Event
router.post('/store', calendarController.addEvent);

// Update Event
router.post('/update/:id', calendarController.updateEvent);

// Get All Events (for FullCalendar fetch)
router.get('/all', calendarController.getAllEvents);

// Delete Event
router.post('/delete/:id', calendarController.deleteEvent);

module.exports = router;
