const Lookup = require("../models/Lookup");

async function createLookup(req, res) {
  const { typeId, typeCode, typeName } = req.body;

  try {
    const lookup = await Lookup.create({ typeId, typeCode, typeName });
    res.status(201).json({ message: "Lookup created successfully", lookup });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getAllLookups(req, res) {
  try {
    const lookups = await Lookup.findAll();
    res.status(200).json(lookups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getLookupById(req, res) {
  const { typeId } = req.params;

  try {
    const lookup = await Lookup.findByPk(typeId);
    if (!lookup) {
      return res.status(404).json({ message: "Lookup not found" });
    }
    res.status(200).json(lookup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateLookup(req, res) {
  const { typeId } = req.params;
  const { typeCode, typeName } = req.body;

  try {
    const lookup = await Lookup.findByPk(typeId);
    if (!lookup) {
      return res.status(404).json({ message: "Lookup not found" });
    }

    await lookup.update({ typeCode, typeName });
    res.status(200).json({ message: "Lookup updated successfully", lookup });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteLookup(req, res) {
  const { typeId } = req.params;

  try {
    const lookup = await Lookup.findByPk(typeId);
    if (!lookup) {
      return res.status(404).json({ message: "Lookup not found" });
    }

    await lookup.destroy();
    res.status(200).json({ message: "Lookup deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {createLookup, getAllLookups,getLookupById, updateLookup,deleteLookup};
