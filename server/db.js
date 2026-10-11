import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const opts = { versionKey: false };

const Project = model('Project', new Schema({
  slug: { type: String, unique: true },
  order: Number,
  title: String,
  year: String,
  role: String,
  status: String,
  stack: [String],
  summary: String,
  description: String,
  highlights: [String],
  live: String,
  repo: String,
  image: String,
}, opts));

const Experience = model('Experience', new Schema({
  slug: { type: String, unique: true },
  order: Number,
  kind: String,
  org: String,
  role: String,
  start: String,
  end: String,
  location: String,
  summary: String,
  points: [String],
  stack: [String],
}, opts));

const Signature = model('Signature', new Schema({
  name: { type: String, required: true, maxlength: 40 },
  note: { type: String, required: true, maxlength: 140 },
  createdAt: { type: Date, default: Date.now },
}, opts));

const Message = model('Message', new Schema({
  name: { type: String, required: true, maxlength: 80 },
  email: { type: String, required: true, maxlength: 120 },
  topic: { type: String, maxlength: 60 },
  body: { type: String, required: true, maxlength: 4000 },
  createdAt: { type: Date, default: Date.now },
}, opts));

const clean = ({ _id, order, ...rest }) => ({ id: String(_id), ...rest });
const withOrder = (list) => list.map((item, order) => ({ ...item, order }));

async function mongoStore(content) {
  // content.js is the source of truth: mirror it into the database on boot.
  await Project.deleteMany({});
  await Project.insertMany(withOrder(content.projects));
  await Experience.deleteMany({});
  await Experience.insertMany(withOrder(content.experience));

  return {
    mode: 'mongodb',
    projects: async () => (await Project.find().sort('order').lean()).map(clean),
    experience: async () => (await Experience.find().sort('order').lean()).map(clean),
    signatures: async (limit) =>
      (await Signature.find().sort('-createdAt').limit(limit).lean()).map(clean),
    addSignature: async (doc) => clean((await Signature.create(doc)).toObject()),
    removeSignature: async (id) =>
      mongoose.isValidObjectId(id) && !!(await Signature.findByIdAndDelete(id)),
    addMessage: async (doc) => clean((await Message.create(doc)).toObject()),
    messages: async () => (await Message.find().sort('-createdAt').lean()).map(clean),
  };
}

function memoryStore(content) {
  const sigs = [];
  const msgs = [];
  let seq = 0;
  const make = (doc) => ({ id: String(++seq), ...doc, createdAt: new Date() });
  const tag = (list) => list.map((item) => ({ id: item.slug, ...item }));

  return {
    mode: 'memory',
    projects: async () => tag(content.projects),
    experience: async () => tag(content.experience),
    signatures: async (limit) => sigs.slice(0, limit),
    addSignature: async (doc) => { const s = make(doc); sigs.unshift(s); return s; },
    removeSignature: async (id) => {
      const i = sigs.findIndex((s) => s.id === id);
      if (i === -1) return false;
      sigs.splice(i, 1);
      return true;
    },
    addMessage: async (doc) => { const m = make(doc); msgs.unshift(m); return m; },
    messages: async () => msgs,
  };
}

export async function createStore(uri, content) {
  if (uri) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 6000 });
      return await mongoStore(content);
    } catch (err) {
      console.warn(`[db] MongoDB unavailable (${err.message}). Falling back to memory.`);
    }
  } else {
    console.warn('[db] No MONGODB_URI set. Guestbook and letters will live in memory only.');
  }
  return memoryStore(content);
}
