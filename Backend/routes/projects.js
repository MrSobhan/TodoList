const express = require('express');
const router  = express.Router();
const Project = require('../models/Project');

// CREATE
router.post('/', async (req, res) => {
  try {
    const proj = await Project.create(req.body);
    res.status(201).json(proj);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ ALL
router.get('/', async (req, res) => {
  const list = await Project.find().sort('-createdAt');
  res.json(list);
});

// READ ONE
router.get('/:id', async (req, res) => {
  const proj = await Project.findById(req.params.id);
  if (!proj) return res.status(404).json({ error: 'Not found' });
  res.json(proj);
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const proj = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(proj);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = router;
