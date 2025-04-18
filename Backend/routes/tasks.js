const express = require('express');
const router  = express.Router();
const Task    = require('../models/Task');

// CREATE under a project
router.post('/', async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ ALL tasks (optionally filter by projectId)
router.get('/', async (req, res) => {
  const filter = {};
  if (req.query.projectId) filter.projectId = req.query.projectId;
  const list = await Task.find(filter).sort('-createdAt');
  res.json(list);
});

// READ ONE
router.get('/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ error: 'Not found' });
  res.json(task);
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = router;
