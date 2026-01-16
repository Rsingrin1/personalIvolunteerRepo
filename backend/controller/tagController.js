import Tag from "../model/tagModel.js";

export const getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.status(200).json(tags || []);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const createTag = async (req, res) => {
  try {
    // normalize input
    const rawName = req.body.name;
    const rawSlug = req.body.slug;
    const rawDescription = req.body.description;

    const name = typeof rawName === "string" ? rawName.trim() : "";
    const slug = typeof rawSlug === "string" ? rawSlug.trim() : undefined;
    const description = typeof rawDescription === "string" ? rawDescription.trim() : undefined;

    if (!name) {
      return res.status(400).json({ message: "Tag name is required." });
    }

    // avoid duplicates by name
    const exists = await Tag.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Tag already exists." });
    }

    // construct data and only include optional fields when non-empty
    const tagData = { name };
    if (slug) tagData.slug = slug;
    if (description) tagData.description = description;

    const tag = new Tag(tagData);
    try {
      const saved = await tag.save();
      return res.status(201).json(saved);
    } catch (err) {
      // handle duplicate-key (unique) errors gracefully
      // Mongo duplicate key error code is 11000
      if (err && (err.code === 11000 || err.name === "MongoServerError")) {
        // attempt to parse which field caused duplicate
        const dupField = err.keyValue ? Object.keys(err.keyValue)[0] : null;
        const message = dupField
          ? `Duplicate value for field '${dupField}'.` 
          : "Duplicate key error.";
        return res.status(400).json({ message });
      }
      throw err; // rethrow to be caught by outer catch
    }
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Tag.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Tag not found." });
    }
    res.status(200).json({ message: "Tag deleted.", tag: deleted });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export default { getAllTags, createTag, deleteTag };
