import mongoose from 'mongoose';

const users = mongoose.Schema({
  userId: String,
  email: String,
  password: String,
  type: String,
  workoutPlan: String,
  subscription: String,
});

const equipment = mongoose.Schema({
  name: String,
  targetMuscles: Array,
  quantity: Number,
  description: String,
  image: String,
});

const monthlyPlans = mongoose.Schema({
  title: String,
  description: String,
  image: String,
  amount: Number,
  features: Array,
  subscribers: {
    type: Array,
    default: [],
  },
  expired: {
    type: Boolean,
    default: false,
  },
});

const subscriptions = mongoose.Schema({
  userId: String,
  planId: String,
  planTitle: String,
  planAmount: Number,
  startDate: String,
  endDate: String,
});

const workoutPlans = mongoose.Schema({
  title: String,
  image: String,
  targetMuscles: Array,
  trainerId: String,
  trainer: String,
  duration: Number,
  daySchedule: [{ day: String, exercises: Array }],
  subscribers: Array,
});

export const Users = mongoose.model('users', users);
export const Equipment = mongoose.model('equipment', equipment);
export const MonthlyPlans = mongoose.model('monthlyplans', monthlyPlans);
export const Subscriptions = mongoose.model('subscriptions', subscriptions);
export const WorkoutPlans = mongoose.model('workoutplans', workoutPlans);
