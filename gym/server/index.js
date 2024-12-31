import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import {
  Equipment,
  MonthlyPlans,
  Subscriptions,
  Users,
  WorkoutPlans,
} from './schema.js';

const app = express();

app.use(express.json());
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

const PORT = 6001;
mongoose
  .connect('mongodb://127.0.0.1:27017/GymSystem', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.post('/register', async (req, res) => {
      try {
        const { username, email, password, type } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new Users({
          username,
          email,
          password: passwordHash,
          type,
        });

        const user = await newUser.save();

        res.status(200).json(user);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.post('/login', async (req, res) => {
      try {
        const { email, password } = req.body;
        const user = await Users.findOne({ email: email });
        if (!user) return res.status(400).json({ msg: 'User does not exist' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return res.status(400).json({ msg: 'Invalid credentials' });

        res.status(200).json(user);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // Fetch all users

    app.get('/fetch-users', async (req, res) => {
      try {
        const users = await Users.find();
        res.status(200).json(users);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // Fetch user by id
    app.get('/fetch-user/:id', async (req, res) => {
      try {
        const user = await Users.findById(req.params.id);
        res.status(200).json(user);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // fetch all equipment
    app.get('/fetch-equipment', async (req, res) => {
      try {
        const equipment = await Equipment.find();
        res.status(200).json(equipment);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // Add equipment
    app.post('/add-equipment', async (req, res) => {
      try {
        const { name, targetMuscles, quantity, description, image } = req.body;
        const newEquipment = new Equipment({
          name,
          targetMuscles,
          quantity,
          description,
          image,
        });
        const equipment = await newEquipment.save();
        res.status(200).json(equipment);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // update equipment quantity
    app.post('/update-equipment-quantity', async (req, res) => {
      try {
        const { id, quantity } = req.body;
        const equipment = await Equipment.findById(id);
        equipment.quantity = quantity;
        const updatedEquipment = await equipment.save();
        res.status(200).json(updatedEquipment);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // Delete equipment
    app.delete('/delete-equipment/:id', async (req, res) => {
      try {
        const equipment = await Equipment.findById(req.params.id);
        const deletedEquipment = await equipment.delete();
        res.status(200).json(deletedEquipment);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // Fetch all workout plans
    app.get('/fetch-workout-plans', async (req, res) => {
      try {
        const workoutPlans = await WorkoutPlans.find();
        console.log("workout plans api",workoutPlans)
        res.status(200).json(workoutPlans);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // Fetch workout plan by id
    app.get('/fetch-workout-plan/:id', async (req, res) => {
      try {
        const workoutPlan = await WorkoutPlans.findById(req.params.id);
        res.status(200).json(workoutPlan);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // Add workout plan
    app.post('/add-workout-plan', async (req, res) => {
      try {
        const {
          title,
          image,
          targetMuscles,
          trainerId,
          trainer,
          duration,
          daySchedule,
        } = req.body;
        const newWorkoutPlan = new WorkoutPlans({
          title,
          image,
          targetMuscles,
          trainerId,
          trainer,
          duration,
          daySchedule,
        });
        const workoutPlan = await newWorkoutPlan.save();
        res.status(200).json(workoutPlan);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // Update workout plan
    app.post('/update-workout-plan', async (req, res) => {
      try {
        const {
          id,
          title,
          image,
          targetMuscles,
          trainerId,
          trainer,
          duration,
          daySchedule,
        } = req.body;
        const workoutPlan = await WorkoutPlans.findById(id);
        workoutPlan.title = title;
        workoutPlan.image = image;
        workoutPlan.targetMuscles = targetMuscles;
        workoutPlan.trainerId = trainerId;
        workoutPlan.trainer = trainer;
        workoutPlan.duration = duration;
        workoutPlan.daySchedule = daySchedule;
        const updatedWorkoutPlan = await workoutPlan.save();
        res.status(200).json(updatedWorkoutPlan);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // Delete workout plan
    app.delete('/delete-workout-plan/:id', async (req, res) => {
      try {
        const workoutPlan = await WorkoutPlans.findById(req.params.id);
        const deletedWorkoutPlan = await workoutPlan.delete();
        res.status(200).json(deletedWorkoutPlan);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // Join workout plan
    app.post('/join-workout-plan', async (req, res) => {
      try {
        const { userId, planId } = req.body;
        const user = await Users.findById(userId);
        user.workoutPlan = planId;
        const updatedUser = await user.save();

        const workoutPlan = await WorkoutPlans.findById(planId);
        workoutPlan.subscribers.push(userId);
        const updatedWorkoutPlan = await workoutPlan.save();

        res.status(200).json(updatedWorkoutPlan);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // Fetch all monthly plans
    app.get('/fetch-monthly-plans', async (req, res) => {
      try {
        const monthlyPlans = await MonthlyPlans.find();
        res.status(200).json(monthlyPlans);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // Fetch all monthly plan subscriptions
    app.get('/fetch-subscriptions', async (req, res) => {
      try {
        const subscriptions = await Subscriptions.find();
        res.status(200).json(subscriptions);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // Add monthly plan
    app.post('/add-monthly-plan', async (req, res) => {
      try {
        const { title, description, image, amount, features } = req.body;
        const newMonthlyPlan = new MonthlyPlans({
          title,
          description,
          image,
          amount,
          features,
        });
        const monthlyPlan = await newMonthlyPlan.save();
        res.status(200).json(monthlyPlan);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // Update monthly plan
    app.post('/update-monthly-plan', async (req, res) => {
      try {
        const { id, title, description, image, amount, features } = req.body;
        const monthlyPlan = await MonthlyPlans.findById(id);
        monthlyPlan.title = title;
        monthlyPlan.description = description;
        monthlyPlan.image = image;
        monthlyPlan.amount = amount;
        monthlyPlan.features = features;
        const updatedMonthlyPlan = await monthlyPlan.save();
        res.status(200).json(updatedMonthlyPlan);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // Delete monthly plan
    app.delete('/delete-monthly-plan/:id', async (req, res) => {
      try {
        const monthlyPlan = await MonthlyPlans.findById(req.params.id);
        const deletedMonthlyPlan = await monthlyPlan.delete();
        res.status(200).json(deletedMonthlyPlan);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // subcribe to monthly plan
    app.post('/subscribe', async (req, res) => {
      try {
        const { userId, planId, planTitle, planAmount, startDate, endDate } =
          req.body;
        const newSubscription = new Subscriptions({
          userId,
          planId,
          planTitle,
          planAmount,
          startDate,
          endDate,
        });
        const subscription = await newSubscription.save();

        const user = await Users.findById(userId);
        user.subscription = subscription;
        const updatedUser = await user.save();

        const monthlyPlan = await MonthlyPlans.findById(planId);
        monthlyPlan.subscribers.push(userId);
        const updatedMonthlyPlan = await monthlyPlan.save();

        res.status(200).json(subscription);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // Remove monthly subscription
    app.delete('/remove-subscription/:id', async (req, res) => {
      try {
        const subscription = await Subscriptions.findById(req.params.id);

        const user = await Users.findById(subscription.userId);
        user.subscription = '';
        const updatedUser = await user.save();

        const monthlyPlan = await MonthlyPlans.findById(subscription.planId);
        monthlyPlan.subscribers = monthlyPlan.subscribers.filter(
          (id) => id !== subscription.userId
        );
        const updatedMonthlyPlan = await monthlyPlan.save();

        const deletedSubscription = await subscription.delete();
        res.status(200).json(deletedSubscription);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.listen(PORT, () => {
      console.log(`Running @ ${PORT}`);
    });
  })
  .catch((e) => console.log(`Error in db connection ${e}`));
