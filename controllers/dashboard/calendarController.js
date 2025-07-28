// controllers/calendarController.js
const Calendar = require('../../models/dashboard/Calendar');

exports.addEvent = async (req, res) => {
    try {
      const { title, label, start_date, end_date, event_url, guest, location, description } = req.body;
      const moment = require('moment-timezone');
  
      await Calendar.create({
        title,
        label,
        start_date: moment(start_date).tz('Asia/Jakarta').format('YYYY-MM-DD'), // tanggal saja
        end_date: moment(end_date).tz('Asia/Jakarta').format('YYYY-MM-DD'),
        event_url,
        guest,
        location,
        description
      });
  
      req.flash('success', 'Event added to calendar successfully!');
      res.redirect('/dashboard');
    } catch (error) {
      console.error('Add Event Error:', error);
      req.flash('error', 'Failed to add event.');
      res.redirect('/dashboard');
    }
  };
  

  exports.updateEvent = async (req, res) => {
    try {
      const moment = require('moment-timezone');
      const { id } = req.params;
      const { title, label, start_date, end_date, event_url, guest, location, description } = req.body;
  
      const calendarEvent = await Calendar.findByPk(id);
      if (!calendarEvent) {
        req.flash('error', 'Event not found.');
        return res.redirect('/dashboard');
      }
  
      calendarEvent.title = title;
      calendarEvent.label = label;
      calendarEvent.start_date = moment(start_date).tz('Asia/Jakarta').format('YYYY-MM-DD'); // tanggal saja
      calendarEvent.end_date = moment(end_date).tz('Asia/Jakarta').format('YYYY-MM-DD');
      calendarEvent.event_url = event_url;
      calendarEvent.guest = guest;
      calendarEvent.location = location;
      calendarEvent.description = description;
  
      await calendarEvent.save();
  
      req.flash('success', 'Event updated successfully!');
      res.redirect('/dashboard');
    } catch (error) {
      console.error('Update Event Error:', error);
      req.flash('error', 'Failed to update event.');
      res.redirect('/dashboard');
    }
  };
  
  
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Calendar.findAll();
    res.json(events);
  } catch (error) {
    console.error('Get Events Error:', error);
    res.status(500).json({ error: 'Failed to fetch events.' });
  }
};

exports.deleteEvent = async (req, res) => {
    try {
      const { id } = req.params;
  
      const calendarEvent = await Calendar.findByPk(id);
      if (!calendarEvent) {
        req.flash('error', 'Event not found.');
        return res.redirect('/dashboard');
      }
  
      await calendarEvent.destroy();
  
      req.flash('success', 'Event deleted successfully!');
      res.redirect('/dashboard');
    } catch (error) {
      console.error('Delete Event Error:', error);
      req.flash('error', 'Failed to delete event.');
      res.redirect('/dashboard');
    }
  };  